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
.controller('TVShowSeasonsCtrl',  function($scope, $stateParams,$ionicLoading,$ionicPopover, TVShowSeasons){
  $scope.tvShowSeasons = TVShowSeasons.get($stateParams.showId);
  console.log($stateParams.showId);
  $scope.selected = {};
  $scope.selected.showId = $stateParams.showId;
  if(isObjectEmpty($scope.tvShowSeasons)){
    $ionicLoading.show({
      template: 'Loading...'
    });
    TVShowSeasons.init($stateParams.showId, $scope);
  }
  $ionicPopover.fromTemplateUrl('templates/season-options-menu.html', {
    scope: $scope,
  }).then(function(popover) {
      $scope.popup = popover;
  });
  $scope.showMenu = function($event, showSeasonId) {
    $scope.popup.show($event);
    $scope.selected.selectedSeason = showSeasonId;
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    console.log('showing popup for season :' + showSeasonId);
  };
  $scope.closePopover = function() {
    $scope.popup.hide();
  };
  $scope.setAllWatched = function() {
    console.log('setAllWatched');
    console.log($scope.selected);
    $scope.closePopover();
  };
  $scope.setAllUnWatched = function() {
    console.log('setAllUnWatched');
    console.log($scope.selected);
    $scope.closePopover();
  };
  $scope.setAllIgnored = function() {
    console.log('setAllIgnored');
    console.log($scope.selected);
    $scope.closePopover();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
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
})

.controller('TVShowEpisodesCtrl',  function($scope, $stateParams,$ionicLoading,$ionicPopover, TVShowEpisodes){
  $scope.tvShowEpisodes = TVShowEpisodes.get($stateParams.showId, $stateParams.seasonNumber);
  console.log($stateParams.showId + " season : " + $stateParams.seasonNumber);
  $scope.selected = {};
  $scope.selected.showId = $stateParams.showId;
  $scope.selected.seasonNumber = $stateParams.seasonNumber;
  if(isObjectEmpty($scope.tvShowEpisodes)){
    $ionicLoading.show({
      template: 'Loading...'
    });
    TVShowEpisodes.init($stateParams.showId,$stateParams.seasonNumber, $scope);
  }
  $ionicPopover.fromTemplateUrl('templates/season-options-menu.html', {
    scope: $scope,
  }).then(function(popover) {
      $scope.popup = popover;
  });
  $scope.showMenu = function($event, showEpisodeNumber) {
    $scope.popup.show($event);
    $scope.selected.selectedEpisode = showEpisodeNumber;
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    console.log('showing popup for season :' + showEpisodeNumber);
  };
  $scope.changeWatchedStatus = function(episodeNumber, episodeId) {
    console.log("episodeNumber ="+ episodeNumber + "episodeId="+episodeId);
  }
  $scope.closePopover = function() {
    $scope.popup.hide();
  };
  $scope.setAllWatched = function() {
    console.log('setAllWatched');
    console.log($scope.selected);
    $scope.closePopover();
  };
  $scope.setAllUnWatched = function() {
    console.log('setAllUnWatched');
    console.log($scope.selected);
    $scope.closePopover();
  };
  $scope.setAllIgnored = function() {
    console.log('setAllIgnored');
    console.log($scope.selected);
    $scope.closePopover();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
});