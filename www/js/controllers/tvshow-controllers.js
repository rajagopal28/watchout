angular.module('watchout.tvshow-controllers', [])

.controller('TVShowDetailCtrl',  function($scope,$stateParams,$cordovaSQLite,$ionicLoading, TVShows, TVShowSearch, TVShowDetail){
  // console.log("state show Id =" + $stateParams.showId);
  if(!$stateParams.showId) {
    // console.log('scope show id =' + $scope.showId);
    $stateParams.showId = $scope.showId;
  }
  $scope.tvShow = TVShows.get($stateParams.showId);
  if(!$scope.tvShow || isObjectEmpty($scope.tvShow)) {
    $scope.tvShow = TVShowSearch.get($stateParams.showId);
  }
  if(!$scope.tvShow || isObjectEmpty($scope.tvShow)) {
    TVShowDetail.init();
    
    // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
    var query = "SELECT is_favourite FROM favouritetvshows WHERE showid = ?";
    $cordovaSQLite.execute(db, query, [$scope.selected.showId]).then(function(res) {
        var allRecords = {};
        if(res.rows.length > 0) {
          TVShowDetail.setMetaData({is_favourite : res.rows.item(0).is_favourite});         
        } else {
            // console.log("No results found");
        }

        $ionicLoading.show({
          template: 'Loading...'
        });
        TVShowDetail.loadTvShowDetail($scope, $stateParams.showId); 
    }, function (err) {
        // console.error(err);
    });
    
  }// end if empty check - server call
  $scope.setFavourite = function() {
    var poster_path = $scope.tvShow.poster_path;
    if(!poster_path || poster_path.indexOf("nopicture") != -1){
      poster_path = '';
    } else {
      poster_path = poster_path.substring(poster_path.lastIndexOf("/"));
    }
  
    var query = "INSERT OR IGNORE INTO favouritetvshows (showid, showname, is_favourite,"
                +" show_genre_labels,poster_path, first_air_date, lastmodifiedts, createdts) VALUES (?,?,?,?,?,?,?,?)";
    $cordovaSQLite.execute(db, query, [$scope.tvShow.id, $scope.tvShow.original_name, 'Y', 
                              $scope.tvShow.show_genre_labels, poster_path, $scope.tvShow.first_air_date, (new Date()).getTime(),(new Date()).getTime()]).then(function(res) {
        // console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
        // console.error(err);
        // console.log('ERROR:'+ err.message);
    });
    
    $scope.updateFlag('is_favourite', 'Y');
    $scope.tvShow.isFavourite = true;
  };
  $scope.removeFavourite = function() {
    $scope.updateFlag('is_favourite', 'N');
    $scope.tvShow.isFavourite = false;
  };
  $scope.updateFlag = function(flagName, flagValueString) {
    
    query = "UPDATE favouritetvshows SET "
                      + flagName + " = ? , lastmodifiedts = ?"
                      + " WHERE showid = ? ";
    $cordovaSQLite.execute(db, query, [flagValueString , (new Date()).getTime(), $scope.tvShow.id]).then(function(res) {
        // console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
        // console.error(err);
        // console.log('ERROR:'+ err.message);
    });
    
  };
  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
})

.controller('TVShowHomeCtrl',  function($scope,$stateParams,$cordovaSQLite){
  $scope.showId = $stateParams.showId;  
  // console.log($stateParams);
  // console.log('moving state params' + $scope.showId);
})

.controller('TVShowSeasonsCtrl',  function($scope, $stateParams,$cordovaSQLite,$ionicLoading,$ionicPopover, TVShowSeasons){
  $scope.tvShowSeasons = TVShowSeasons.get($stateParams.showId);
  // console.log($stateParams.showId);
  $scope.selected = {};
  $scope.selected.showId = $stateParams.showId;
  
  // Fetch the watched episodes count for this show ==> all seasons
  // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
  var query = "SELECT seasonnumber, count(episodenumber) as watchedcount FROM watchedepisodes WHERE showid = ? and is_watched in ('Y', 'I')  group by seasonnumber";
  $cordovaSQLite.execute(db, query, [$scope.selected.showId]).then(function(res) {
      var allRecords = {};
      if(res.rows.length > 0) {
        // console.log($scope.tvShowSeasons);
        for(var index = 0 ; index < res.rows.length; index ++) {
          var selectedRecord = {};
          selectedRecord.watchedcount = res.rows.item(index).watchedcount;
          selectedRecord.seasonnumber =  res.rows.item(index).seasonnumber;
          allRecords[selectedRecord.seasonnumber] = selectedRecord;
          // console.log(JSON.stringify(allRecords));
        }

        TVShowSeasons.setMetaData(allRecords);
                       
      } else {
          // console.log("No results found");
      }
      if(isObjectEmpty($scope.tvShowSeasons)){
        $ionicLoading.show({
          template: 'Loading...'
        });
        TVShowSeasons.init($stateParams.showId, $scope);
      } 
  }, function (err) {
      // console.error(err);
  });
  
  $ionicPopover.fromTemplateUrl('templates/season-options-menu.html', {
    scope: $scope,
  }).then(function(popover) {
      $scope.popup = popover;
  });
  $scope.showMenu = function($event, showSeasonNumber,seasonIndex) {
    $scope.popup.show($event);
    $scope.selected.seasonNumber = showSeasonNumber;
    $scope.selected.selectedSeasonIndex = seasonIndex;
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    // console.log('showing popup for season :' + showSeasonNumber);
  };
  $scope.closePopover = function() {
    $scope.popup.hide();
  };
  $scope.setAllWatched = function() {
    // console.log('setAllWatched');
   // console.log(JSON.stringify($scope.selected));
    $scope.setFlagValue('is_watched', 'Y');    
    $scope.closePopover();
  };
  $scope.setAllUnWatched = function() {
    // console.log('setAllUnWatched');
    // console.log(JSON.stringify($scope.selected));   
    $scope.setFlagValue('is_watched', 'N');
    $scope.closePopover();
  };
  $scope.setAllIgnored = function() {
    // console.log('setAllIgnored');
    // console.log(JSON.stringify($scope.selected));    
    $scope.setFlagValue('is_watched', 'I');
    $scope.closePopover();
  };
  $scope.setFlagValue = function(flagName, flagValueString) {

    console.log('updating flag =' + flagName + ' with ' + flagValueString);
    
    // UPSERT into database
     var query = "INSERT OR IGNORE INTO watchedepisodes (showid, seasonnumber, episodenumber, "  
                  + flagName
                  +",lastmodifiedts,createdts) VALUES (?,?,?,?,?,?)";
      var episodeNumberArray = [];
      var questionMarkString = "";
      if($scope.tvShowSeasons && $scope.tvShowSeasons.seasons 
          && $scope.tvShowSeasons.seasons[$scope.selected.selectedSeasonIndex]) {
        var selectedSeason = $scope.tvShowSeasons.seasons[$scope.selected.selectedSeasonIndex];
        // console.log("in transaction episode_count-"+selectedSeason.episode_count);
         for(var episode_number = 1; 
              episode_number <= parseInt(selectedSeason.episode_count); 
                episode_number++) {
            if(questionMarkString != "") {
              questionMarkString += ",";
            }
            questionMarkString += "?";
            episodeNumberArray.push(episode_number);
            $cordovaSQLite.execute(db, query, [$scope.selected.showId, $scope.selected.seasonNumber, episode_number, flagValueString, (new Date()).getTime(),(new Date()).getTime()]).then(function(res) {
                // console.log("INSERT ID -> " + res.insertId);
            }, function (err) {
                // console.error(err);
                // console.log('ERROR:'+ err.message);
            });
         }// end for
         // console.log("End for");
         query = "UPDATE watchedepisodes SET "
                      + flagName + " = ? , lastmodifiedts = ?"
                      + " WHERE showid = ? and seasonnumber = ? and episodenumber in ("
                      + questionMarkString
                      + ")";
            var allParams = [flagValueString, (new Date()).getTime(), $scope.selected.showId, $scope.selected.seasonNumber];
            allParams = allParams.concat(episodeNumberArray);
            $cordovaSQLite.execute(db, query, allParams)
                      .then(function(res) {
                          // console.log("INSERT ID -> " + res.insertId);
                      }, function (err) {
                          // console.error(err);
                          // console.log('ERROR:'+ err.message);
                      });
        if('N'== flagValueString) {
          selectedSeason.watched_episodes_count = 0;
        } else {
          selectedSeason.watched_episodes_count = selectedSeason.episode_count;
        }
      }       
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

.controller('TVShowEpisodesCtrl',  function($scope,$state, $stateParams,$cordovaSQLite,$ionicLoading,$ionicPopover, TVShowEpisodes, TVShowEpisodeDetail){
  $scope.tvShowEpisodes = TVShowEpisodes.get($stateParams.showId, $stateParams.seasonNumber, $stateParams.episodeNumber);
  // console.log($stateParams.showId + " season : " + $stateParams.seasonNumber);
  $scope.selected = {};
  $scope.selected.showId = $stateParams.showId;
  $scope.selected.seasonNumber = $stateParams.seasonNumber;
  $scope.selected.episodeNumber = $stateParams.episodeNumber;
  $scope.currentIndex = 0;
  $scope.totalResults = 0;

  $scope.next = function() {
    // console.log($scope.tvShowEpisodes.episodes);
    var indexValue = parseInt($scope.currentIndex) + 1;
    // console.log('Next : ' + $scope.currentIndex + " length =" + $scope.tvShowEpisodes.episodes.length);
    if($scope.tvShowEpisodes && $scope.tvShowEpisodes.episodes && $scope.tvShowEpisodes.episodes.length > indexValue) {
      $scope.currentIndex = indexValue;
      // console.log('Next : ' + $scope.currentIndex );
      // console.log($scope.tvShowEpisodes.episodes[$scope.currentIndex]);
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
  
  // Fetch the watched episodes status for this show and season
  // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
  var query = "SELECT episodenumber, is_watched,is_favourite,is_alerted,alert_enabled FROM watchedepisodes WHERE showid = ? and seasonnumber = ?";
  $cordovaSQLite.execute(db, query, [$scope.selected.showId, $scope.selected.seasonNumber]).then(function(res) {
      var allRecords = {};
      if(res.rows.length > 0) {
          // console.log($scope.tvShowSeasons);
          for(var index = 0 ; index < res.rows.length; index ++) {
            var selectedRecord = {};
            selectedRecord.isWatched = res.rows.item(index).is_watched;
            selectedRecord.episodenumber =  res.rows.item(index).episodenumber;
            selectedRecord.isFavourite = res.rows.item(index).is_favourite;
            selectedRecord.isAlerted = res.rows.item(index).is_alerted;
            selectedRecord.alertEnabled = res.rows.item(index).alert_enabled;
            allRecords[selectedRecord.episodenumber] = selectedRecord;
          }
          TVShowEpisodes.setMetaData(allRecords);              
      } else {
          // console.log("No results found");
      }
      // console.log($stateParams);
      if(isObjectEmpty($scope.tvShowEpisodes)){
        $ionicLoading.show({
          template: 'Loading...'
        });
        TVShowEpisodes.init($stateParams.showId,$stateParams.seasonNumber,$stateParams.episodeNumber, $scope);
      }  
  }, function (err) {
      // console.error(err);
  });
   
  $ionicPopover.fromTemplateUrl('templates/episode-options-menu.html', {
    scope: $scope,
  }).then(function(popover) {
      $scope.popup = popover;
  });
  $scope.showMenu = function($event, showEpisodeNumber,episodeIndex) {
    $scope.popup.show($event);
    $scope.selected.episodeNumber = showEpisodeNumber;
    $scope.selected.selectedEpisodeIndex = episodeIndex;
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    // console.log('showing popup for season :' + showEpisodeNumber);
  };
  $scope.setAllWatched = function() {
    // console.log('setAllWatched');
   // console.log(JSON.stringify($scope.selected));
    $scope.setFlagValue('is_watched', 'Y',false);    
    $scope.closePopover();
  };
  $scope.setAllUnWatched = function() {
    // console.log('setAllUnWatched');
    // console.log(JSON.stringify($scope.selected));   
    $scope.setFlagValue('is_watched', 'N', false);
    $scope.closePopover();
  };
  $scope.setAllIgnored = function() {
    // console.log('setAllIgnored');
    // console.log(JSON.stringify($scope.selected));    
    $scope.setFlagValue('is_watched', 'I', false);
    $scope.closePopover();
  };
  $scope.changeWatchedStatus = function(showEpisodeNumber, episodeIndex, currentStatusFlag, $event) {
    $scope.selected.episodeNumber = showEpisodeNumber;
    $scope.selected.selectedEpisodeIndex = episodeIndex;
    var newStatusFlagString = currentStatusFlag ? 'N' : 'Y';
    $scope.setFlagValue('is_watched', newStatusFlagString, true);
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  };
  $scope.closePopover = function() {
    $scope.popup.hide();
  };
  $scope.setWatched = function() {
    // console.log('setAllWatched');
    // console.log(JSON.stringify($scope.selected));
    $scope.setFlagValue('is_watched', 'Y', true);
    $scope.closePopover();
  };
  $scope.setUnWatched = function() {
    // console.log('setAllUnWatched');
    $scope.setFlagValue('is_watched', 'N', true);
    // console.log(JSON.stringify($scope.selected));
    $scope.closePopover();
  };
  $scope.setIgnored = function() {
    // console.log('setAllIgnored');
    // console.log(JSON.stringify($scope.selected));
    $scope.setFlagValue('is_watched', 'I', true);
    $scope.closePopover();
  };
  $scope.setFlagValue = function(flagName, flagValueString, episodeSelected) {
    console.log('updating flag =' + flagName + ' with ' + flagValueString);
    
    // UPSERT into database
     var query = "INSERT OR IGNORE INTO watchedepisodes (showid, seasonnumber, episodenumber, "  
                  + flagName
                  +",lastmodifiedts,createdts) VALUES (?,?,?,?,?,?)";
      var episodeNumberArray = [];
      var questionMarkString = "";
      if($scope.tvShowEpisodes && $scope.tvShowEpisodes.episodes) {
        if(!episodeSelected) {
          for(var index = 0; 
              index < $scope.tvShowEpisodes.episodes.length; 
                index++) {
            var episode_number = $scope.tvShowEpisodes.episodes[index].episode_number;
            // set the flag for UI
            $scope.tvShowEpisodes.episodes[index].isWatched = flagValueString != 'N';
            if(questionMarkString != "") {
              questionMarkString += ",";
            }
            questionMarkString += "?";
            episodeNumberArray.push(episode_number);
            $cordovaSQLite.execute(db, query, [$scope.selected.showId, $scope.selected.seasonNumber, episode_number, flagValueString, (new Date()).getTime(),(new Date()).getTime()]).then(function(res) {
                // console.log("INSERT ID -> " + res.insertId);
            }, function (err) {
                // console.error(err);
                // console.log('ERROR:'+ err.message);
            });
         }// end for
        } else {
            questionMarkString += "?";
            var index = parseInt($scope.selected.selectedEpisodeIndex);
            $scope.tvShowEpisodes.episodes[index].isWatched = flagValueString != 'N';
            episodeNumberArray.push($scope.selected.episodeNumber);
            $cordovaSQLite.execute(db, query, [$scope.selected.showId, $scope.selected.seasonNumber, $scope.selected.episodeNumber, flagValueString, (new Date()).getTime(),(new Date()).getTime()]).then(function(res) {
                // console.log("INSERT ID -> " + res.insertId);
            }, function (err) {
                // console.error(err);
                // console.log('ERROR:'+ err.message);
            });
        }
       query = "UPDATE watchedepisodes SET "
                    + flagName + " = ? , lastmodifiedts = ?"
                    + " WHERE showid = ? and seasonnumber = ? and episodenumber in ("
                    + questionMarkString
                    + ")";
        var allParams = [flagValueString, (new Date()).getTime(), $scope.selected.showId, $scope.selected.seasonNumber];
        allParams = allParams.concat(episodeNumberArray);
        $cordovaSQLite.execute(db, query, allParams)
                  .then(function(res) {
                      // console.log("INSERT ID -> " + res.insertId);
                  }, function (err) {
                      // console.error(err);
                      // console.log('ERROR:'+ err.message);
                  });
      }
          
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

.controller('TVShowEpisodeDetailCtrl',  function($scope, $window,$stateParams,$cordovaSQLite,$ionicPopup,$timeout,$ionicLoading, TVShowEpisodeDetail){
  $scope.tvShowEpisodeDetail = TVShowEpisodeDetail.get($stateParams.showId, $stateParams.seasonNumber, $stateParams.episodeNumber, $scope);
  // console.log($stateParams.showId + " season ="+$stateParams.seasonNumber + " epi =" + $stateParams.episodeNumber);
  $scope.selected = {};
  $scope.selected.showId = $stateParams.showId;
  $scope.selected.seasonNumber = $stateParams.seasonNumber;
  $scope.selected.episodeNumber = $stateParams.episodeNumber;
  // console.log('Loading TVShowEpisodeDetailCtrl');
  
  // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
  var query = "SELECT id, is_watched, is_favourite, is_alerted, alertondate FROM watchedepisodes WHERE showid = ? and seasonnumber = ? and episodenumber = ?";
  $cordovaSQLite.execute(db, query, [$scope.selected.showId, $scope.selected.seasonNumber, $scope.selected.episodeNumber]).then(function(res) {
      var selectedRecord = {};
      if(res.rows.length > 0) {
          
          // console.log($scope.tvShowEpisodeDetail);
          selectedRecord.isWatched = res.rows.item(0).is_watched;
          selectedRecord.isFavourite =  res.rows.item(0).is_favourite;
          selectedRecord.isAlerted =  res.rows.item(0).is_alerted;
          selectedRecord.alertEnabled = res.rows.item(0).alert_enabled;
          selectedRecord.alertDate = new Date(res.rows.item(0).alertondate).toDateString();
          // console.log($scope.tvShowEpisodeDetail);
          selectedRecord.id = res.rows.item(0).id;
          TVShowEpisodeDetail.setMetaData(selectedRecord);
          
      } else {
          // console.log("No results found");
      }
      if(isObjectEmpty($scope.tvShowEpisodeDetail)){
        $ionicLoading.show({
          template: 'Loading...'
        });
        TVShowEpisodeDetail.init($stateParams.showId,$stateParams.seasonNumber,$stateParams.episodeNumber, $scope);
      }
  }, function (err) {
      // console.error(err);
  });
  
  $scope.setWatched = function(statusFlag) {
    // console.log('setWatchedStatus statusFlag='+statusFlag);
    $scope.tvShowEpisodeDetail.isWatched = statusFlag;
    // console.log($scope.selected);
    $scope.updateFlag('is_watched', statusFlag);
  };
  $scope.favouriteShow = function(statusFlag) {
    // console.log('favouriteShow statusFlag='+statusFlag);
    $scope.tvShowEpisodeDetail.isFavourite = statusFlag;
    // console.log($scope.selected);
    $scope.updateFlag('is_favourite', statusFlag);
  };
  // Triggered on a button click, or some other target
$scope.showPopup = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl: 'templates/alert-schedule-popup.html',
    title: 'When to Alert?',
    subTitle: 'Please Choose one',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Ok</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.selected.alertInterval) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.selected.alertInterval;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
    $scope.alertShow(true);
  });
  $timeout(function() {
     myPopup.close(); //close the popup after 3 seconds for some reason
  }, 3000);
 };
  $scope.alertShow = function(statusFlag) {
    // console.log('alertShow statusFlag='+statusFlag);
    var alertInterval = $scope.selected.alertInterval;
    $scope.tvShowEpisodeDetail.alertEnabled = statusFlag;
    // console.log($scope.selected);
    $scope.updateFlag('alert_enabled', statusFlag);
    
    if(statusFlag) {
      // add a scheduled notification by inserting to DB INSERT
      // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
      var query = "SELECT MAX(notificationid) as lastnotificationid FROM watchedepisodes";
          $cordovaSQLite.execute(db, query, []).then(function(res) {
              var lastnotificationid = 0;
              if(res.rows.length > 0) {                
                  // console.log(res.rows.item(0).lastnotificationid);
                  if(res.rows.item(0).lastnotificationid) {
                    lastnotificationid = parseInt(res.rows.item(0).lastnotificationid);
                  }                  
              } else {
                  // console.log("No results found");
              }
              // console.log("lastnotificationid = " + lastnotificationid);
              $scope.addNotification(lastnotificationid + 1);
          }, function (err) {
              // console.error(err);
          });
    } else {
      // remove the scheduled notification by fetching the id from DB UPDATE
      // Database code to fetch the isWatched, isFavourite and isAlertEnabled flags
      var query = "SELECT notificationid FROM watchedepisodes where showid = ? and seasonnumber = ? and episodenumber = ?";
          $cordovaSQLite.execute(db, query, [$scope.selected.showId, $scope.selected.seasonNumber, $scope.selected.episodeNumber]).then(function(res) {
              var notificationid = 1;
              if(res.rows.length > 0) {                
                  // console.log($scope.tvShowEpisodeDetail);
                  notificationid = parseInt(res.rows.item(0).notificationid);
                  cancelNotification({'id' : notificationid},window,$scope)
              } else {
                  // console.log("No results found");
              }
          }, function (err) {
              // console.error(err);
          });
    }
    
  };

  $scope.addNotification = function(notificationId) {
    var alertTime = new Date($scope.tvShowEpisodeDetail.air_date).getTime();
    var notificationMessage = "The episode *"
                              + $scope.tvShowEpisodeDetail.name
                              + "* from this season *"
                              + $scope.tvShowEpisodeDetail.name
                              + "* of this series *"
                              + "* is about to be aired today";
    var title = "Watchout a new episode";
    var notificationData = {};
    if(alertInterval) {
      alertTime -= alertInterval;
    }
    notificationData['alertondate'] = alertTime;
    notificationData['id'] = notificationId;
    notificationData['title'] = title;
    notificationData['message'] = notificationMessage;
    addNotification(notificationData, window);
      // UPSERT into database
     var query = "INSERT OR IGNORE INTO watchedepisodes (showid, seasonnumber, episodenumber, "
                  + "alert_enabled, alertondate, is_alerted, notificationid"
                  +",lastmodifiedts, createdts) VALUES (?,?,?,?,?,?,?,?,?)";
      $cordovaSQLite.execute(db, query, [$scope.selected.showId, $scope.selected.seasonNumber, $scope.selected.episodeNumber,
                                           'Y',alertTime,'N', notificationId, (new Date()).getTime(), (new Date()).getTime()]).then(function(res) {
         // console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
          // console.error(err);
      });
      // If already present update
      query = "UPDATE watchedepisodes SET "
                  + "alert_enabled = ?, alertondate = ? , is_alerted =? ,"
                  + " notificationid = ? , lastmodifiedts = ? "
                  + " where showid = ? and seasonnumber = ? and  episodenumber = ? " ;
      $cordovaSQLite.execute(db, query, ['Y',alertTime,'N', notificationId, (new Date()).getTime(),
                                $scope.selected.showId, $scope.selected.seasonNumber, $scope.selected.episodeNumber])
      .then(function(res) {
          // console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
          // console.error(err);
      });
  }

  $scope.hideSpinner = function() {
    $ionicLoading.hide();
  };
  $scope.updateFlag = function(flagName, flagValue) {
    var flagValueString = flagValue ? 'Y' : 'N';
    // console.log(JSON.stringify($scope.selected));
    
    $scope.selected.episodeNumber = $scope.tvShowEpisodeDetail.episode_number;
    // console.log('updating flag =' + flagName + ' with ' + flagValueString);
    // UPSERT into database
     var query = "INSERT OR IGNORE INTO watchedepisodes (showid, seasonnumber, episodenumber, "  
                  + flagName
                  +",lastmodifiedts, createdts) VALUES (?,?,?,?,?,?)";
      $cordovaSQLite.execute(db, query, [$scope.selected.showId, $scope.selected.seasonNumber,
                               $scope.selected.episodeNumber, flagValueString, (new Date()).getTime(), (new Date()).getTime()])
      .then(function(res) {
          // console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
          // console.error(err);
      });
      // If already present update
      query = "UPDATE watchedepisodes SET "
                  + flagName
                  + " = ? , lastmodifiedts = ? "
                  + " where showid = ? and seasonnumber = ? and  episodenumber = ? " ;
      $cordovaSQLite.execute(db, query, [flagValueString, (new Date()).getTime(), $scope.selected.showId, $scope.selected.seasonNumber,
                               $scope.selected.episodeNumber])
      .then(function(res) {
          // console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
          // console.error(err);
      });
    
  };
});