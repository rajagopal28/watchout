angular.module('watchout.movie-controllers', [])
.controller('MovieGenresCtrl', function($scope, $filter, $ionicLoading, $cordovaSQLite, MovieGenres) {
 
  $scope.setGenres = function() {
    $scope.movieGenres =  MovieGenres.all();
      if($scope.movieGenres.length == 0) {
        // console.log('Calling in MovieGenres');
        $ionicLoading.show({
          template: 'Loading...'
        });
        MovieGenres.init($scope);
      }
  };
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
          // console.log('Fetched genre : ' + genreItem.id);
        }
        // console.log('Calling controller save');
        MovieGenres.saveFavoriteGenres(selectedGenres);
      } else {
        // console.log('No Rows...');
      }
      $scope.setGenres();
    });
    
  } else {
    $scope.setGenres();
  }
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  }
  $scope.remove = function(movieGenre) {
    MovieGenres.remove(movieGenre);
  };
   $scope.saveFavoriteGenre = function() {
  // console.log('Saving favourite genre');
    var selectedGenres = $filter("filter")($scope.movieGenres, {checked: true});
    
    var query = "delete from favouritemoviegenres";
    $cordovaSQLite.execute(db, query);
    // save genres
    for (var index in selectedGenres) {
     query = "INSERT INTO favouritemoviegenres(genreid, genrename,lastmodifiedts,createdts) VALUES(?,?,?,?)";
     var genre = selectedGenres[index];
     var now = (new Date()).getTime();
      $cordovaSQLite.execute(db,query,[genre.id, genre.name, now, now]).then(function(results){
        // console.log("Genre : " + genre["id"] + " value =" + JSON.stringify(genre));
        // console.log("INSERT ID -> " + results.insertId);
      }, function (err) {
          // console.error(err);
          // console.log('ERROR:'+ err.message);
      });
    }// end for
    
    // console.log(selectedGenres);
 };
})

.controller('MovieCtrl',  function($scope,$stateParams,$filter, $cordovaSQLite, $ionicLoading, Movies, MovieGenres){
  // Movies.init($scope);
  $scope.movies = Movies.all();
  $scope.selected = {
    movieName : ''
  };
  $scope.searchMovies = function() {
    // console.log('Typing.. ' + $scope.selected.movieName);
    var filtered = $filter("filter")(Movies.all(), {title : $scope.selected.movieName});
    // console.log(filtered);
    $scope.movies = filtered;
  }
  $scope.remove = function(movie) {
    Movies.remove(movie);
  };
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
  $scope.fetchMoreMovies = function() {
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
              // console.log('Fetched genre : ' + genreItem.id);
            }
            MovieGenres.saveFavoriteGenres(selectedGenres);
            Movies.reset();
            // console.log('Calling controller save');
          } else {
            // console.log('No Rows...');
          }// end else
          $ionicLoading.show({
            template: 'Loading...'
          });
          // console.log('Fetching More Movies 1...');
          Movies.loadMore($scope);
        });
      
    } else {
      $ionicLoading.show({
        template: 'Loading...'
      });
      // console.log('Fetching More Movies 2...');
      Movies.loadMore($scope);
    }// end if
    // $scope.apply();
    // Movies.init();
    
  }
  $scope.$on('$stateChangeSuccess', function() {
    if(!$scope.movies || $scope.movies.length == 0) {
      $scope.fetchMoreMovies();
    }
  });
})
.controller('MovieDetailCtrl',  function($scope,$stateParams,$cordovaSQLite,$ionicPopup, $ionicLoading, Movies,MovieSearch, MovieDetail){
  
  // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
  var query = "SELECT id,is_favourite, is_alerted, alert_enabled, alertondate FROM favouritemovies WHERE movieid = ? ";
  $cordovaSQLite.execute(db, query, [$stateParams.movieId]).then(function(res) {
      var selectedRecord = {};
      if(res.rows.length > 0) {
          
          selectedRecord.isFavourite =  res.rows.item(0).is_favourite;
          selectedRecord.isAlerted =  res.rows.item(0).is_alerted;
          selectedRecord.alertEnabled = res.rows.item(0).alert_enabled;
          selectedRecord.alertDate = new Date(res.rows.item(0).alertondate).toDateString();
          selectedRecord.id = res.rows.item(0).id;
          console.log("selectedRecord=" + JSON.stringify(selectedRecord));
          MovieDetail.setMetaData(selectedRecord);
          
      } else {
          // console.log("No results found");
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
        $scope.movie.isReleased = new Date($scope.movie.release_date).getTime() - new Date().getTime() < 0;
        $scope.movie.isFavourite = selectedRecord.isFavourite == FLAG_STRING_YES;
        $scope.movie.isAlerted = selectedRecord.isAlerted == FLAG_STRING_YES;
        $scope.movie.alertEnabled = selectedRecord.alertEnabled == FLAG_STRING_YES;
        $scope.movie.alertDate = selectedRecord.alertDate;
      }
  }, function (err) {
      // console.error(err);
  });
  $scope.selected = {};
  $scope.setFavourite = function() {
   
    var query = "INSERT OR IGNORE INTO favouritemovies (movieid, moviename, is_favourite,"
              + " movie_genre_labels,release_date, poster_path, lastmodifiedts, createdts) VALUES (?,?,?,?,?,?,?,?)";
    var poster_path = $scope.movie.poster_path;
    if(!poster_path || poster_path.indexOf("nopicture") != -1){
      poster_path = '';
    } else {
      poster_path = poster_path.substring(poster_path.lastIndexOf("/"));
    }
    $cordovaSQLite.execute(db, query, [$scope.movie.id, $scope.movie.original_title, 'Y', $scope.movie.movie_genre_labels,$scope.movie.release_date,poster_path , (new Date()).getTime(),(new Date()).getTime()]).then(function(res) {
        // console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
        // console.error(err);
        // console.log('ERROR:'+ err.message);
    });
   
    $scope.updateFlag('is_favourite', 'Y');
    $scope.movie.isFavourite = true;
  };
  $scope.removeFavourite = function() {
    $scope.updateFlag('is_favourite', 'N');
    $scope.movie.isFavourite = false;
  };
  $scope.alertMovie = function(statusFlag) {
    // console.log('alertMovie statusFlag='+statusFlag);
    $scope.movie.alertEnabled = statusFlag;
    // console.log($scope.selected);
    $scope.updateFlag('alert_enabled', statusFlag ? 'Y' : 'N');
    
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
                  // console.log("No results found");
              }
              // console.log("lastnotificationid = " + lastnotificationid);
              $scope.addNotification(lastnotificationid + 1);
          }, function (err) {
              // console.error(err);
          });
    } else {
      // remove the scheduled notification by fetching the id from DB UPDATE
      // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
      var query = "SELECT notificationid FROM favouritemovies where movieid = ?";
          $cordovaSQLite.execute(db, query, [$scope.movie.id]).then(function(res) {
              var notificationid = 1;
              if(res.rows.length > 0) {                
                  // console.log($scope.movie);                  
                  if(res.rows.item(0).notificationid) {
                    notificationid = parseInt(res.rows.item(0).notificationid);
                  }
                  cancelNotification({'id' : notificationid},window,$scope);
              } else {
                  // console.log("No results found");
              }
          }, function (err) {
              // console.error(err);
          });
          
    }
    
  };
$scope.showPopup = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl: 'templates/alert-schedule-popup.html',
    title: 'When to Alert?',
    subTitle: 'Please Choose one',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Ok</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.selected.alertInterval) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.selected.alertInterval;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
    $scope.alertMovie(true);
  });
 };
  $scope.addNotification = function(notificationId) {
    var alertTime = new Date($scope.movie.release_date).getTime();
    var notificationMessage = "The movie *"
                              + $scope.movie.original_title
                              + "* is about to be aired "
                              + $scope.movie.release_date;
    var title = "Watchout a new movie";
    var alertInterval = $scope.selected.alertInterval;
    if(alertInterval) {
      alertTime -= alertInterval;
    }
    var notificationData = {};
    notificationData['alertondate'] = alertTime; 
    notificationData['id'] = notificationId;
    notificationData['title'] = title;
    notificationData['message'] = notificationMessage;
    addNotification(notificationData, window);
      // UPSERT into database
      var query = "INSERT OR IGNORE INTO favouritemovies (movieid, moviename"
                  + ",movie_genre_labels,release_date, poster_path"
                  + ",alert_enabled, alertondate, is_alerted, notificationid"
                  +",lastmodifiedts, createdts) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
      $cordovaSQLite.execute(db, query, [$scope.movie.id,$scope.movie.original_title,
                                            $scope.movie.movie_genre_labels,$scope.movie.release_date,poster_path ,
                                           'Y',alertTime,'N', notificationId, (new Date()).getTime(), (new Date()).getTime()]).then(function(res) {
         // console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
          // console.error(err);
      });
      // If already present update
      query = "UPDATE favouritemovies SET "
                  + "alert_enabled = ?, alertondate = ? , is_alerted =? ,"
                  + " notificationid = ? , lastmodifiedts = ? "
                  + " where movieid = ? " ;
      $cordovaSQLite.execute(db, query, ['Y',alertTime,'N', notificationId, (new Date()).getTime(),
                                $scope.movie.id])
      .then(function(res) {
          // console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
          // console.error(err);
      });
      $scope.movie.alertEnabled = true;
  }
  $scope.updateFlag = function(flagName, flagValueString) {
   
    query = "UPDATE favouritemovies SET "
                      + flagName + " = ? , lastmodifiedts = ?"
                      + " WHERE movieid = ? ";
    $cordovaSQLite.execute(db, query, [flagValueString , (new Date()).getTime(), $scope.movie.id]).then(function(res) {
        // console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
        // console.error(err);
        // console.log('ERROR:'+ err.message);
    });
  
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
    // console.log('Typing.. ' + $scope.selected.movieName);
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
      // console.log('Fetching More Movies...');
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
})


.controller('FavouriteMoviesCtrl',  function($scope,$stateParams,$filter,$cordovaSQLite, $ionicLoading, Configurations, MovieGenres){
  // Movies.init($scope);
  $scope.movies = [];
  $scope.favouriteMovies = [];
  MovieGenres.init();

  $scope.selected = {
    movieName : ''
  };
  $scope.fetchMovies = function() {
    return function() {
     
      // fetch favourite movies from database
     var query = "SELECT movieid, moviename, release_date,movie_genre_labels, poster_path FROM favouritemovies where is_favourite = 'Y'";
      $cordovaSQLite.execute(db, query, []).then(function(res) {
          if(res.rows.length > 0) { 
              $scope.favouriteMovies = [];
              $scope.movies=[];             
              var config = Configurations.getConfigurations();  
              for(var index=0; index < res.rows.length; index++ ) {
                var newMovie = {};
                newMovie.id = res.rows.item(index).movieid;
                newMovie.original_title = res.rows.item(index).moviename;
                newMovie.title = newMovie.original_title;
                newMovie.release_date = res.rows.item(index).release_date;
                var poster_path = res.rows.item(index).poster_path;
                if(poster_path && poster_path != '') {
                  if(poster_path.indexOf(config.images.base_url) != 0) {
                    poster_path = config.images.base_url  
                                        + config.images.poster_sizes[0]
                                        + poster_path;
                    newMovie.poster_path = poster_path;
                    console.log(poster_path);
                  }
                } else {
                    newMovie.poster_path = FALL_BACK_IMAGE_PARH;
                }
                
                newMovie.movie_genre_labels = res.rows.item(index).movie_genre_labels;
                $scope.favouriteMovies.push(newMovie);
              }
              $scope.movies = $scope.favouriteMovies.slice();
          } else {
              // console.log("No results found");
          }
          $scope.hideSpinner();
      }, function (err) {
          // console.error(err);
      });
    };
  };
  var config = Configurations.getConfigurations();
  $ionicLoading.show({
        template: 'Loading...'
      });
  if(!config || isObjectEmpty(config)) {
    Configurations.init($scope.fetchMovies());
  } else {
    $scope.fetchMovies()();
  }
  
  $scope.searchMovies = function() {
    // console.log('Typing.. ' + $scope.selected.movieName);
    $scope.movies = $filter("filter")($scope.favouriteMovies, {title : $scope.selected.movieName});
  }
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
});