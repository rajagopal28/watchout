
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
