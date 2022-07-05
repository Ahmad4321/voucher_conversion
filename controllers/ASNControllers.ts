
import express, { Request , Response , NextFunction } from 'express';
import oracledb from 'oracledb';
import { get_oracle_connection, mysql_connection } from '../config';

export const loadnewpendingvouchers = async (req:Request , res : Response , next : NextFunction) => {
    const mysql_connect  = await mysql_connection();
    const connection = await get_oracle_connection();
    let head_details : any=  [];
    const sql = `SELECT to_char(V.VOU_SID) vou_sid,V.STORE_NO,asn_no,vou_no FROM VOUCHER V, VOU_ITEM VI 
    WHERE  V.VOU_SID = VI.VOU_SID
    AND V.VOU_CLASS = 2
    AND V.held <> 1
    AND V.SLIP_FLAG = 1
    and v.vou_sid not in (select vou_sid from voucher_conversion)
    group by V.VOU_SID,V.STORE_NO,asn_no,vou_no`;

    let result : any;
    result = await connection.execute(sql,{} ,{outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    let count = 0;

    for await (const header_asn of result.rows) {

        let sql_item = "select to_char(vi.item_sid) item_sid , vi.orig_qty ,vi.qty , vi.price, vi.tax_perc, (select local_upc from invn_sbs i where i.item_sid = vi.item_sid) UPC from vou_item vi where vi.vou_sid = "+header_asn['VOU_SID'];

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
            "vou_no"  : header_asn['VOU_NO'],
            "store_no" : header_asn['STORE_NO'],
            "total_qty" : sum_qty,
            "qty_diff" : 0,
            "items" : item_details
        }

        head_details.push(headerqq);

        const json = JSON.stringify(headerqq);

        const insert_query = "INSERT INTO voucher_conversion (vou_sid,vou_no,store_no,total_qty) VALUES ('"+header_asn['VOU_SID']+"',"+header_asn['VOU_NO']+","+header_asn['STORE_NO'] +","+sum_qty+")";

        const insert_mysql_query = "INSERT INTO voucher_conversions (date_payload,vou_sid,vou_no,store_no,total_qty) VALUES ('"+json+"','"+header_asn['VOU_SID']+"',"+header_asn['VOU_NO']+","+header_asn['STORE_NO'] +","+sum_qty+")";

        try {
            const insert_items = await connection.execute(insert_query, {} ,{outFormat: oracledb.OUT_FORMAT_OBJECT
            });

            // mysql insert
            try {
                const row_insert = await mysql_connect.query(insert_mysql_query);
                
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