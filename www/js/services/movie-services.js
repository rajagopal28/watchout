angular.module('watchout.movie-services', [])

.factory('MovieGenres', function(){
    var movieGenres = [
   {
      "id":28,
      "name":"Action"
   },
   {
      "id":12,
      "name":"Adventure"
   },
   {
      "id":16,
      "name":"Animation"
   },
   {
      "id":35,
      "name":"Comedy"
   },
   {
      "id":80,
      "name":"Crime"
   },
   {
      "id":99,
      "name":"Documentary"
   },
   {
      "id":18,
      "name":"Drama"
   },
   {
      "id":10751,
      "name":"Family"
   },
   {
      "id":14,
      "name":"Fantasy"
   },
   {
      "id":10769,
      "name":"Foreign"
   },
   {
      "id":36,
      "name":"History"
   },
   {
      "id":27,
      "name":"Horror"
   },
   {
      "id":10402,
      "name":"Music"
   },
   {
      "id":9648,
      "name":"Mystery"
   },
   {
      "id":10749,
      "name":"Romance"
   },
   {
      "id":878,
      "name":"Science Fiction"
   },
   {
      "id":10770,
      "name":"TV Movie"
   },
   {
      "id":53,
      "name":"Thriller"
   },
   {
      "id":10752,
      "name":"War"
   },
   {
      "id":37,
      "name":"Western"
   }];
   var selectedMovieGenres = [];
 return {
  all: function() {
      for (var i = 0; i < movieGenres.length; i++) {
        for (var j=0; j< selectedMovieGenres; j++) {
          if(movieGenres[i].id == selectedMovieGenres[j].id) {
            movieGenres[i].checked = true;
            console.log(movieGenres[i]);
          }
      }
    }
    return movieGenres;
  },
  get: function(movieGenreId) {
      for (var i = 0; i < movieGenres.length; i++) {
        if(movieGenres[i].id == movieGenreId) {
          return movieGenres[i];
        }
      }

      return null;
  },
  remove: function(movieGenre) {
    movieGenres.splice(movieGenres.indexOf(movieGenre), 1);
  },
  saveFavoriteGenres: function(selectedGenres) {
    selectedMovieGenres = selectedGenres;
  },
  getFavouriteGenres: function(){
    return selectedMovieGenres;
  }
 };
})

.factory('Movies', ['MovieGenres', function(MovieGenres){
  var movies = [];
  var currentPage = 0;
  var myGenres = MovieGenres.getFavouriteGenres();
  var myGenreString = '';
  if(myGenres && myGenres.length > 0) {
    myGenreString = myGenres.join('|');
  } else {
    myGenreString ='10765|9648|18|35';
  }
  var discoverWithAttributes = {
    'with_genres' : myGenreString,
    'include_adult' : true,
    'sort_by' : 'popularity.asc',
    'page' : currentPage
  };
return {
    init : function(scope) {
      // initialize if the movies list is not fetched
      if(movies.length == 0) {
        // make movie db call
        currentPage = 1;
      }
      this.loadMovies(scope, currentPage);
        
    },
    loadMovies : function(scope, pagetoLoad) {
      discoverWithAttributes.page = pagetoLoad;
      theMovieDb.discover.getMovies(discoverWithAttributes,
        function(data) {
          // console.log(typeof data)
          var parsedData = JSON.parse(data);
          // console.log(parsedData.results);
          movies = movies.concat(parsedData.results);
          console.log(movies);
          scope.movies = movies;
          scope.$broadcast('scroll.infiniteScrollComplete');
        },
        function(data) {
          console.log("Error CB");
          console.log(data);
        });
    },
    loadMore : function(scope) {
      if(movies.length == 0) {
        currentPage = 1;
        movies = [];
      } else {
        currentPage += 1;
      }
      this.loadMovies(scope, currentPage);
    },
    all: function() {
      return movies;
    },
    remove: function(movie) {
      movies.splice(movies.indexOf(movie), 1);
    },
    get: function(movieId) {
      for (var i = 0; i < movies.length; i++) {
        if (movies[i].id === parseInt(movieId)) {
          return movies[i];
        }
      }
      return null;
    }
  };

}]);
