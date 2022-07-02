
import { Request , Response , NextFunction } from 'express';
import oracledb from 'oracledb';
import { connection } from '../config';
import { loadnewasnvouchers } from '../dto';

export const getPendingVouchers = async (req:Request , res : Response , next : NextFunction) => {
    let head_details : any=  [];
    const sql = `select DATE_PAYLOAD from voucher_conversion where pending = 0 and TOTAL_QTY > 0`;


    const result = await connection.execute(sql,{},{ extendedMetaData: true, fetchInfo: {"MYCLOB": { type: oracledb.STRING }}} );

    for await (const header_asn of result.rows) {
        // console.log(header_asn['DATE_PAYLOAD']);
        head_details.push(header_asn['DATE_PAYLOAD']);
    }

    // res.json({"status" : 1 , "message" : "data fetched!" , "data" : head_details})
    res.json(result);
}


export const compareandsavevouchers = async (req:Request , res : Response , next : NextFunction) => {
    let ted : any;
    let head_details : any=  [];
    const sql = `SELECT * FROM voucher_conversion where pending = 0 and TOTAL_QTY >= 0`;


    const result = await connection.execute(sql,{} ,{outFormat: oracledb.OUT_FORMAT_OBJECT
    });
}


export const loadpendingvoucherbyid = async (req:Request , res : Response , next : NextFunction) => {
    const asn_no = req.body.asn_no
    res.json({"message":"Asn fetched!"+asn_no})
}


export const saveupdatedvoucherscan = async (req:Request , res : Response , next : NextFunction) => {
    
}

export const loadnewpendingvouchers = async (req:Request , res : Response , next : NextFunction) => {
    let head_details : any=  [];
    const sql = `SELECT to_char(V.VOU_SID) vou_sid,V.STORE_NO,asn_no,vou_no FROM VOUCHER V, VOU_ITEM VI 
    WHERE  V.VOU_SID = VI.VOU_SID
    AND V.VOU_CLASS = 2
    AND V.held <> 1
    AND V.SLIP_FLAG = 1
    and v.vou_sid not in (select vou_sid from voucher_conversion)
    group by V.VOU_SID,V.STORE_NO,asn_no,vou_no`;


    const result = await connection.execute(sql,{} ,{outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    let count = 0;

    for await (const header_asn of result.rows) {

        let sql_item = "select to_char(item_sid) item_sid , orig_qty ,qty , price, tax_perc from vou_item where vou_sid = "+header_asn['VOU_SID'];

        const result_items = await connection.execute(sql_item,{} ,{outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        
        let item_details : any=  [];
        let sum_qty = 0;
        for await (const items of result_items.rows) {

            sum_qty = sum_qty+items['QTY'];

            const items_json = {
                "vou_sid"  : header_asn['VOU_SID'],
                "item_sid"  : items['ITEM_SID'],
                "item_pos" : items['ITEM_POS'],
                "qty" : items['QTY'],
                "price" : items['PRICE'],
                "tax_perc" : items['TAX_PERC'],
                "upc" : "",
                "scanned_qty" : 0,
                "scanned_by" : "",
                "scanned_at" : ""
            }
            item_details.push(items_json);  
        }
        const headerqq = {
            "vou_sid" : header_asn['VOU_SID'],
            "vou_no"  : header_asn['VOU_NO'],
            "store_no" : header_asn['STORE_NO'],
            "total_qty" : sum_qty,
            "qty_diff" : 0,
            "items" : item_details
        }

        head_details.push(headerqq);

        const json = JSON.stringify(headerqq);

        const insert_query = "INSERT INTO voucher_conversion (date_payload,vou_sid,vou_no,store_no,total_qty) VALUES ('"+json+"','"+header_asn['VOU_SID']+"',"+header_asn['VOU_NO']+","+header_asn['STORE_NO'] +","+sum_qty+")";

        try {
            const insert_items = await connection.execute(insert_query, {} ,{outFormat: oracledb.OUT_FORMAT_OBJECT
            });
            count++;
        } catch(err) {
            res.json(err);
            console.log(err)
            break;
        }
    }
    if (count == 0) {
        res.json({"message" : " asn has already been inserted"})
    } else {
        res.json({"message" : count+" asn has been inserted"});
    }
}