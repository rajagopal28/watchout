angular.module('watchout.tvshow-controllers', [])

.controller('TVGenresCtrl', function($scope, $filter, $ionicLoading, TVGenres){ // $cordovaSQLite, TVGenres) {
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
    if($scope.tvGenres.length == 0) {
      $ionicLoading.show({
        template: 'Loading...'
      });
      TVGenres.init($scope);
    }
  //}, 10);
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  }
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
.controller('TVShowCtrl',  function($scope,$stateParams,$ionicLoading, TVShows){
  $scope.tvShows = TVShows.all();
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
  $scope.remove = function(tvShow) {
    Movies.remove(tvShow);
  };
  $scope.fetchMoreTvShows = function() {
    // $scope.apply();
    // Movies.init();
    $ionicLoading.show({
      template: 'Loading...'
    });
    console.log('Fetching More TV Shows...');
    TVShows.loadMore($scope);
  }
  $scope.$on('$stateChangeSuccess', function() {
    if(!$scope.tvShows || $scope.tvShows.length == 0) {
      $scope.fetchMoreTvShows();
    }
  });
});