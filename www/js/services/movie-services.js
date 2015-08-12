angular.module('watchout.movie-services', [])

.factory('MovieGenres', function(){
    var movieGenres = [];
   var selectedMovieGenres = [];
 return {
  init : function(scope) {
    movieGenres = [];
    theMovieDb.genres.getList({}, 
      function(data) {
        var parsedData = JSON.parse(data);
        movieGenres = parsedData.genres;
        if(scope) {          
          scope.movieGenres = movieGenres;
          scope.hideSpinner();
        }
      }, 
      function(error){
        console.log('Error CB');
        console.log(error);
      });
  },
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

.factory('Movies', ['MovieGenres', 'Configurations', function(MovieGenres, Configurations){
  var movies = [];
  var currentPage = 0;
  var myGenres = MovieGenres.getFavouriteGenres();
  var myGenreString = '';
  var isLoading = false;
  if(myGenres && myGenres.length > 0) {
    myGenreString = myGenres.join('|');
  } else {
    myGenreString ='10765|9648|18|35';
  }
  console.log(Configurations.getConfigurations());
  var discoverWithAttributes = {
    'with_genres' : myGenreString,
    'include_adult' : true,
    'sort_by' : 'popularity.desc',
    'page' : currentPage
  };
return {
    init : function(scope) {
      // initialize if the movies list
      if(movies.length == 0) {
         currentPage = 0;
        var genres = MovieGenres.all();
        if(genres.length == 0) {
          MovieGenres.init();// init without scope to use genres later
        }
      }
       
      // this.loadMovies(scope, currentPage);
        
    },
    loadMovies : function(scope, pagetoLoad) {
      discoverWithAttributes.page = pagetoLoad + 1;
      var config = Configurations.getConfigurations();
      if(!isLoading) {
        isLoading = true;
        theMovieDb.discover.getMovies(discoverWithAttributes,
        function(data) {
          // console.log(typeof data)
          var parsedData = JSON.parse(data);
          // console.log(parsedData.results);
          var newMoviesPage = parsedData.results;
          for( var index in newMoviesPage) {
            var newMovie = newMoviesPage[index];
            // change the poster path
            var relativeImageURL = newMovie.poster_path;
            // console.log(newMovie);
            if(relativeImageURL) {
                if(!relativeImageURL.startsWith(config.images.base_url)) {
                  relativeImageURL = config.images.base_url 
                                      + config.images.poster_sizes[0]
                                      + relativeImageURL;
                  newMovie.poster_path = relativeImageURL;
                  // console.log(relativeImageURL);
                }
            } else {
              newMovie.poster_path = 'http://www.classicposters.com/images/nopicture.gif';
            }
            // change the backdrop path
            relativeImageURL = newMovie.backdrop_path;
            if(relativeImageURL) {
              // console.log(relativeImageURL);
              if(!relativeImageURL.startsWith(config.images.base_url)) {
                  relativeImageURL = config.images.base_url  
                                      + config.images.backdrop_sizes[0]
                                      + relativeImageURL;
                  newMovie.backdrop_path = relativeImageURL;
                  // console.log(relativeImageURL);
                }
            } else {
              newMovie.backdrop_path = 'http://www.classicposters.com/images/nopicture.gif';
            }
            // add genre names
            var genres = MovieGenres.all();
            var movieGenreIds  = newMovie.genre_ids;
            var movieGenreLabels = '';
            for(var index in genres) {
              if(movieGenreIds.indexOf(genres[index].id) != -1) {
                if(movieGenreLabels.length > 0) {
                  movieGenreLabels += ',';
                }
                movieGenreLabels += genres[index].name;
              }
            }
            // set it to list item 
            newMovie.movie_genre_labels = movieGenreLabels;
            // console.log(movieGenreLabels);
          }
          movies = movies.concat(newMoviesPage);
          // console.log(movies);
          scope.movies = movies;
          scope.hideSpinner();
          isLoading = false;
          currentPage = pagetoLoad + 1;
          scope.$broadcast('scroll.infiniteScrollComplete');
        },
        function(error) {
          console.log("Error CB");
          console.log(error);
          isLoading = false;
        });
      }
    },
    loadMore : function(scope) {
      this.init();
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
