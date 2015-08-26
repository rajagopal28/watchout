// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('watchout', ['ionic', 'ngCordova','watchout.common-services','watchout.movie-services','watchout.tvshow-services','watchout.main-controllers','watchout.movie-controllers','watchout.tvshow-controllers'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    if (window.cordova) {
      document.addEventListener("deviceready", function() {
        /*
        window.plugin.notification.local.onadd = onReminderAdd;
        window.plugin.notification.local.onclick = onSomeAction;
        window.plugin.notification.local.oncancel = onSomeAction;
        window.plugin.notification.local.ontrigger = onSomeAction;
        */
     }, false);
    }
    
    // SQLite Code
    db = $cordovaSQLite.openDB("watchout.db");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS favouritemoviegenres (id integer primary key, genreid text, genrename text, createdts long, lastmodifiedts long)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS favouritetvgenres (id integer primary key, genreid text, genrename text, createdts long, lastmodifiedts long)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS favouritemovies (id integer primary key, movieid text, moviename text, is_favourite text, is_alerted text, alert_enabled text,"
                              +" notificationid text, alertondate long, createdts long, lastmodifiedts long)");
    $cordovaSQLite.execute(db, " CREATE UNIQUE INDEX IF NOT EXISTS favouritemoviesindex ON favouritemovies(movieid)");                    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS favouritetvshows (id integer primary key, showid text, showname text, is_favourite text, createdts long, lastmodifiedts long)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS watchedepisodes (id integer primary key, showid text, seasonnumber text,episodenumber text, episodename text,"
                              +" is_watched text, is_favourite text, is_alerted text, alert_enabled text,"
                              +" notificationid text, alertondate long, createdts long, lastmodifiedts long)");
    $cordovaSQLite.execute(db, " CREATE UNIQUE INDEX IF NOT EXISTS watchedepisodesindex ON watchedepisodes(showid, seasonnumber, episodenumber)");
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract : true,
      cache :false,
      controller : 'MenuCtrl',
      templateUrl: 'templates/menu.html'
    })
    .state('app.home', {
      url: '/home',
      views : {
        'mainContent' : {
          controller: 'HomeCtrl',
          templateUrl: 'templates/home.html'
        }
      }      
    })
    .state('app.movies', {
      url: '/movies',
      cache:false,
      views : {
        'mainContent' : {
          controller: 'HomeCtrl',
          templateUrl: 'templates/movies.html'
        }
      }      
    })
    .state('app.tvshows', {
      url: '/tvshows',
      cache:false,
      views : {
        'mainContent' : {
          controller: 'HomeCtrl',
          templateUrl: 'templates/tvshows.html'
        }
      }      
    })
    .state('app.movies.genre', {
      url: '/genre',
      views : {
        'tab-movie-genre' : {
          controller: 'MovieGenresCtrl',
          templateUrl: 'templates/tabs/tab-movie-genre.html'
        }
      }      
    })
    .state('app.movies.upcoming', {
      url: '/upcoming',
      views : {
        'tab-upcoming-movies' : {
          controller: 'MovieCtrl',
          templateUrl: 'templates/tabs/tab-upcoming-movies.html'
        }
      }      
    })
    .state('app.movies.watched', {
      url: '/watched',
      views : {
        'tab-watched-movie' : {
          controller: 'MovieCtrl',
          templateUrl: 'templates/tabs/tab-upcoming-movies.html'
        }
      }      
    })
    .state('app.movies.search', {
      url: '/search',
      views : {
        'tab-search-movie' : {
          controller: 'MovieSearchCtrl',
          templateUrl: 'templates/tabs/tab-movie-search.html'
        }
      }      
    })
    .state('app.movie-selected', {
      url: '/movies/:movieId',
      views: {
      'mainContent': {        
        controller: 'MovieDetailCtrl',
        templateUrl: 'templates/tabs/tab-movie-selected.html'
      }
     }
    })
    .state('app.tvshows.genre', {
      url: '/genre',
      views : {
        'tab-tvshow-genre' : {
          controller: 'TVGenresCtrl',
          templateUrl: 'templates/tabs/tab-tvshows-genre.html'
        }
      }      
    })
    .state('app.tvshows.upcoming', {
      url: '/upcoming',
      views : {
        'tab-upcoming-tvshows' : {
          controller: 'TVShowCtrl',
          templateUrl: 'templates/tabs/tab-upcoming-tvshows.html'
        }
      }      
    })
    .state('app.tvshows.watched', {
      url: '/watched',
      views : {
        'tab-watched-tvshow' : {
          controller: 'TVShowCtrl',
          templateUrl: 'templates/tabs/tab-upcoming-tvshows.html'
        }
      }      
    })
    .state('app.tvshows.search', {
      url: '/search',
      views : {
        'tab-search-tvshow' : {
          controller: 'TVShowSearchCtrl',
          templateUrl: 'templates/tabs/tab-tvshows-search.html'
        }
      }      
    })
    .state('app.tvshow-selected', {
      url: '/tvshow_selected',
      cache:false,
      params : {'showId': '' , 'showName' : ''},
      views : {
        'mainContent' : {
          controller: 'TVShowHomeCtrl',
          templateUrl: 'templates/tvshow-selected.html'
        }
      }      
    })
    .state('app.tvshow-selected.tvshow-detail', {
      url: '/tvshow_detail/:showId',      
      views: {
      'tab-tvshow-overview': {        
        controller: 'TVShowDetailCtrl',
        templateUrl: 'templates/tabs/tab-tvshows-selected.html'
      }
     }
    })
    .state('app.tvshow-selected.tvshow-seasons', {
      url: '/tvshows_seasons/:showId',
      views: {
      'tab-season-overview': {        
        controller: 'TVShowSeasonsCtrl',
        templateUrl: 'templates/tabs/tab-tvshows-selected-seasons.html'
      }
     }
    })
    .state('app.tvshow-episodes', {
      url: '/tvshows_episodes/:showId/:seasonNumber',
      views: {
      'mainContent': {        
        controller: 'TVShowEpisodesCtrl',
        templateUrl: 'templates/tabs/tab-tvshows-selected-episodes.html'
      }
     }
    })
    .state('app.tvshow-all-episodes', {
      url: '/tvshows_all_episodes',
      cache : false,
      params : { 'seasonNumber' : '', 'showId' : '', 'episodeNumber' : ''},
      views: {
      'mainContent': {        
        controller: 'TVShowEpisodesCtrl',
        templateUrl: 'templates/tvshow-season-selected.html'
      }
     }
    })
    .state('app.tvshow-all-episodes.selected', {
      url: '/tvshows_episode_detail/:showId/:seasonNumber/:episodeNumber',
      views: {
      'tab-tvshow-episode-detail': {        
        controller: 'TVShowEpisodeDetailCtrl',
        templateUrl: 'templates/tabs/tab-tvshows-episode.html'
      }
     }
    })
    .state('app.tvshow-episode-detail', {
      url: '/tvshows_episode_detail_1/:showId/:seasonNumber/:episodeNumber',
      views: {
      'mainContent': {        
        controller: 'TVShowEpisodeDetailCtrl',
        templateUrl: 'templates/tabs/tab-tvshows-episode.html'
      }
     }
    });  
  $urlRouterProvider.otherwise('/app/home');
});

