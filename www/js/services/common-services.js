angular.module('watchout.common-services', [])

.factory('Configurations', function(){
    var config;
    var isLoading = false;
 return {
  init : function(callBack) {
    // calling movie db to get configurations
    if(!config && !isLoading) {
      isLoading = true;
      theMovieDb.configurations.getConfiguration(
      function(data) {
        console.log("Setting configurations");
        // console.log(arguments);
        config = JSON.parse(data);
        console.log(config);
        isLoading = false;
        if(callBack) {
         callBack();
         console.log('Calling back');
        }
      }, 
      function(data){
        isLoading=false;
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