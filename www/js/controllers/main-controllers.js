angular.module('watchout.main-controllers', [])

.controller('MenuCtrl', function($scope,$stateParams,$window, $state,$ionicSideMenuDelegate, $ionicHistory, Configurations) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
 $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
   // Configurations.init();
$scope.goState = function(stateName) {
  $ionicHistory.clearCache();
  $state.go(stateName, {}, {reload: true});
  setTimeout(function(){
    $window.location.reload(true);
  },100);
};
})
.controller('HomeCtrl', function($scope,$stateParams, $ionicSideMenuDelegate){
  $scope.selected = {
    movieName : ''
  };
 
 // $scope.configuration = JSON.stringify();
 $scope.searchMovieDB = function() {
  console.log('Typing.. ' + $scope.selected.movieName);
 };
})