angular.module('watchout.movie-controllers', [])
.controller('MovieGenresCtrl', function($scope, $filter,MovieGenres){ // $cordovaSQLite, MovieGenres) {
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
  //}, 10);
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

.controller('MovieCtrl',  function($scope,$stateParams,$filter, Movies){
  
  // Movies.init($scope);
  
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
  $scope.fetchMoreMovies = function() {
    // $scope.apply();
    // Movies.init();
    console.log('Fetching More Movies...');
    Movies.loadMore($scope);
  }
  $scope.$on('$stateChangeSuccess', function() {
    $scope.fetchMoreMovies();
  });
})
.controller('MovieDetailCtrl',  function($scope,$stateParams, Movies){
  $scope.movie = Movies.get($stateParams.movieId);
});