getDisplayDate = function(inlineDate){
	var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	if(inlineDate.length > 0) {
		var dateFragments = inlineDate.split("-");
		if(dateFragments.length == 3) {
			return dateFragments[2]
				+ '-' + months[(1*dateFragments[1])-1]
				+ '-' + dateFragments[0];
		}
	}
	return inlineDate;
};
addNotification = function(notificationData, windowObj){
	if(windowObj && !isObjectEmpty(notificationData)) {
		window.plugin.notification.local.schedule({
	      id: notificationData.id,
	      title:   notificationData.title,
	      message: notificationData.message,
	      at : notificationData.alertOnDate,
	      icon:      'ic_notification',
	      smallIcon: 'ic_notification_small',
		});
	}
};
cancelNotification = function(notificationData, windowObj,scope){
	if(windowObj && !isObjectEmpty(notificationData)) {
		window.plugin.notification.local.cancel(notificationData.id, function() {
			console.log('Notifcation cancelled : ' + notificationData.id);
		}, scope);
	}
};

isObjectEmpty = function(tObj) {
	return Object.keys(tObj).length == 0;
};

getSaveGenresFunction = function(id, tx,tableName){
  return function() {
    var query = "insert into "+ tableName+"(genreid) values(?)";
      tx.executeSql(query, [''+id], function(tx, res) {
          console.log("Inserting Genre :"+ id);
      }, function (err) {
          console.error(err);
      });
  };
};
