import oracledb from 'oracledb';

oracledb.autoCommit = true;


async function get_oracle_connection() {
  let connection : any;
  try {
    connection  = await oracledb.getConnection({
      user: "reportuser",
      password: "report",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST   = 161.97.114.150)(PORT = 1521))(CONNECT_DATA =(SID= RPROODS)))"
    });
    
  } catch (error) {
    connection = '';
    
  }

  return connection;
  
}



export { get_oracle_connection }


