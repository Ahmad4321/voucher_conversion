import express, { Request , Response , NextFunction } from 'express';
import oracledb from 'oracledb';
import { get_oracle_connection, mysql_connection } from '../config';


// mysql

export const tablemigration = async (req:Request , res : Response , next : NextFunction) => {
    const mysql_connect  = await mysql_connection();
    const connection = await get_oracle_connection();
    const query_for_mysql = "CREATE TABLE `voucher_conversions`.`voucher_conversions` ("+
        "`row_id` int(10) NOT NULL AUTO_INCREMENT,"+
        "`DATE_PAYLOAD` blob NOT NULL,"+
        "`VOU_SID` varchar(40) DEFAULT NULL UNIQUE ,"+
        "`VOU_NO` varchar(20) DEFAULT NULL UNIQUE ,"+
        "`STORE_NO` int(20) DEFAULT 0,"+
        "`PENDING` tinyint(1) DEFAULT 0,"+
        "`TOTAL_QTY` int(40) DEFAULT 0,"+
        "PRIMARY KEY (`row_id`))";

    const result_mysql_db : any = await mysql_query_execute(mysql_connect,query_for_mysql).then((response)=>{return response; });

    const result_oracle = "CREATE TABLE REPORTUSER.VOUCHER_CONVERSION"+
    "(ROW_ID        NUMBER GENERATED ALWAYS AS IDENTITY ( START WITH 1 MAXVALUE 9999999999999999999999999999 MINVALUE 1 CYCLE CACHE 20 ORDER KEEP) NOT NULL,"+
    "VOU_SID       VARCHAR2(50 BYTE),"+
    "VOU_NO        NUMBER,"+
    "STORE_NO      NUMBER,"+
    "PENDING       NUMBER DEFAULT 0,"+
    "TOTAL_QTY     NUMBER  DEFAULT 0)";
    let result_items : any;
    result_items = await oracle_query_execute(connection,result_oracle).then((response)=>{return response; });

    res.json({"mysql_output" : result_mysql_db,"oracle_output": result_items});



}


async function mysql_query_execute(connect : any,query_db:any) {
    return new Promise((resolve, reject)=>{
        connect.query(query_db,(err : any, result : any, fields : any) => { 
            if (err) {
                // reject(err);
                resolve({"status" : 0 ,"message":err});
            } else {
                resolve({"status" : 1 ,"message":result});
            }
        })

    });
}

async function oracle_query_execute(connect : any,query_db:any) {
    return new Promise((resolve, reject)=>{
        connect.execute(query_db,(err : any, result : any, fields : any) => { 
            if (err) {
                // reject(err);
                resolve({"status" : 0 ,"message":err});
            } else {
                resolve({"status" : 1 ,"message":result});
            }
        })

    });
}
