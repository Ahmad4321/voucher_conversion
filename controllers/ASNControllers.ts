
import express, { Request , Response , NextFunction } from 'express';
import oracledb from 'oracledb';
import { get_oracle_connection, mysql_connection } from '../config';

export const loadnewpendingvouchers = async (req:Request , res : Response , next : NextFunction) => {
    const mysql_connect  = await mysql_connection();
    const connection = await get_oracle_connection();
    let head_details : any=  [];
    const sql = `select to_char(t.sid) vou_sid,(select ss.STORE_NO from rps.store ss where t.STORE_SID = ss.SID and ss.SBS_SID = t.sbs_sid  and ss.store_no = `+process.env.RP_STORE_NO+`) store_no, t.CREATED_DATETIME ,t.ASN_NO,
    t.VOU_NO,to_char(t.ASN_SID) ASN_SID , to_char(t.CLERK_SID) clerk_sid , t.VOU_TYPE,(select count(vi.item_sid) from rps.vou_item vi where t.sid = vi.vou_sid) total_item
    from RPS.VOUCHER t where
    t.VOU_CLASS = 2
    and t.HELD <> 1
    and t.SLIP_FLAG = 1
    and t.SID not in (select vou_sid from voucher_conversion)`;

    let result : any;
    result = await connection.execute(sql,{} ,{outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    let count = 0;

    for await (const header_asn of result.rows) {

        let sql_item = "select to_char(vi.item_sid) item_sid , vi.orig_qty ,vi.qty , vi.price, vi.tax_perc, (select upc from rps.invn_sbs_item i where i.sid = vi.item_sid) UPC , vi.COST from rps.vou_item vi where vi.vou_sid = "+header_asn['VOU_SID'];

        let result_items : any;
        result_items = await connection.execute(sql_item,{} ,{outFormat: oracledb.OUT_FORMAT_OBJECT
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
                "cost" : items['COST'],
                "price" : items['PRICE'],
                "tax_perc" : items['TAX_PERC'],
                "upc" : items['UPC'],
                "scanned_qty" : 0,
                "scanned_by" : "",
                "scanned_at" : "",
                "new" : 0
            }
            item_details.push(items_json);  
        }
        const headerqq = {
            "vou_sid" : header_asn['VOU_SID'],
            "vou_no"  : header_asn['ASN_NO'],
            "store_no" : header_asn['STORE_NO'],
            "auth_session" : "",
            "created_datetime" : header_asn['CREATED_DATETIME'],
            "asn_no"  : header_asn['ASN_NO'],
            "clerk" : header_asn['CLERK_SID'],
            "approvbysid" : header_asn['CLERK_SID'],
            "line_item" : header_asn['TOTAL_ITEM'],
            "total_qty" : sum_qty,
            "qty_diff" : 0,
            "items" : item_details
        }

        head_details.push(headerqq);

        const json = JSON.stringify(headerqq);

        const insert_query = "INSERT INTO voucher_conversion (vou_sid,vou_no,store_no,total_qty) VALUES ('"+header_asn['VOU_SID']+"',"+header_asn['ASN_NO']+","+header_asn['STORE_NO'] +","+sum_qty+")";

        const insert_mysql_query = "INSERT INTO voucher_conversions (date_payload,vou_sid,vou_no,store_no,total_qty) VALUES ('"+json+"','"+header_asn['VOU_SID']+"',"+header_asn['ASN_NO']+","+header_asn['STORE_NO'] +","+sum_qty+")";

        try {
            const insert_items = await connection.execute(insert_query, {} ,{outFormat: oracledb.OUT_FORMAT_OBJECT
            });

            // mysql insert
            try {
                const row_insert = await insert_voucher_data(mysql_connect,insert_mysql_query).then((response : any)=>{return response; });
                
            } catch (error) {
                
            }

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


async function insert_voucher_data(connect : any,body :any) {
    return new Promise((resolve, reject)=>{
        connect.query(body,(err : any, result : any, fields : any) => { 
            if (err) {
                reject(err);
            } else {
                if (result.affectedRows == 1) {
                    resolve({"status" : 1 , "message" : "Voucher has been inserted!"});
    
                } else {
                    resolve({"status" : 0 , "message" : "Voucher has not been inserted","extra" : result});
                }
            }
        })

    });
}