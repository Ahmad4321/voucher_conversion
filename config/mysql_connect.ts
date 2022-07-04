import mysql from 'mysql'

var mysql_connect = mysql.createConnection({  
  host: "161.97.114.150",  
  user: "omniconnect",  
  password: "OmN!C00n#cT&8",
  database: "voucher_conversions"  
});  
mysql_connect.connect(function(err : any) {  
  if (err) throw err;  
  console.log("Connected!");  
});  


export { mysql_connect }