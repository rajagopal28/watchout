angular.module('watchout.common-services', [])

.factory('Configurations', function(){
    var config;
    var isLoading = false;
    var callBacks = [];
 return {
  init : function(callBack) {
    if(callBack) {
      callBacks.push(callBack);
    }    
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
        while(callBacks.length > 0) {
          var callB = callBacks.pop();
           callB();
           console.log('Calling back');
        }
      }, 
      function(data){
        isLoading=false;
        console.log("in ErrorCB");
        console.log(JSON.stringify(data));
      });
    }
  },
  getConfigurations : function () {
    return config;
  }
 };
});