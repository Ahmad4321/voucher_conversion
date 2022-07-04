import mysql from 'mysql'


async function mysql_connection() {
    var mysql_connect : any;
    try {
        mysql_connect = mysql.createPool({  
            host: "161.97.114.150",  
            user: "omniconnect",  
            password: "OmN!C00n#cT&8",
            database: "voucher_conversions"  
        });  
        mysql_connect.getConnection(function(err : any) {  
            if (err) throw err;  
            console.log("Connected!");  
        }); 
        
    } catch (error) {
        
    }

    return mysql_connect;

} 


export { mysql_connection }