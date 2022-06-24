import oracledb from 'oracledb';


// generate oracle connection

 export const oracle_conn = oracledb.getConnection({
    user: "reportuser",
    password: "report",
    connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST   = 192.168.12.102)(PORT = 1521))(CONNECT_DATA =(SID= RPROODS)))"
},function (err ,connection) {
    if (err) { console.error(err.message);
        return 0;
    }
})


