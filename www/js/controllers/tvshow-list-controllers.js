angular.module('watchout.tvshow-list-controllers', [])

.controller('TVGenresCtrl', function($scope, $filter, $cordovaSQLite, $ionicLoading, TVGenres, TVShows){ // $cordovaSQLite, TVGenres) {
  
  $scope.setGenres = function(){
    $scope.tvGenres =  TVGenres.all();
    if($scope.tvGenres.length == 0) {
      $ionicLoading.show({
        template: 'Loading...'
      });
      TVGenres.init($scope);
    }
  };
  var genres = TVGenres.getFavouriteGenres();
  if(!genres || genres.length==0) {
    
    var query = "select genreid from favouritetvgenres";
    $cordovaSQLite.execute(db,query,[]).then(function(results){
      var selectedGenres = [];
      if(results.rows.length > 0) {
        for (var i = 0; i < results.rows.length; i++) {
          var genreItem = {};
          genreItem.id = results.rows.item(i).genreid;
          selectedGenres.push(genreItem);
          // console.log('Fetched genre : ' + genreItem.id);
        }
        TVGenres.saveFavoriteGenres(selectedGenres);
        TVShows.reset();
        // console.log('Calling controller save');
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
  };
  $scope.remove = function(tvGenre) {
    TVGenres.remove(tvGenre);
  }; 
   $scope.saveFavoriteGenre = function() {
    // console.log('Saving favourite genre');
    var selectedGenres = $filter("filter")($scope.tvGenres, {checked: true});
    
    var query = "delete from favouritetvgenres";
    $cordovaSQLite.execute(db, query);
    // save genres
    for (var index in selectedGenres) {
     query = "INSERT INTO favouritetvgenres(genreid, genrename,lastmodifiedts,createdts) VALUES(?,?,?,?)";
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
    
    console.log(JSON.stringify(selectedGenres));
 };
})
.controller('TVShowCtrl',  function($scope,$filter,$stateParams,$cordovaSQLite,$ionicLoading,$state,$ionicHistory, TVShows, TVGenres){
  $scope.tvShows = TVShows.all();
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
  $scope.selected = {
    showName : ''
  };
  $scope.searchShows = function() {
    // console.log('Typing.. ' + $scope.selected.showName);
    var filtered = $filter("filter")(TVShows.all(), {name : $scope.selected.showName});
    // console.log(filtered);
    $scope.tvShows = filtered;
  };
  $scope.fetchMoreTvShows = function() {
    var genres = TVGenres.getFavouriteGenres();
    if(!genres || genres.length==0) {
     
       var query = "select genreid from favouritetvgenres";
        $cordovaSQLite.execute(db,query,[]).then(function(results){
          var selectedGenres = [];
          if(results.rows.length > 0) {
            for (var i = 0; i < results.rows.length; i++) {
              var genreItem = {};
              genreItem.id = results.rows.item(i).genreid;
              selectedGenres.push(genreItem);
              // console.log('Fetched genre : ' + genreItem.id);
            }
            TVGenres.saveFavoriteGenres(selectedGenres);
            TVShows.reset();
            // console.log('Calling controller save');
          } else {
            // console.log('No Rows...');
          }// end else
          $ionicLoading.show({
            template: 'Loading...'
          });
          // console.log('Fetching More TV Shows 1...');
          TVShows.loadMore($scope);
        });
    } else {
      $ionicLoading.show({
        template: 'Loading...'
      });
      // console.log('Fetching More TV Shows 2...');
      TVShows.loadMore($scope);
    }// end if
    // $scope.apply();
    
  };
  $scope.$on('$stateChangeSuccess', function() {
    if(!$scope.tvShows || $scope.tvShows.length == 0) {
      $scope.fetchMoreTvShows();
    }
  });
})
.controller('TVShowSearchCtrl',  function($scope,$filter,$stateParams,$ionicLoading,$state,$ionicHistory, TVShowSearch){
  $scope.tvShows = TVShowSearch.all();
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
  $scope.selected = {
    showName : ''
  };
  $scope.searchShows = function() {
    // console.log('Typing.. ' + $scope.selected.showName);
    if($scope.selected.showName && $scope.selected.showName != '') {
      $ionicLoading.show({
        template: 'Loading...'
      });
      console.log('Fetching More TV Shows...1');
      TVShowSearch.loadMore($scope, $scope.selected.showName);
    }
  }
  $scope.moreDataCanBeLoaded = function() {
    if($scope.selected.showName.trim() == '') {
      return false;
    }
    return TVShowSearch.isEndOfResults();
  }
  $scope.$on('$stateChangeSuccess', function() {
    if( $scope.selected.showName != '' && !$scope.tvShows || $scope.tvShows.length == 0) {
      $scope.searchShows();
    }
  });
})
.controller('FavouriteTVShowsCtrl',  function($scope,$stateParams,$filter,$cordovaSQLite, $ionicLoading, Configurations, TVGenres){
  // TVShows.init($scope);
  $scope.tvShows = [];
  $scope.favouriteTVShows = [];
  TVGenres.init();
  
  $scope.selected = {
    tvShowName : ''
  };
  $scope.fetchTVShows = function() {
    return function() {
      // fetch favourite tvShows from database
     var query = "SELECT showid, showname, first_air_date,show_genre_labels, poster_path FROM favouritetvshows where is_favourite = 'Y'";
      $cordovaSQLite.execute(db, query, []).then(function(res) {
          if(res.rows.length > 0) { 
              var config = Configurations.getConfigurations();
              $scope.favouriteTVShows = [];
              $scope.tvShows=[];               
              for(var index=0; index < res.rows.length; index++ ) {
                var newTVShow = {};
                newTVShow.id = res.rows.item(index).showid;
                newTVShow.original_name = res.rows.item(index).showname;
                newTVShow.first_air_date = res.rows.item(index).first_air_date;
                var poster_path = res.rows.item(index).poster_path;
                if(poster_path && poster_path != '') {
                  console.log(poster_path);
                  if(poster_path.indexOf(config.images.base_url) != 0) {
                    poster_path = config.images.base_url  
                                        + config.images.poster_sizes[0]
                                        + poster_path;
                    newTVShow.poster_path = poster_path;
                    console.log(poster_path);
                  }
                } else {
                    newTVShow.poster_path = FALL_BACK_IMAGE_PARH;
                }
                newTVShow.show_genre_labels = res.rows.item(index).show_genre_labels;
                $scope.favouriteTVShows.push(newTVShow);
              }
              $scope.tvShows = $scope.favouriteTVShows.slice();
          } else {
              // console.log("No results found");
          }
          $scope.hideSpinner();
      }, function (err) {
          // console.error(err);
      });
    };
  };
  $ionicLoading.show({
    template: 'Loading...'
  });
  var config = Configurations.getConfigurations();
  if(!config || isObjectEmpty(config)) {
    Configurations.init($scope.fetchTVShows());
  } else {
    $scope.fetchTVShows()();
  }
  
  
  $scope.searchShows = function() {
    // console.log('Typing.. ' + $scope.selected.tvShowName);
    $scope.tvShows = $filter("filter")($scope.favouriteTVShows, {title : $scope.selected.tvShowName});
  }
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
});