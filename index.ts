import express from 'express';
import bodyParser from 'body-parser';
import { fetch_asn } from './routes';
// import { connection } from './config';
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.RP_STORE_IP);



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))



app.use('/receiving',fetch_asn)





app.listen(process.env.APPLIATION_PORT , ()=>{

    // console.clear();

    console.log("App is lisenting to "+process.env.APPLIATION_PORT+" port");

})