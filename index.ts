import express from 'express';
import bodyParser from 'body-parser';
import { oracle_conn } from './config';



const app = express();





app.listen(3000 , ()=>{



    // console.clear();

    // console.log(oracle_conn);

    console.log("App is lisenting to 3000 port");

})

console.log(oracle_conn);

console.log("oracle_conn");