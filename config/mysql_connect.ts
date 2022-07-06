import mysql from 'mysql'


async function mysql_connection() {
    var mysql_connect : any;
    try {
        mysql_connect = mysql.createPool({  
            host: process.env.RP_STORE_IP ,  
            user: process.env.MYSQL_USERNAME,  
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE 
        });  
        mysql_connect.getConnection(function(err : any) {  
            if (err) {
                console.log("DisConnected!");   
            }
            console.log("Connected!");  
        }); 
        
    } catch (error) {
        console.log("DisConnected!");
    }

    return mysql_connect;

} 


export { mysql_connection }


/*
async function mysql_connection() {
    return new Promise((resolve, reject)=>{
        var mysql_connect : any;
        try {
            try {
                mysql_connect = mysql.createPool({  
                    host: "161.97.114.150",  
                    user: "omniconnect",  
                    password: "OmN!C00n#cT&8",
                    database: "voucher_conversions"  
                }); 
                try {
                    mysql_connect.getConnection(function(err : any) {  
                        if (err) {
                            console.log("DisConnected!");   
                        }
                        console.log("Connected!");  
                        resolve(mysql_connect);
                    });
                    
                } catch (error) {
                    
                }
                
            } catch (error) {
                
            } 
            
            
        } catch (error) {
            console.log("DisConnected!");
        }

    });

} 

*/