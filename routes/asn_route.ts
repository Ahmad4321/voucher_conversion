import express, {Request , Response , NextFunction} from 'express';
import { getPendingVouchers , loadpendingvoucherbyid , saveupdatedvoucherscan, compareandsavevouchers ,loadnewpendingvouchers } from '../controllers';

const router =  express.Router();


router.get ('/getpendingvouchers',getPendingVouchers); //done
router.post ('/loadpendingvoucherbyid',loadpendingvoucherbyid); // Done
router.get ('/loadnewpendingvouchers',loadnewpendingvouchers); // Done
router.post ('/saveupdatedvoucherscan',saveupdatedvoucherscan); // working
router.post ('/compareandsavevouchers',compareandsavevouchers);





export { router as fetch_asn};