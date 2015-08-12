angular.module('watchout.tvshow-controllers', [])

.controller('TVGenresCtrl', function($scope, $filter,TVGenres){ // $cordovaSQLite, TVGenres) {
  /*
  var query = "select genreid from tvgenres";
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
      TVGenres.saveFavoriteGenres(selectedGenres);
    } else {
      console.log('No Rows...');
    }
  });*/
  //setTimeout(function(){
    $scope.tvGenres =  TVGenres.all();
  //}, 10);
  $scope.remove = function(tvGenre) {
    TVGenres.remove(tvGenre);
  };
   $scope.saveFavoriteGenre = function() {
  console.log('Saving favourite genre');
    var selectedGenres = $filter("filter")($scope.tvGenres, {checked: true});
    /*db.transaction(function(tx){
      var query = "delete from tvgenres";
      tx.executeSql(query);
      // save genres
      for (var i = 0; i < selectedGenres.length; i++) {
          var retFn = getSaveGenresFunction(selectedGenres[i]["id"], tx,'tvgenres');
          retFn();
          console.log("Genre : " + selectedGenres[i]["id"] + " value =" + JSON.stringify(selectedGenres[i]));
      }
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
.controller('TVShowDetailCtrl',  function($scope,$stateParams, TVShows){
  $scope.tvShow = TVShows.get($stateParams.showId);
})
.controller('TVShowCtrl',  function($scope,$stateParams, TVShows){
  $scope.tvShows = TVShows.all();
  $scope.remove = function(tvShow) {
    Movies.remove(tvShow);
  };
});