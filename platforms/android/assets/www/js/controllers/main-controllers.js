angular.module('watchout.main-controllers', [])

.controller('MenuCtrl', function($scope,$stateParams,$window, $state,$ionicSideMenuDelegate, $ionicHistory, Configurations) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
 $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
   // Configurations.init();
$scope.goState = function(stateName, stateParams) {
  $ionicHistory.clearCache();
  $state.go(stateName, stateParams, {reload: true});
  
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