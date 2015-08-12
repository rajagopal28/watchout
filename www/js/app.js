// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('watchout', ['ionic','watchout.movie-services','watchout.tvshow-services','watchout.main-controllers','watchout.movie-controllers','watchout.tvshow-controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract : true,
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
      views : {
        'mainContent' : {
          controller: 'HomeCtrl',
          templateUrl: 'templates/movies.html'
        }
      }      
    })
    .state('app.tvshows', {
      url: '/tvshows',
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
    .state('app.tvshow-selected', {
      url: '/tvshows/:showId',
      views: {
      'mainContent': {        
        controller: 'TVShowDetailCtrl',
        templateUrl: 'templates/tabs/tab-tvshows-selected.html'
      }
     }
    });  
  $urlRouterProvider.otherwise('/app/home');
});
