import oracledb from 'oracledb';



let connection : any;

oracledb.getConnection({
    user: "reportuser",
    password: "report",
    connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST   = 161.97.114.150)(PORT = 1521))(CONNECT_DATA =(SID= RPROODS)))"
}).then((result)=>{
  connection = result
  // console.log(result)

});



export { connection }


