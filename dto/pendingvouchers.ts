
export interface loadnewasnvouchers {
    voucher_sid : Number,
    created_Datetime : String ,
    vou_no : Number,
    asn_no : Number,
    slip_sid : Number,
    items : [
        vou_sid : Number,
        item_sid : Number,
        scanned_qty : Number,
        aviabale_qty : Number,
        qty_diff : Number,
        scan_upc : Number,
        modified_datetime : String,
    ]
}