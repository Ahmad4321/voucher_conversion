import express, {Request , Response , NextFunction} from 'express';
import { getPendingVouchers , loadpendingvoucherbyid , saveupdatedvoucherscan, compareandsavevouchers ,loadnewpendingvouchers } from '../controllers';

const router =  express.Router();


router.get ('/getpendingvouchers',getPendingVouchers); //done
router.post ('/loadpendingvoucherbyid',loadpendingvoucherbyid);
router.get ('/loadnewpendingvouchers',loadnewpendingvouchers);
router.post ('/saveupdatedvoucherscan',saveupdatedvoucherscan);
router.post ('/compareandsavevouchers',compareandsavevouchers);





export { router as fetch_asn};