import express, { Request , Response , NextFunction } from 'express';
import { mysql_connection } from '../config';
import request from 'request';


export const getPendingVouchers = async (req:Request , res : Response , next : NextFunction) => {
    const mysql_connect  = await mysql_connection();
    let head_details : any=  [];
    const sql = `select DATE_PAYLOAD from voucher_conversions where pending = 0 and TOTAL_QTY > 0`;

 
    await mysql_connect.query(sql,async (err : any, result :any, fields : any) => { 
        if (err) {
            throw err;
        } else {

            for await (const header_asn of result) {
                try {
                    let data = header_asn.DATE_PAYLOAD.toString('utf-8');
                    head_details.push(JSON.parse(data));
    
                } catch (error) {
                }
            }
            res.json(head_details);

        }
    });

    // res.json({"status" : 1 , "message" : "data fetched!" , "data" : head_details})
}


export const compareandsavevouchers = async (req:Request , res : Response , next : NextFunction) => {

    const mysql_connect  = await mysql_connection();
    if (mysql_connect != '') {
        const asn_no = req.body.vou_no

        const result_db : any = await fetch_data(mysql_connect,req.body).then((response)=>{return response; });

        if (result_db != null) {

            const items = result_db.items;

            // start conversion
            const convert_voucher = await convert_voucher_conversion(result_db).then((response :any)=>{return response; });
            const voucher_data = JSON.parse(convert_voucher);
            if ((voucher_data.data[0].voucherstatuslist).length > 0) {
                // fetch voucher details
                const fetch_voucher = await fetch_voucher_details(result_db).then((response :any)=>{return response; });
                if (fetch_voucher.data[0]) {

                    // update voucher data
                    if (fetch_voucher.data[0].status ==4) {
                        const result_db_up : any = await update_voucher_complete(mysql_connect,req.body).then((response : any)=>{return response; });
                        res.json({"status" : 1 ,"message": result_db_up,"extra" : fetch_voucher.data[0].sid});
                    } else {
                        const update_voucher = await update_voucher_details(fetch_voucher.data[0]).then((response :any)=>{return response; });
                        if (update_voucher.data[0]) {
                            let bool = false;

                            for await (const it of items ) {
                                bool = false;
                                if (it.new == 1 ) {
                                    // check if items is laredy posted
                                    let tool =  false; 
                                    // for await (const qty_verified of update_voucher.data[0].recvitem) {
                                    for await (const qty_verified of fetch_voucher.data[0].recvitem) {
                                        console.log("item upc");
                                        console.log(it.upc);
                                        console.log("qty upc");
                                        console.log( qty_verified.upc);
                                        if (it.upc == qty_verified.upc) {
                                            tool =  true;
                                            break;
                                        }  else {
                                            tool = false;
                                        }
                                    }

                                    if (tool == false) {
                                        const item_data = {
                                            "auth-session" : result_db.auth_session,
                                            "vou_sid" : it.vou_sid,
                                            "prism_item_sid" : it.prism_item_sid,
                                            "item_qty" : it.scanned_qty
                                        }
                                        if (item_data) {
                                            const item_dt = await update_new_voucher_item_details(item_data).then((response :any)=>{return response; });
                                            bool = true;
                                        }

                                    }    

                                } else {
                                    if ( it.qty == it.scanned_qty) {
                                        bool = true;
                                    } else {
                                        // console.log(update_voucher.data[0].recvitem);
                                        let item_data : any;
                                        for await (const qty_verified of update_voucher.data[0].recvitem) {
                                            if (it.upc == qty_verified.upc) {
                                                item_data = {
                                                    "auth-session" : result_db.auth_session,
                                                    "vou_sid" : update_voucher.data[0].sid,
                                                    "vou_item_sid" : qty_verified.sid,
                                                    "item_qty" : it.scanned_qty,
                                                    "item_rowversion" : qty_verified.rowversion,
                                                }
                                            } 
                                        }
                                        if (item_data) {
                                            const item_dt = await update_existing_voucher_item_details(item_data).then((response :any)=>{return response; });
                                            bool = true;
                                        } else {
                                            bool = false;
                                            break;
                                        }
                                    }
                                }
                            }

                            if ( bool == true ) {
                                const fetch_voucher_last = await fetch_voucher_details(result_db).then((response :any)=>{return response; });
                                if (fetch_voucher_last.data[0]) {
                                    const voucher_data = {
                                        "auth-session" : result_db.auth_session,
                                        "vou_sid" : fetch_voucher_last.data[0].sid,
                                        "rowversion" : fetch_voucher_last.data[0].rowversion,
                                        "approvbysid" : "589146682000153260",
                                        "approvdate" : "2022-07-04T12:03:44.673Z",
                                    }
                                    const complete_voucher = await post_complete_voucher_details(voucher_data).then((response :any)=>{return response; });
                                    console.log(complete_voucher);
                                    if (complete_voucher.data[0]) {
                                        const result_db_up : any = await update_voucher_complete(mysql_connect,req.body).then((response : any)=>{return response; });
                                        res.json({"status" : 1 ,"message": result_db_up,"extra" : fetch_voucher.data[0].sid});
                                    }
                                }


                            } else {
                                res.json({"status" : 0 ,"message":"Item qty or item not good"});

                            }

                        }
                    }

                }
            }

        } else {
            res.json({"status" : 0 ,"message":"data not found from db"});
        }

    } else {
        res.json({"status" : 0 ,"message":"mysql connection not found"});
    }

}


export const loadpendingvoucherbyid = async (req:Request , res : Response , next : NextFunction) => {
    const mysql_connect  = await mysql_connection();
    const asn_no = req.body.vou_no
    let head_details : any=  [];
    const sql = `select DATE_PAYLOAD from voucher_conversions where pending = 0 and TOTAL_QTY > 0
    and vou_no  = `+asn_no;

 
    await mysql_connect.query(sql,async (err : any, result :any, fields : any) => { 
        if (err) {
            throw err;
        } else {

            for await (const header_asn of result) {
                try {
                    let data = header_asn.DATE_PAYLOAD.toString('utf-8');
                    head_details.push(JSON.parse(data));
    
                } catch (error) {
                }
            }
            res.json(head_details);

        }
    });
}


export const saveupdatedvoucherscan = async (req:Request , res : Response , next : NextFunction) => {
    const mysql_connect  = await mysql_connection();
    const sql = `Update voucher_conversions set  DATE_PAYLOAD = '`+JSON.stringify(req.body)+`' where vou_no  = `+req.body.vou_no;
    console.log(sql);
 
    await mysql_connect.query(sql,async (err : any, result :any, fields : any) => { 
        if (err) {
            throw err;
        } else {
            if (result.affectedRows == 1) {
                res.json({"status" : 1 , "message" : "Voucher has been updated!"});

            } else {
                res.json({"status" : 0 , "message" : "Voucher has not been updated , voucher Number : "+req.body.vou_no});
            }
        }
    });

}

async function fetch_data(connect : any,body :any) {
    return new Promise((resolve, reject)=>{
        const sql = `select DATE_PAYLOAD from voucher_conversions where pending = 0 and TOTAL_QTY > 0 and vou_no  = `+body.vou_no;
        connect.query(sql,(err : any, result : any, fields : any) => { 
            if (err) {
                reject(err);
            } else {
                const data = JSON.parse(result[0].DATE_PAYLOAD.toString('utf-8'));
                resolve(data);
            }
        })

    });
}

async function update_voucher_complete(connect : any,body :any) {
    return new Promise((resolve, reject)=>{
        const sql = `update voucher_conversions set  pending = 1 where vou_no  = `+body.vou_no;
        connect.query(sql,(err : any, result : any, fields : any) => { 
            if (err) {
                reject(err);
            } else {
                if (result.affectedRows == 1) {
                    resolve({"status" : 1 , "message" : "Voucher has been posted and converted!"});
    
                } else {
                    resolve({"status" : 0 , "message" : "Voucher has not been updated , voucher Number : "+body.vou_no,"extra" : result});
                }
            }
        })

    });
}




async function convert_voucher_conversion(body:any) {
    return new Promise((resolve, reject)=>{
        var options = {
            'method': 'POST',
            'url': 'http://'+process.env.RP_STORE_IP+'/api/backoffice/receiving?action=convertasntovoucher',
            'headers': {'Auth-session': '9FBD40C35D8049E3B5CA13A630CA1590','Accept': 'application/json,version=2',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "data": [{"clerksid" : 589146682000153260, "asnsidlist": body.vou_sid,"originapplication": "RProPrismWeb"}]}
            )
        };

        request(options, function (error, response) {
            if (error) {
                throw new Error(error);
            } else {
                if (response.statusCode == 200) {
                    resolve(response.body);
                } else {
                    resolve({"message" : "Error" ,"status":0});
                }
            }
        })

    });
    
}


async function fetch_voucher_details(body:any) {
    return new Promise((resolve, reject)=>{
        console.log(body.auth_session);
        var options = {
            'method': 'GET',
            'url': 'http://'+process.env.RP_STORE_IP+'/api/backoffice/receiving/'+body.vou_sid+'?cols=sid,rowversion,clerksid,status,recvitem.sid,recvitem.rowversion,recvitem.itemsid,recvitem.qty,recvitem.upc',
            'headers': {'Auth-session': '9FBD40C35D8049E3B5CA13A630CA1590' ,'Accept': 'application/json,version=2','Content-Type': 'application/json'
            }
        };

        request(options, function (error, response) {
            if (error) {
                throw new Error(error);
            } else {
                if (response.statusCode == 200) {
                    resolve(JSON.parse(response.body));
                } else {
                    resolve({"message" : "Error" ,"status":0,"response" :response.body});
                }
            }
        })

    });
    
}


async function update_voucher_details(body:any) {
    return new Promise((resolve, reject)=>{
        console.log(body.auth_session);
        var options = {
            'method': 'PUT',
            'url': 'http://'+process.env.RP_STORE_IP+'/api/backoffice/receiving/'+body.sid+'?cols=sid,rowversion,clerksid,status,recvitem.sid,recvitem.rowversion,recvitem.itemsid,recvitem.qty,recvitem.upc',
            'headers': {'Auth-session': '9FBD40C35D8049E3B5CA13A630CA1590' ,'Accept': 'application/json,version=2','Content-Type': 'application/json'
            },
            body: JSON.stringify({"data":[{"rowversion":body.rowversion,"publishstatus":1}]}
            )
        };

        request(options, function (error, response) {
            if (error) {
                throw new Error(error);
            } else {
                if (response.statusCode == 200) {
                    resolve(JSON.parse(response.body));
                } else {
                    resolve({"message" : "Error" ,"status":0,"response" :response.body});
                }
            }
        })

    });
    
}


async function update_existing_voucher_item_details(body:any) {
    return new Promise((resolve, reject)=>{
        console.log(body.auth_session);
        var options = {
            'method': 'PUT',
            'url': 'http://'+process.env.RP_STORE_IP+'/api/backoffice/receiving/'+body.vou_sid+'/recvitem/'+body.vou_item_sid+'?cols=sid,rowversion,itemsid,qtyupc&filter=rowversion,eq,'+body.item_rowversion,
            'headers': {'Auth-session': '9FBD40C35D8049E3B5CA13A630CA1590' ,'Accept': 'application/json,version=2','Content-Type': 'application/json'
            },
            body: JSON.stringify({"data":[{"rowversion":body.item_rowversion,"qty":body.item_qty}]})
        };

        request(options, function (error, response) {
            if (error) {
                throw new Error(error);
            } else {
                console.log(response.body)
                if (response.statusCode == 200) {
                    resolve(JSON.parse(response.body));
                } else {
                    resolve({"message" : "Error" ,"status":0,"response" :response.body});
                }
            }
        })

    });
    
}

async function update_new_voucher_item_details(body:any) {
    return new Promise((resolve, reject)=>{
        console.log(body.auth_session);
        var options = {
            'method': 'POST',
            'url': 'http://'+process.env.RP_STORE_IP+'/api/backoffice/receiving/'+body.vou_sid+'/recvitem?cols=sid,rowversion,itemsid,qtyupc',
            'headers': {'Auth-session': '9FBD40C35D8049E3B5CA13A630CA1590' ,'Accept': 'application/json,version=2','Content-Type': 'application/json'
            },
            body: JSON.stringify({"data":[{"originapplication":"RProPrismWeb","itemsid": body.prism_item_sid,"qty": body.item_qty,"vousid":body.vou_sid}]})
        };
        // console.log(options);

        request(options, function (error, response) {
            if (error) {
                throw new Error(error);
            } else {
                if (response.statusCode == 200) {
                    resolve(JSON.parse(response.body));
                } else {
                    resolve({"message" : "Error" ,"status":0,"response" :response.body});
                }
            }
        })

    });
    
}


async function post_complete_voucher_details(body:any) {
    return new Promise((resolve, reject)=>{
        var options = {
            'method': 'PUT',
            'url': 'http://'+process.env.RP_STORE_IP+'/api/backoffice/receiving/'+body.vou_sid+'?cols=sid,rowversion&filter=rowversion,eq,'+body.rowversion,
            'headers': {'Auth-session': '9FBD40C35D8049E3B5CA13A630CA1590' ,'Accept': 'application/json,version=2','Content-Type': 'application/json'
            },
            body: JSON.stringify({"data":[{"rowversion":body.rowversion,"status":4,"approvbysid":body.approvbysid,"approvdate":body.approvdate,"approvstatus":2,"publishstatus":2}]})
        };
        console.log(options);

        request(options, function (error, response) {
            if (error) {
                throw new Error(error);
            } else {
                if (response.statusCode == 200) {
                    resolve(JSON.parse(response.body));
                } else {
                    resolve({"message" : "Error" ,"status":0,"response" :response.body});
                }
            }
        })

    });
    
}


