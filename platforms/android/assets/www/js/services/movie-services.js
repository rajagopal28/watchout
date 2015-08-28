angular.module('watchout.movie-services', [])

.factory('MovieGenres', function(){
    var movieGenres = [];
    var isLoading = false;
   var selectedMovieGenres = [];
 return {
  init : function(scope) {
   if(movieGenres.length == 0) {
    if(!isLoading) {
      isLoading = true;
        theMovieDb.genres.getList({}, 
          function(data) {
            var parsedData = JSON.parse(data);
            movieGenres = parsedData.genres;
            isLoading = false;
            if(scope) {          
              scope.movieGenres = movieGenres;
              scope.hideSpinner();
            }
          }, 
          function(error){
            // console.log('Error CB');
            // console.log(error);
          });
    }
   }
  },
  all: function() {
      for (var i = 0; i < movieGenres.length; i++) {
        for (var j=0; j< selectedMovieGenres.length; j++) {
          if(movieGenres[i].id == selectedMovieGenres[j].id) {
            movieGenres[i].checked = true;
            // console.log(movieGenres[i]);
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
    for(var index = 0; index < myGenres.length; index++) {
      if(index != 0){
        myGenreString +="|";
      }
      myGenreString += myGenres[index].id;
    }
    // console.log("myGenreString = " +myGenreString);
  } else {
    myGenreString ='10765|9648|18|35';
  }
  // console.log(Configurations.getConfigurations());
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
    reset : function(){
      movies = [];
      this.init();
    },
    loadMoviesCallBack : function(scope, pagetoLoad) {
      return function() {
        var config = Configurations.getConfigurations();
        if(!isLoading) {
        isLoading = true;
        // console.log(isLoading);
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
                if(relativeImageURL.indexOf(config.images.base_url) != 0) {
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
              if(relativeImageURL.indexOf(config.images.base_url) != 0) {
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
          // console.log("Error CB");
          // console.log(error);
          isLoading = false;
        });
      }
      };
    },
    loadMovies : function(scope, pagetoLoad) {
      discoverWithAttributes.page = pagetoLoad + 1;
      // console.log('in loadMovies');
      var config = Configurations.getConfigurations();
      // console.log(config);
      if(!config) {
        Configurations.init(this.loadMoviesCallBack(scope, pagetoLoad));
      } else {
        // console.log('in else');
        this.loadMoviesCallBack(scope, pagetoLoad)();
        // call the function returned by the call back function
      }
      
    },
    loadMore : function(scope) {
      this.init();
      // console.log("in loadMore");
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

}])

.factory('MovieSearch', ['MovieGenres', 'Configurations', function(MovieGenres, Configurations){
  var movies = [];
  var currentPage = 0;
  var totalPages = 0;
  
  var isLoading = false;
  
  // console.log(Configurations.getConfigurations());
  var discoverWithAttributes = {
    'query' : '',
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
    loadMoviesCallBack : function(scope, pagetoLoad) {
      return function() {
        var config = Configurations.getConfigurations();
        if(!isLoading) {
        isLoading = true;
        // console.log(isLoading);
        theMovieDb.search.getMovie(discoverWithAttributes,
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
                if(relativeImageURL.indexOf(config.images.base_url) != 0) {
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
              if(relativeImageURL.indexOf(config.images.base_url) != 0) {
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
            newMovie.release_date = new Date(newMovie.release_date).toDateString();
            newMovie.isReleased = (new Date(newMovie.release_date)).getTime() - (new Date()).getTime() <= 0 ;
            // console.log(movieGenreLabels);
          }
          movies = movies.concat(newMoviesPage);
          // console.log(movies);
          scope.movies = movies;
          scope.hideSpinner();
          isLoading = false;
          currentPage = pagetoLoad + 1;
          totalPages = parsedData.total_pages;
          scope.$broadcast('scroll.infiniteScrollComplete');
        },
        function(error) {
          // console.log("Error CB");
          // console.log(error);
          isLoading = false;
        });
      }
      };
    },
    loadMovies : function(scope, pagetoLoad, queryString) {
      if(discoverWithAttributes.query != queryString) {
        discoverWithAttributes.query = queryString;
        // check whether the query is changes to rest the currentPage
        movies =[];
        pagetoLoad = 0;// to get page 1
      }
      discoverWithAttributes.page = pagetoLoad + 1;

      // console.log('in loadMovies');
      var config = Configurations.getConfigurations();
      // console.log(config);
      if(!config) {
        Configurations.init(this.loadMoviesCallBack(scope, pagetoLoad));
      } else {
        // console.log('in else');
        this.loadMoviesCallBack(scope, pagetoLoad)();
        // call the function returned by the call back function
      }
      
    },
    loadMore : function(scope, queryString) {
      this.init();
      // console.log("in loadMore");
      this.loadMovies(scope, currentPage, queryString);
    },
    isEndOfResults : function() {
      if(totalPages != 0 ) {
        return totalPages == currentPage;
      }
      return true;
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

}])

.factory('MovieDetail', ['MovieGenres', 'Configurations', function(MovieGenres, Configurations){
  var movieDetail ;
  var savedMovieMetaData;
  var isLoading = false;
return {
    init : function() {
        var genres = MovieGenres.all();
        if(genres.length == 0) {
          MovieGenres.init();// init without scope to use genres later
        }
        
    },
    setMetaData : function(metaData) {
      savedMovieMetaData = metaData;
    },
    loadMovieDetailCallBack : function(scope, movieId) {
      return function() {
        var config = Configurations.getConfigurations();
        if(!isLoading) {
        isLoading = true;
        // console.log(isLoading);
        theMovieDb.movies.getById({id: movieId },
        function(data) {
          // console.log(typeof data)
          var newMovie = JSON.parse(data);
          // change the poster path
          var relativeImageURL = newMovie.poster_path;
          // console.log(newMovie);
          if(relativeImageURL) {
              if(relativeImageURL.indexOf(config.images.base_url) != 0) {
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
            if(relativeImageURL.indexOf(config.images.base_url) != 0) {
                relativeImageURL = config.images.base_url  
                                    + config.images.backdrop_sizes[0]
                                    + relativeImageURL;
                newMovie.backdrop_path = relativeImageURL;
                // console.log(relativeImageURL);
              }
          } else {
            newMovie.backdrop_path = 'http://www.classicposters.com/images/nopicture.gif';
          }
          if(savedMovieMetaData && !isObjectEmpty(savedMovieMetaData)){
            newMovie.isFavourite = savedMovieMetaData.isFavourite == 'Y';
            newMovie.isAlerted = savedMovieMetaData.isAlerted == 'Y';
            newMovie.alertEnabled = savedMovieMetaData.alertEnabled == 'Y';
            newMovie.alertDate = savedMovieMetaData.alertDate;
          }
          // add genre names
          var genres = newMovie.genres;
          var movieGenreLabels = '';
          for(var index in genres) {              
              if(movieGenreLabels.length > 0) {
                movieGenreLabels += ',';
              }
              movieGenreLabels += genres[index].name;
          }
          // set it to list item 
          newMovie.movie_genre_labels = movieGenreLabels;
          // console.log(movieGenreLabels);
          newMovie.release_date = new Date(newMovie.release_date).toDateString();
          newMovie.isReleased = (new Date(newMovie.release_date)).getTime() - (new Date()).getTime() < 0 ;
          scope.movie = newMovie;
          scope.hideSpinner();
          isLoading = false;
        },
        function(error) {
          // console.log("Error CB");
          // console.log(error);
          isLoading = false;
        });
      }
      };
    },
    loadMovieDetail : function(scope, movieId) {
      // console.log('in loadMovies');
      var config = Configurations.getConfigurations();
      // console.log(config);
      if(!config) {
        Configurations.init(this.loadMovieDetailCallBack(scope, movieId));
      } else {
        // console.log('in else');
        this.loadMovieDetailCallBack(scope, movieId)();
        // call the function returned by the call back function
      }
      
    }
  };

}]);
