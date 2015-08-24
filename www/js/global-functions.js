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
