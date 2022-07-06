import oracledb from 'oracledb';

oracledb.autoCommit = true;


async function get_oracle_connection() {
  let connection : any;
  try {
    connection  = await oracledb.getConnection({
      user: process.env.RP_DB_USER_NAME,
      password: process.env.RP_DB_PASSWORD,
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST   = "+process.env.RP_STORE_IP+")(PORT = "+process.env.RP_PORT+"))(CONNECT_DATA =(SID= "+process.env.RP_DATABASE+")))"
    });
    
  } catch (error) {
    connection = '';
    
  }

  return connection;
  
}



export { get_oracle_connection }


