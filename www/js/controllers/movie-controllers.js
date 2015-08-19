angular.module('watchout.movie-controllers', [])
.controller('MovieGenresCtrl', function($scope, $filter, $ionicLoading, MovieGenres){ // $cordovaSQLite, MovieGenres) {
  /*
  var query = "select genreid from moviegenres";
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
  });*/
    
  //setTimeout(function(){
    $scope.movieGenres =  MovieGenres.all();
    if($scope.movieGenres.length == 0) {
      console.log('Calling in MovieGenres');
      $ionicLoading.show({
        template: 'Loading...'
      });
      MovieGenres.init($scope);
    }
  //}, 10);
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  }
  $scope.remove = function(movieGenre) {
    MovieGenres.remove(movieGenre);
  };
   $scope.saveFavoriteGenre = function() {
  console.log('Saving favourite genre');
    var selectedGenres = $filter("filter")($scope.movieGenres, {checked: true});
    /*db.transaction(function(tx){
      var query = "delete from moviegenres";
      tx.executeSql(query);
      // save genres
      for (var i = 0; i < selectedGenres.length; i++) {
          var retFn = getSaveGenresFunction(selectedGenres[i]["id"], tx,'moviegenres');
          retFn();
          console.log("Genre : " + selectedGenres[i]["id"] + " value =" + JSON.stringify(selectedGenres[i]));
      }
      tx.executeSql('select genreid from moviegenres', [], function(tx, res) {
        console.log("res = " + res.rows.length);
      });
    },
    function(e) {
      log('failed to delete from database: '+e.code);
    },
    function() {
      log('meeting deleted from db: ');
    } );*/
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
.controller('MovieDetailCtrl',  function($scope,$stateParams,$ionicLoading, Movies, MovieDetail){
  $scope.movie = Movies.get($stateParams.movieId);
  if(!$scope.movie || isObjectEmpty($scope.movie)) {
    MovieDetail.init();
    $ionicLoading.show({
        template: 'Loading...'
      });
    MovieDetail.loadMovieDetail($scope, $stateParams.movieId);
  }
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