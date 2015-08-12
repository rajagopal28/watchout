angular.module('watchout.tvshow-services', [])

.factory('TVGenres', function(){
    var tvGenres = [{
      "id":10759,
      "name":"Action & Adventure"
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
      "id":10762,
      "name":"Kids"
   },
   {
      "id":9648,
      "name":"Mystery"
   },
   {
      "id":10763,
      "name":"News"
   },
   {
      "id":10764,
      "name":"Reality"
   },
   {
      "id":10765,
      "name":"Sci-Fi & Fantasy"
   },
   {
      "id":10766,
      "name":"Soap"
   },
   {
      "id":10767,
      "name":"Talk"
   },
   {
      "id":10768,
      "name":"War & Politics"
   },
   {
      "id":37,
      "name":"Western"
   }];
   var selectedTVGenres = [];
 return {
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
    loadTVShows : function(scope, pagetoLoad) {
      discoverWithAttributes.page = pagetoLoad + 1;
      var config = Configurations.getConfigurations();
      if(!isLoading) {
        isLoading = true;
        theMovieDb.discover.getTvShows(discoverWithAttributes,
        function(data) {
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
                  tvShowGenreLabels += ',';
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
