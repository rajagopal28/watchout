angular.module('watchout.tvshow-services', [])

.factory('TVGenres', function(){
    var tvGenres = [];
   var selectedTVGenres = [];
 return {
  init : function(scope) {
    tvGenres = [];
    theMovieDb.genres.getList({}, 
      function(data) {
        var parsedData = JSON.parse(data);
        tvGenres = parsedData.genres;
        if(scope) {          
          scope.tvGenres = tvGenres;
          scope.hideSpinner();
        }
      }, 
      function(error){
        console.log('Error CB');
        console.log(error);
      });
  },
  all: function() {
      for (var i = 0; i < tvGenres.length; i++) {
        for (var j=0; j< selectedTVGenres; j++) {
          if(tvGenres[i].id == selectedTVGenres[j].id) {
            tvGenres[i].checked = true;
            console.log(tvGenres[i]);
          }
      }
    }
    return tvGenres;
  },
  get: function(tvGenreId) {
      for (var i = 0; i < tvGenres.length; i++) {
        if(tvGenres[i].id == tvGenreId) {
          return tvGenres[i];
        }
      }

      return null;
  },
  remove: function(tvGenre) {
    tvGenres.splice(tvGenres.indexOf(tvGenre), 1);
  },
  saveFavoriteGenres: function(selectedGenres) {
    selectedTVGenres = selectedGenres;
  },
  getFavouriteGenres: function(){
    return selectedTVGenres;
  }
 };
})

.factory('TVShowSeasons', ['Configurations', function(Configurations){
    var tvShowSeasons = {};
    var isLoading = false;
 return {
  init : function(showId, scope) {
    tvShowSeasons = {};
    var config = Configurations.getConfigurations();
    if(!config) {
      Configurations.init(this.loadTVShowSeasonsCallBack(showId, scope));
    } else {
      this.loadTVShowSeasonsCallBack(showId,scope)();
    }
  },
  loadTVShowSeasonsCallBack : function(showId,scope) {
    return function() {
    if(!isLoading) {
      isLoading = true;
      theMovieDb.tv.getById({id: showId}, 
      function(data) {        
        tvShowSeasons = JSON.parse(data);
        var config = Configurations.getConfigurations();
        console.log(config);
        if(config) {
            var relativeImageURL = tvShowSeasons.backdrop_path;
            if(relativeImageURL) {
              tvShowSeasons.backdrop_path = config.images.base_url + relativeImageURL;
            }
           //  console.log(relativeImageURL);
            relativeImageURL = tvShowSeasons.poster_path;
            if(relativeImageURL) {
              tvShowSeasons.poster_path = config.images.base_url + relativeImageURL;
            }
            // console.log(relativeImageURL);
        }
        if(tvShowSeasons.genres) {
          var genres_label = '';
          for(var i = 0;i<tvShowSeasons.genres.length; i++) {
            if(genres_label.length > 0){
              genres_label += ", ";
            }
            genres_label += tvShowSeasons.genres[i].name;
          }
          console.log(genres_label);
          tvShowSeasons.show_genre_labels = genres_label;
        }
        if(scope) {       
          console.log(tvShowSeasons);   
          scope.tvShowSeasons = tvShowSeasons;
          scope.hideSpinner();
        }
        isLoading = false;
      }, 
      function(error){
        console.log('Error CB');
        console.log(error);
        isLoading = false;
      });
    }
    };
  },
  get: function() {
    return tvShowSeasons;
  }
};
}])

.factory('TVShows',  ['TVGenres', 'Configurations', function(TVGenres, Configurations){
  var tvShows = [];
  var currentPage = 0;
  var isLoading = false;
  var myGenres = TVGenres.getFavouriteGenres();
  var myGenreString = '';
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
      // initialize if the tv shows list
      if(tvShows.length == 0) {
         currentPage = 0;
        var genres = TVGenres.all();
        if(genres.length == 0) {
          TVGenres.init();// init without scope to use genres later
        }
      }
       
      // this.loadTVShows(scope, currentPage);
        
    },
    loadTVShowsCallBack : function(scope, pagetoLoad) {
      return function() {
        if(!isLoading) {
          isLoading = true;
          theMovieDb.discover.getTvShows(discoverWithAttributes,
          function(data) {
            var config = Configurations.getConfigurations();
            // console.log(typeof data)
            var parsedData = JSON.parse(data);
            // console.log(parsedData.results);
            var newShowsPage = parsedData.results;
            for( var index in newShowsPage) {
              var newTVShow = newShowsPage[index];
              // change the poster path
              var relativeImageURL = newTVShow.poster_path;
              // console.log(newTVShow);
              if(relativeImageURL) {
                  if(!relativeImageURL.startsWith(config.images.base_url)) {
                    relativeImageURL = config.images.base_url 
                                        + config.images.poster_sizes[0]
                                        + relativeImageURL;
                    newTVShow.poster_path = relativeImageURL;
                    // console.log(relativeImageURL);
                  }
              } else {
                newTVShow.poster_path = 'http://www.classicposters.com/images/nopicture.gif';
              }
              // change the backdrop path
              relativeImageURL = newTVShow.backdrop_path;
              if(relativeImageURL) {
                // console.log(relativeImageURL);
                if(!relativeImageURL.startsWith(config.images.base_url)) {
                    relativeImageURL = config.images.base_url  
                                        + config.images.backdrop_sizes[0]
                                        + relativeImageURL;
                    newTVShow.backdrop_path = relativeImageURL;
                    // console.log(relativeImageURL);
                  }
              } else {
                newTVShow.backdrop_path = 'http://www.classicposters.com/images/nopicture.gif';
              }
              // add genre names
              var genres = TVGenres.all();
              var tvShowGenreIds  = newTVShow.genre_ids;
              var tvShowGenreLabels = '';
              for(var index in genres) {
                if(tvShowGenreIds.indexOf(genres[index].id) != -1) {
                  if(tvShowGenreLabels.length > 0) {
                    tvShowGenreLabels += ', ';
                  }
                  tvShowGenreLabels += genres[index].name;
                }
              }
              // set it to list item 
              newTVShow.show_genre_labels = tvShowGenreLabels;
              // console.log(tvShowGenreLabels);
            }
            tvShows = tvShows.concat(newShowsPage);
            // console.log(tvShows);
            scope.tvShows = tvShows;
            scope.hideSpinner();
            isLoading = false;
            currentPage = pagetoLoad + 1;
            scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function(error) {
            isLoading = false;
            console.log("Error CB");
            console.log(error);
          });
        }
      };
    },
    loadTVShows : function(scope, pagetoLoad) {
      discoverWithAttributes.page = pagetoLoad + 1;
      var config = Configurations.getConfigurations();
      if(!config) {
        Configurations.init(this.loadTVShowsCallBack(scope, pagetoLoad));
      } else {
        this.loadTVShowsCallBack(scope, pagetoLoad)();
        // call the function that is returned by the function
      }
    },
    loadMore : function(scope) {
      this.init();
      this.loadTVShows(scope, currentPage);
    },
    all: function() {
      return tvShows;
    },
    remove: function(tvShow) {
      movies.splice(tvShows.indexOf(tvShow), 1);
    },
    get: function(showId) {
      for (var i = 0; i < tvShows.length; i++) {
        if (tvShows[i].id === parseInt(showId)) {
          return tvShows[i];
        }
      }
      return null;
    }
  };

}]);
