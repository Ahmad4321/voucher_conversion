import express from 'express';
import bodyParser from 'body-parser';
import { fetch_asn } from './routes';
// import { connection } from './config';



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))



app.use('/receiving',fetch_asn)





app.listen(3000 , ()=>{

    // console.clear();

    console.log("App is lisenting to 3000 port");

})