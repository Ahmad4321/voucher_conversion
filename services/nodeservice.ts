import { Service }  from 'node-windows'

export const svc  =  new Service({
    name : "module_asn_voucher_conversions",
    description : "backend application for converesion",
    script : "D:\\Training\\nodejs\\voucher_conversion\\index.ts"
})