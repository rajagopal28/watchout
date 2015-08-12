angular.module('watchout.main-controllers', [])

.controller('MenuCtrl', function($scope,$stateParams,$window, $state,$ionicSideMenuDelegate, $ionicHistory) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
 $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
$scope.goState = function(stateName) {
  $ionicHistory.clearCache();
  $state.go(stateName, {}, {reload: true});
  setTimeout(function(){
    $window.location.reload(true);
  },100);
  
};
  /*
  // calling movie db to get configurations
  theMovieDb.configurations.getConfiguration(
    function(data) {
      console.log("in SuccessCB");
      console.log(arguments);
    }, 
    function(data){
      console.log("in ErrorCB");
      console.log(arguments);
    }); */
 // $scope.configuration = JSON.stringify();
})
.controller('HomeCtrl', function($scope,$stateParams, $ionicSideMenuDelegate){
  $scope.selected = {
    movieName : ''
  };
 
 $scope.searchMovieDB = function() {
  console.log('Typing.. ' + $scope.selected.movieName);
 };
})