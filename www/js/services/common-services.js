angular.module('watchout.common-services', [])

.factory('Configurations', function(){
    var config;
 return {
  init : function() {
    // calling movie db to get configurations
    if(!config) {
      theMovieDb.configurations.getConfiguration(
      function(data) {
        console.log("Setting configurations");
        // console.log(arguments);
        config = JSON.parse(data);
        console.log(config);
      }, 
      function(data){
        console.log("in ErrorCB");
        console.log(arguments);
      });
    }
  },
  getConfigurations : function () {
    return config;
  }
 };
});