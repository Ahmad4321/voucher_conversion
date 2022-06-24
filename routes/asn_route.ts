import express, {Request , Response , NextFunction} from 'express';

const router =  express.Router();


router.get ('/fetch_asn',(res,req)=>{
    req.send("text");
});


export { router as fetch_asn};