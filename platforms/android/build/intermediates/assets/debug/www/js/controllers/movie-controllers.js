angular.module('watchout.movie-controllers', [])
.controller('MovieGenresCtrl', function($scope, $filter, $ionicLoading, $cordovaSQLite, MovieGenres) {
  var genres = MovieGenres.getFavouriteGenres();
  if(!genres || genres.length==0) {
    var query = "select genreid from favouritemoviegenres";
    $cordovaSQLite.execute(db,query,[]).then(function(results){
      var selectedGenres = [];
      if(results.rows.length > 0) {
        for (var i = 0; i < results.rows.length; i++) {
          var genreItem = {};
          genreItem.id = results.rows.item(i).genreid;
          selectedGenres.push(genreItem);
          console.log('Fetched genre : ' + genreItem.id);
        }
        console.log('Calling controller save');
        MovieGenres.saveFavoriteGenres(selectedGenres);
      } else {
        console.log('No Rows...');
      }
      $scope.setGenres();
    });
  } else {
    $scope.setGenres();
  }
  $scope.setGenres = function() {
    $scope.movieGenres =  MovieGenres.all();
      if($scope.movieGenres.length == 0) {
        console.log('Calling in MovieGenres');
        $ionicLoading.show({
          template: 'Loading...'
        });
        MovieGenres.init($scope);
      }
  };
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  }
  $scope.remove = function(movieGenre) {
    MovieGenres.remove(movieGenre);
  };
   $scope.saveFavoriteGenre = function() {
  console.log('Saving favourite genre');
    var selectedGenres = $filter("filter")($scope.movieGenres, {checked: true});
    var query = "delete from favouritemoviegenres";
    $cordovaSQLite.execute(db, query);
    // save genres
    for (var index in selectedGenres) {
     query = "INSERT INTO favouritemoviegenres(genreid, genrename,lastmodifiedts,createdts) VALUES(?,?,?,?)";
     var genre = selectedGenres[index];
     var now = (new Date()).getTime();
      $cordovaSQLite.execute(db,query,[genre.id, genre.name, now, now]).then(function(results){
        console.log("Genre : " + genre["id"] + " value =" + JSON.stringify(genre));
        console.log("INSERT ID -> " + results.insertId);
      }, function (err) {
          console.error(err);
          console.log('ERROR:'+ err.message);
      });
    }// end for
    console.log(selectedGenres);
 };
})

.controller('MovieCtrl',  function($scope,$stateParams,$filter, $ionicLoading, Movies){
  // Movies.init($scope);
  $scope.movies = Movies.all();
  $scope.selected = {
    movieName : ''
  };
  $scope.searchMovies = function() {
    console.log('Typing.. ' + $scope.selected.movieName);
    var filtered = $filter("filter")(Movies.all(), {title : $scope.selected.movieName});
    console.log(filtered);
    $scope.movies = filtered;
  }
  $scope.remove = function(movie) {
    Movies.remove(movie);
  };
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
  $scope.fetchMoreMovies = function() {
    // $scope.apply();
    // Movies.init();
    $ionicLoading.show({
      template: 'Loading...'
    });
    console.log('Fetching More Movies...');
    Movies.loadMore($scope);
  }
  $scope.$on('$stateChangeSuccess', function() {
    if(!$scope.movies || $scope.movies.length == 0) {
      $scope.fetchMoreMovies();
    }
  });
})
.controller('MovieDetailCtrl',  function($scope,$stateParams,$cordovaSQLite, $ionicLoading, Movies,MovieSearch, MovieDetail){
  
  // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
  var query = "SELECT id,is_favourite, is_alerted, alertondate FROM favouritemovies WHERE movieid = ? ";
  $cordovaSQLite.execute(db, query, [$stateParams.movieId]).then(function(res) {
      var selectedRecord = {};
      if(res.rows.length > 0) {
          
          selectedRecord.isFavourite =  res.rows.item(0).is_favourite;
          selectedRecord.isAlerted =  res.rows.item(0).is_alerted;
          selectedRecord.alertEnabled = res.rows.item(0).alert_enabled;
          selectedRecord.alertDate = new Date(res.rows.item(0).alertondate);
          selectedRecord.id = res.rows.item(0).id;
          MovieDetail.setMetaData(selectedRecord);
          
      } else {
          console.log("No results found");
      }
      $scope.movie = Movies.get($stateParams.movieId);
      if(!$scope.movie || isObjectEmpty($scope.movie)) {
        $scope.movie = MovieSearch.get($stateParams.movieId);
      }
      if(!$scope.movie || isObjectEmpty($scope.movie)) {
        MovieDetail.init();
        $ionicLoading.show({
            template: 'Loading...'
          });
        MovieDetail.loadMovieDetail($scope, $stateParams.movieId);
      } else {
        $scope.movie.isFavourite = selectedRecord.isFavourite == 'Y';
        $scope.movie.isAlerted = selectedRecord.isAlerted == 'Y';
        $scope.movie.alertEnabled = selectedRecord.alertEnabled == 'Y';
        $scope.movie.alertDate = selectedRecord.alertDate.toDateString();
      }
  }, function (err) {
      console.error(err);
  });
  $scope.setFavourite = function() {
    var query = "INSERT OR IGNORE INTO favouritemovies (movieid, moviename, is_favourite, lastmodifiedts, createdts) VALUES (?,?,?,?,?)";
    $cordovaSQLite.execute(db, query, [$scope.movie.id, $scope.movie.original_title, 'Y' , (new Date()).getTime(),(new Date()).getTime()]).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
        console.error(err);
        console.log('ERROR:'+ err.message);
    });
    $scope.updateFlag('is_favourite', 'Y');
  };
  $scope.removeFavourite = function() {
    $scope.updateFlag('is_favourite', 'N');
  };
  $scope.alertMovie = function(statusFlag) {
    console.log('alertMovie statusFlag='+statusFlag);
    $scope.movie.alertEnabled = statusFlag;
    console.log($scope.selected);
    $scope.updateFlag('alert_enabled', statusFlag);
    
    if(statusFlag) {
      // add a scheduled notification by inserting to DB INSERT
      // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
      var query = "SELECT MAX(notificationid) as lastnotificationid FROM favouritemovies";
          $cordovaSQLite.execute(db, query, []).then(function(res) {
              var lastnotificationid = 0;
              if(res.rows.length > 0) {                
                  // console.log(res.rows.item(0).lastnotificationid);
                  if(res.rows.item(0).lastnotificationid) {
                    lastnotificationid = parseInt(res.rows.item(0).lastnotificationid);
                  }                  
              } else {
                  console.log("No results found");
              }
              console.log("lastnotificationid = " + lastnotificationid);
              $scope.addNotification(lastnotificationid + 1);
          }, function (err) {
              console.error(err);
          });
    } else {
      // remove the scheduled notification by fetching the id from DB UPDATE
      // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
      var query = "SELECT notificationid FROM favouritemovies where movieid = ?";
          $cordovaSQLite.execute(db, query, [$scope.movie.id]).then(function(res) {
              var notificationid = 1;
              if(res.rows.length > 0) {                
                  console.log($scope.movie);
                  notificationid = parseInt(res.rows.item(0).notificationid);
                  cancelNotification({'id' : notificationid},window,$scope)
              } else {
                  console.log("No results found");
              }
          }, function (err) {
              console.error(err);
          });
    }
  };

  $scope.addNotification = function(notificationId) {
    var alertTime = new Date($scope.movie.release_date).getTime();
    var notificationMessage = "The movie *"
                              + $scope.movie.original_title
                              + "* is about to be aired "
                              + $scope.movie.relase_date;
    var title = "Watchout a new movie";
    var notificationData = {};
    notificationData['alertondate'] = alertTime;
    notificationData['id'] = notificationId;
    notificationData['title'] = title;
    notificationData['message'] = notificationMessage;
    addNotification(notificationData, window);
      // UPSERT into database
     var query = "INSERT OR IGNORE INTO favouritemovies (movieid, "
                  + "alert_enabled, alertondate, is_alerted, notificationid"
                  +",lastmodifiedts, createdts) VALUES (?,?,?,?,?,?,?)";
      $cordovaSQLite.execute(db, query, [$scope.movie.id,
                                           'Y',alertTime,'N', notificationId, (new Date()).getTime(), (new Date()).getTime()]).then(function(res) {
         console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
          console.error(err);
      });
      // If already present update
      query = "UPDATE favouritemovies SET "
                  + "alert_enabled = ?, alertondate = ? , is_alerted =? ,"
                  + " notificationid = ? , lastmodifiedts = ? "
                  + " where movieid = ? " ;
      $cordovaSQLite.execute(db, query, ['Y',alertTime,'N', notificationId, (new Date()).getTime(),
                                $scope.movie.id])
      .then(function(res) {
          console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
          console.error(err);
      });
  }
  $scope.updateFlag = function(flagName, flagValueString) {
    query = "UPDATE favouritemovies SET "
                      + flagName + " = ? , lastmodifiedts = ?"
                      + " WHERE movieid = ? ";
    $cordovaSQLite.execute(db, query, [flagValueString , (new Date()).getTime(), $scope.movie.id]).then(function(res) {
        console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
        console.error(err);
        console.log('ERROR:'+ err.message);
    });
    $scope.movie.isFavourite = flagValueString == 'Y';
  };
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
})

.controller('MovieSearchCtrl',  function($scope,$stateParams,$filter, $ionicLoading, MovieSearch){
  // Movies.init($scope);
  $scope.movies = [];
  MovieSearch.init();
  $scope.selected = {
    movieName : ''
  };
  $scope.searchMovies = function() {
    console.log('Typing.. ' + $scope.selected.movieName);
    $scope.fetchMoreMovies();
  }
  $scope.remove = function(movie) {
    Movies.remove(movie);
  };
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
  $scope.fetchMoreMovies = function() {
    if($scope.selected.movieName != '') {
      // $scope.apply();
      // Movies.init();
      $ionicLoading.show({
        template: 'Loading...'
      });
      console.log('Fetching More Movies...');
      MovieSearch.loadMore($scope, $scope.selected.movieName);
    }
  }
  $scope.moreDataCanBeLoaded = function() {
    if($scope.selected.movieName.trim() == '') {
      return false;
    }
    return MovieSearch.isEndOfResults();
  }
  $scope.$on('$stateChangeSuccess', function() {
    if( $scope.selected.movieName != '' && !$scope.movies || $scope.movies.length == 0) {
      $scope.fetchMoreMovies();
    }
  });
});