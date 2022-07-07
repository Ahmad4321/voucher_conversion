// import express from 'express';
// import { getPendingVouchers , loadpendingvoucherbyid , saveupdatedvoucherscan, compareandsavevouchers ,loadnewpendingvouchers, tablemigration } from '../controllers';

// const router =  express.Router();


// router.get ('/getpendingvouchers',getPendingVouchers); //done
// router.post ('/loadpendingvoucherbyid',loadpendingvoucherbyid); // Done
// router.get ('/loadnewpendingvouchers',loadnewpendingvouchers); // Done
// router.post ('/saveupdatedvoucherscan',saveupdatedvoucherscan); // DOne
// router.post ('/compareandsavevouchers',compareandsavevouchers); // Done
// router.get ('/tablemigration',tablemigration); // Working






// export { router as fetch_asn};

import a from"express";import{getPendingVouchers as b,loadpendingvoucherbyid as c,saveupdatedvoucherscan as d,compareandsavevouchers as e,loadnewpendingvouchers as f,tablemigration as g}from"../controllers";let router=a.Router();router.get("/getpendingvouchers",b),router.post("/loadpendingvoucherbyid",c),router.get("/loadnewpendingvouchers",f),router.post("/saveupdatedvoucherscan",d),router.post("/compareandsavevouchers",e),router.get("/tablemigration",g);export{router as fetch_asn}