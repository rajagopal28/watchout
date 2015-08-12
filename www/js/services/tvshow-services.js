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

.factory('TVShows', function(){
  var tvShows = [
   {
      "backdrop_path":"https://image.tmdb.org/t/p/w500/aKz3lXU71wqdslC1IYRC3yHD6yw.jpg",
      "first_air_date":"2011-04-17",
      "genre_ids":[
         10765,
         18
      ],
      "id":1399,
      "original_language":"en",
      "original_name":"Game of Thrones",
      "overview":"Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and icy horrors beyond.\n\n",
      "origin_country":[
         "US"
      ],
      "poster_path":"https://image.tmdb.org/t/p/w500/jIhL6mlT7AblhbHJgEoiBIOUVl1.jpg",
      "popularity":36.072708,
      "name":"Game of Thrones",
      "vote_average":9.1,
      "vote_count":273
   },
   {
      "backdrop_path":"https://image.tmdb.org/t/p/w500/kohPYEYHuQLWX3gjchmrWWOEycD.jpg",
      "first_air_date":"2015-06-12",
      "genre_ids":[
         878
      ],
      "id":62425,
      "original_language":"en",
      "original_name":"Dark Matter",
      "overview":"The six-person crew of a derelict spaceship awakens from stasis in the farthest reaches of space. Their memories wiped clean, they have no recollection of who they are or how they got on board. The only clue to their identities is a cargo bay full of weaponry and a destination: a remote mining colony that is about to become a war zone. With no idea whose side they are on, they face a deadly decision. Will these amnesiacs turn their backs on history, or will their pasts catch up with them?",
      "origin_country":[
         "CA"
      ],
      "poster_path":"https://image.tmdb.org/t/p/w500/iDSXueb3hjerXMq5w92rBP16LWY.jpg",
      "popularity":27.373853,
      "name":"Dark Matter",
      "vote_average":6.4,
      "vote_count":4
   },
   {
      "backdrop_path":"https://image.tmdb.org/t/p/w500/nGsNruW3W27V6r4gkyc3iiEGsKR.jpg",
      "first_air_date":"2007-09-24",
      "genre_ids":[
         35
      ],
      "id":1418,
      "original_language":"en",
      "original_name":"The Big Bang Theory",
      "overview":"The Big Bang Theory is centered on five characters living in Pasadena, California: roommates Leonard Hofstadter and Sheldon Cooper; Penny, a waitress and aspiring actress who lives across the hall; and Leonard and Sheldon's equally geeky and socially awkward friends and co-workers, mechanical engineer Howard Wolowitz and astrophysicist Raj Koothrappali. The geekiness and intellect of the four guys is contrasted for comic effect with Penny's social skills and common sense.",
      "origin_country":[
         "US"
      ],
      "poster_path":"https://image.tmdb.org/t/p/w500/8SUIoe1ENMHWLZ0fe2sMqMP3eZD.jpg",
      "popularity":21.903248,
      "name":"The Big Bang Theory",
      "vote_average":8.0,
      "vote_count":181
   },
   {
      "backdrop_path":"https://image.tmdb.org/t/p/w500/jXpndJTekLFYcx3xX0H3sDqFnJU.jpg",
      "first_air_date":"2015-06-02",
      "genre_ids":[
         878
      ],
      "id":62196,
      "original_language":"en",
      "original_name":"Stitchers",
      "overview":"A young woman is recruited into a secret government agency to be “stitched” into the minds of the recently deceased, using their memories to investigate murders.",
      "origin_country":[
         "US"
      ],
      "poster_path":"https://image.tmdb.org/t/p/w500/2Ni5y120OSt6lSHGDavU1nDrHHP.jpg",
      "popularity":19.064832,
      "name":"Stitchers",
      "vote_average":7.5,
      "vote_count":4
   },
   {
      "backdrop_path":"https://image.tmdb.org/t/p/w500/t6JB8bgobNr7qNnO1vXBOYayo5T.jpg",
      "first_air_date":"2015-06-14",
      "genre_ids":[
         18,
         878
      ],
      "id":62822,
      "original_language":"en",
      "original_name":"Humans",
      "overview":"In a parallel present where the latest must-have gadget for any busy family is a 'Synth' - a highly-developed robotic servant that's so similar to a real human it's transforming the way we live.",
      "origin_country":[
         "GB",
         "US"
      ],
      "poster_path":"https://image.tmdb.org/t/p/w500/gJCyS65ieDT827F2NR9Nx9ZLuw5.jpg",
      "popularity":19.560703,
      "name":"Humans",
      "vote_average":9.2,
      "vote_count":3
   },
   {
      "backdrop_path":"https://image.tmdb.org/t/p/w500/tacmO3UpPX26bb1EQz8c11lQezR.jpg",
      "first_air_date":"2015-06-16",
      "genre_ids":[
         35
      ],
      "id":62771,
      "original_language":"en",
      "original_name":"Clipped",
      "overview":"Clipped centers on a group of barbershop coworkers who all went to high school together but ran in very different crowds. Now they find themselves working together at Buzzy's, a barbershop in Charlestown, Massachusetts.",
      "origin_country":[
         "US"
      ],
      "poster_path":"https://image.tmdb.org/t/p/w500/a7Tp2hVM3aMINT9L5blINV6AweY.jpg",
      "popularity":17.63514,
      "name":"Clipped",
      "vote_average":4.0,
      "vote_count":1
   },
   {
      "backdrop_path":"https://image.tmdb.org/t/p/w500/bYjc2HolyI2HWGhftWsyo5HgqTC.jpg",
      "first_air_date":"2014-06-27",
      "genre_ids":[
         10751,
         35
      ],
      "id":46028,
      "original_language":"en",
      "original_name":"Girl Meets World",
      "overview":"Based on ABC's hugely popular 1993-2000 sitcom, this comedy, set in New York City, tells the wonderfully funny, heartfelt stories that \"Boy Meets World\" is renowned for – only this time from a tween girl's perspective – as the curious and bright 7th grader Riley Matthews and her quick-witted friend Maya Fox embark on an unforgettable middle school experience. But their plans for a carefree year will be adjusted slightly under the watchful eyes of Riley's parents – dad Cory, who's also a faculty member (and their new History teacher), and mom Topanga, who owns a trendy afterschool hangout that specializes in pudding.",
      "origin_country":[
         "US"
      ],
      "poster_path":"https://image.tmdb.org/t/p/w500/yeRT4hAVoCz6RjLUiwdZ8Of34Th.jpg",
      "popularity":18.319562,
      "name":"Girl Meets World",
      "vote_average":7.5,
      "vote_count":1
   },
   {
      "backdrop_path":"https://image.tmdb.org/t/p/w500/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg",
      "first_air_date":"2008-01-19",
      "genre_ids":[
         18
      ],
      "id":1396,
      "original_language":"en",
      "original_name":"Breaking Bad",
      "overview":"Breaking Bad is an American crime drama television series created and produced by Vince Gilligan. Set and produced in Albuquerque, New Mexico, Breaking Bad is the story of Walter White, a struggling high school chemistry teacher who is diagnosed with inoperable lung cancer at the beginning of the series. He turns to a life of crime, producing and selling methamphetamine, in order to secure his family's financial future before he dies, teaming with his former student, Jesse Pinkman. Heavily serialized, the series is known for positioning its characters in seemingly inextricable corners and has been labeled a contemporary western by its creator.",
      "origin_country":[
         "US"
      ],
      "poster_path":"https://image.tmdb.org/t/p/w500/4yMXf3DW6oCL0lVPZaZM2GypgwE.jpg",
      "popularity":12.414573,
      "name":"Breaking Bad",
      "vote_average":8.9,
      "vote_count":241
   }
];
return {
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

});
