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
.controller('TVShowDetailCtrl',  function($scope,$stateParams,$ionicLoading, TVShows, TVShowSearch, TVShowDetail){
  console.log("state show Id =" + $stateParams.showId);
  if(!$stateParams.showId) {
    console.log('scope show id =' + $scope.showId);
    $stateParams.showId = $scope.showId;
  }
  $scope.tvShow = TVShows.get($stateParams.showId);
  if(!$scope.tvShow || isObjectEmpty($scope.tvShow)) {
    $scope.tvShow = TVShowSearch.get($stateParams.showId);
  }
  if(!$scope.tvShow || isObjectEmpty($scope.tvShow)) {
    TVShowDetail.init();
    $ionicLoading.show({
        template: 'Loading...'
      });
    TVShowDetail.loadTvShowDetail($scope, $stateParams.showId);
  }
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
})

.controller('TVShowHomeCtrl',  function($scope,$stateParams){
  $scope.showId = $stateParams.showId;  
  console.log($stateParams);
  console.log('moving state params' + $scope.showId);
})

.controller('TVShowSeasonsCtrl',  function($scope, $stateParams,$ionicLoading,$ionicPopover, TVShowSeasons){
  $scope.tvShowSeasons = TVShowSeasons.get($stateParams.showId);
  console.log($stateParams.showId);
  $scope.selected = {};
  $scope.selected.showId = $stateParams.showId;

  /*
    // Fetch the watched episodes count for this show ==> all seasons
    // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
    var query = "SELECT seasonnumber, count(episodenumber) as watchedcount FROM watchedepisodes WHERE showid = ? group by seasonnumber";
        $cordovaSQLite.execute(db, query, [$scope.selected.showId]).then(function(res) {
            var allRecords = [];
            if(res.rows.length > 0) {
                console.log($scope.tvShowSeasons);
                for(var index = 0 ; index < res.rows.length; index ++) {
                  var selectedRecord = {};
                  selectedRecord.watchedcount = res.rows.item(0).watchedcount;
                  selectedRecord.seasonnumber =  res.rows.item(0).seasonnumber;
                  var temp = {};
                  temp[selectedRecord.seasonnumber] = selectedRecord;
                  allRecords.push(temp);
                }

                TVShowSeasons.setMetaData(allRecords);
                if(isObjectEmpty($scope.tvShowSeasons)){
                    $ionicLoading.show({
                      template: 'Loading...'
                    });
                    TVShowSeasons.init($stateParams.showId, $scope);
                }                
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
  */
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
    $scope.popup.remove();
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
.controller('TVShowCtrl',  function($scope,$filter,$stateParams,$ionicLoading,$state,$ionicHistory, TVShows){
  $scope.tvShows = TVShows.all();
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
  $scope.selected = {
    showName : ''
  };
  $scope.searchShows = function() {
    console.log('Typing.. ' + $scope.selected.showName);
    var filtered = $filter("filter")(TVShows.all(), {name : $scope.selected.showName});
    console.log(filtered);
    $scope.tvShows = filtered;
  }
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
.controller('TVShowSearchCtrl',  function($scope,$filter,$stateParams,$ionicLoading,$state,$ionicHistory, TVShowSearch){
  $scope.tvShows = TVShowSearch.all();
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
  $scope.selected = {
    showName : ''
  };
  $scope.searchShows = function() {
    console.log('Typing.. ' + $scope.selected.showName);
    $ionicLoading.show({
      template: 'Loading...'
    });
    console.log('Fetching More TV Shows...');
    TVShowSearch.loadMore($scope, $scope.selected.showName);
  }
  $scope.fetchMoreTvShows = function() {
    // $scope.apply();
    // Movies.init();
    $ionicLoading.show({
      template: 'Loading...'
    });
    console.log('Fetching More TV Shows...');
    TVShowSearch.loadMore($scope, $scope.selected.showName);
  }
  $scope.moreDataCanBeLoaded = function() {
    if($scope.selected.showName.trim() == '') {
      return false;
    }
    return TVShowSearch.isEndOfResults();
  }
  $scope.$on('$stateChangeSuccess', function() {
    if( $scope.selected.showName != '' && !$scope.tvShows || $scope.tvShows.length == 0) {
      $scope.fetchMoreTvShows();
    }
  });
})

.controller('TVShowEpisodesCtrl',  function($scope,$state, $stateParams,$ionicLoading,$ionicPopover, TVShowEpisodes, TVShowEpisodeDetail){
  $scope.tvShowEpisodes = TVShowEpisodes.get($stateParams.showId, $stateParams.seasonNumber, $stateParams.episodeNumber);
  console.log($stateParams.showId + " season : " + $stateParams.seasonNumber);
  $scope.selected = {};
  $scope.selected.showId = $stateParams.showId;
  $scope.selected.seasonNumber = $stateParams.seasonNumber;
  $scope.selected.episodeNumber = $stateParams.episodeNumber;
  $scope.currentIndex = 0;
  $scope.totalResults = 0;
  /*
    // Fetch the watched episodes status for this show and season
    // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
    var query = "SELECT episodenumber, is_watched,is_favourite FROM watchedepisodes WHERE showid = ? and seasonnumber = ?";
        $cordovaSQLite.execute(db, query, [$scope.selected.showId, $scope.selected.seasonNumber]).then(function(res) {
            var allRecords = [];
            if(res.rows.length > 0) {
                console.log($scope.tvShowSeasons);
                for(var index = 0 ; index < res.rows.length; index ++) {
                  var selectedRecord = {};
                  selectedRecord.is_watched = res.rows.item(0).watchedcount;
                  selectedRecord.episodenumber =  res.rows.item(0).episodenumber;
                  selectedRecord.is_favourite = res.rows.item(0).is_favourite;
                  var temp = {};
                  temp[selectedRecord.episodenumber] = selectedRecord;
                  allRecords.push(temp);
                }

                TVShowEpisodes.setMetaData(allRecords);
                console.log($stateParams);
                if(isObjectEmpty($scope.tvShowEpisodes)){
                  $ionicLoading.show({
                    template: 'Loading...'
                  });
                  TVShowEpisodes.init($stateParams.showId,$stateParams.seasonNumber,$stateParams.episodeNumber, $scope);
                }                
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
  */

  $scope.next = function() {
    console.log($scope.tvShowEpisodes.episodes);
    var indexValue = parseInt($scope.currentIndex) + 1;
    console.log('Next : ' + $scope.currentIndex + " length =" + $scope.tvShowEpisodes.episodes.length);
    if($scope.tvShowEpisodes && $scope.tvShowEpisodes.episodes && $scope.tvShowEpisodes.episodes.length > indexValue) {
      $scope.currentIndex = indexValue;
      console.log('Next : ' + $scope.currentIndex );
      console.log($scope.tvShowEpisodes.episodes[$scope.currentIndex]);
      var episodeNumber = $scope.tvShowEpisodes.episodes[$scope.currentIndex].episode_number;
      TVShowEpisodeDetail.init($scope.selected.showId, $scope.selected.seasonNumber, episodeNumber, null);
     }
  };
  $scope.previous = function() {
    var indexValue =  parseInt($scope.currentIndex) - 1;
    if($scope.tvShowEpisodes && $scope.tvShowEpisodes.episodes &&  indexValue >= 0 ) {
      $scope.currentIndex = indexValue;
      var episodeNumber = $scope.tvShowEpisodes.episodes[$scope.currentIndex].episode_number;
      TVShowEpisodeDetail.init($scope.selected.showId, $scope.selected.seasonNumber, episodeNumber, null);
     }
  };
  $scope.goToEpisode = function(episodeNumber) {
      if($stateParams.episodeNumber && $scope.tvShowEpisodes && $scope.tvShowEpisodes.episodes) {
        $scope.totalResults = $scope.tvShowEpisodes.episodes.length;
        for(var index in $scope.tvShowEpisodes.episodes) {
          if($scope.tvShowEpisodes.episodes[index].episode_number == $stateParams.episodeNumber) {
            $scope.currentIndex = index;
            break;
          }
        }
    }
    $scope.selected.episodeNumber = episodeNumber;
    $state.go('app.tvshow-all-episodes.selected',$scope.selected);
    
  };
  if($stateParams.episodeNumber) {
    $scope.goToEpisode($stateParams.episodeNumber);
  }
  console.log($stateParams);
  if(isObjectEmpty($scope.tvShowEpisodes)){
    $ionicLoading.show({
      template: 'Loading...'
    });
    TVShowEpisodes.init($stateParams.showId,$stateParams.seasonNumber,$stateParams.episodeNumber, $scope);
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
    $scope.popup.remove();
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

.controller('TVShowEpisodeDetailCtrl',  function($scope, $stateParams,$ionicLoading, TVShowEpisodeDetail){
  $scope.tvShowEpisodeDetail = TVShowEpisodeDetail.get($stateParams.showId, $stateParams.seasonNumber, $stateParams.episodeNumber, $scope);
  console.log($stateParams.showId + " season ="+$stateParams.seasonNumber + " epi =" + $stateParams.episodeNumber);
  $scope.selected = {};
  $scope.selected.showId = $stateParams.showId;
  $scope.selected.seasonNumber = $stateParams.seasonNumber;
  $scope.selected.episodeNumber = $stateParams.episodeNumber;
  console.log('Loading TVShowEpisodeDetailCtrl');
  /*
    // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
    var query = "SELECT id, is_watched, is_favourite, is_alerted, alertondate FROM watchedepisodes WHERE showid = ? and seasonnumber = ? and episodenumber = ?";
        $cordovaSQLite.execute(db, query, [$scope.selected.showId, $scope.selected.seasonNumber, $scope.selected.episodeNumber]).then(function(res) {
            var selectedRecord = {};
            if(res.rows.length > 0) {
                
                console.log($scope.tvShowEpisodeDetail);
                selectedRecord.isWatched = res.rows.item(0).is_watched;
                selectedRecord.isFavourite =  res.rows.item(0).is_favourite;
                selectedRecord.isAlerted =  res.rows.item(0).is_alerted;
                selectedRecord.alertEnabled = res.rows.item(0).alert_enabled;
                selectedRecord.alertDate = new Date(res.rows.item(0).alertondate);
                console.log($scope.tvShowEpisodeDetail);
                selectedRecord.id = res.rows.item(0).id;
                TVShowEpisodeDetail.setMetaData(selectedRecord);
                if(isObjectEmpty($scope.tvShowEpisodeDetail)){
                  $ionicLoading.show({
                    template: 'Loading...'
                  });
                  TVShowEpisodeDetail.init($stateParams.showId,$stateParams.seasonNumber,$stateParams.episodeNumber, $scope);
                }
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
  */
  console.log ($scope.tvShowEpisodeDetail);
  if(isObjectEmpty($scope.tvShowEpisodeDetail)){
    $ionicLoading.show({
      template: 'Loading...'
    });
    TVShowEpisodeDetail.init($stateParams.showId,$stateParams.seasonNumber,$stateParams.episodeNumber, $scope);
  }
  $scope.setWatched = function(statusFlag) {
    console.log('setWatchedStatus statusFlag='+statusFlag);
    $scope.tvShowEpisodeDetail.isWatched = statusFlag;
    console.log($scope.selected);
    $scope.updateFlag('is_watched', statusFlag);
  };
  $scope.favouriteShow = function(statusFlag) {
    console.log('favouriteShow statusFlag='+statusFlag);
    $scope.tvShowEpisodeDetail.isFavourite = statusFlag;
    console.log($scope.selected);
    $scope.updateFlag('is_favourite', statusFlag);
  };
  $scope.alertShow = function(statusFlag) {
    console.log('alertShow statusFlag='+statusFlag);
    $scope.tvShowEpisodeDetail.alertEnabled = statusFlag;
    console.log($scope.selected);
    $scope.updateFlag('alert_enabled', statusFlag);
    if(statusFlag) {
      // add a scheduled notification by inserting to DB INSERT
    } else {
      // remove the scheduled notification by fetching the id from DB UPDATE
    }
  };
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
  $scope.updateFlag = function(flagName, flagValue) {
    var flagValueString = flagValue ? 'Y' : 'N';
    console.log('updating flag =' + flagName + ' with ' + flagValueString);
    /*
    // UPSERT into database
     var query = "INSERT OR REPLACE INTO watchedepisodes (showid, seasonnumber, episodenumber, "
                  flagname
                  +",lastmodifiedts) VALUES (?,?,?,?,?)";
        $cordovaSQLite.execute(db, query, [$scope.selected.showId, $scope.selected.seasonNumber, $scope.selected.episodeNumber, flagValueString, (new Date()).getTime()]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
        }, function (err) {
            console.error(err);
        });
    */
  };
});