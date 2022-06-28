
import { Request , Response , NextFunction } from 'express';
import oracledb from 'oracledb';
import { connection } from '../config';

export const getPendingVouchers = async (req:Request , res : Response , next : NextFunction) => {
    let ted : any;
    await connection.execute(
        `SELECT * from users_c`,
        {} 
        ,{outFormat: oracledb.OUT_FORMAT_OBJECT
        },  
       function(err : any, result : any) {
          if (err) {
            console.error(err.message);
            return;
          }
        //   console.log(result.rows);
          res.send(result.rows);
        }
    );
}


export const compareandsavevouchers = async (req:Request , res : Response , next : NextFunction) => {
    let ted : any;
    await connection.execute(
        `SELECT * from users_c`,
        {} 
        ,{outFormat: oracledb.OUT_FORMAT_OBJECT
        },  
       function(err : any, result : any) {
          if (err) {
            console.error(err.message);
            return;
          }
        //   console.log(result.rows);
          res.send(result.rows);
        }
    );
}


export const loadpendingvoucherbyid = async (req:Request , res : Response , next : NextFunction) => {
    const asn_no = req.body.asn_no
    res.json({"message":"Asn fetched!"+asn_no})
}


export const saveupdatedvoucherscan = async (req:Request , res : Response , next : NextFunction) => {
    
}

export const loadnewpendingvouchers = async (req:Request , res : Response , next : NextFunction) => {
    
}