import express from 'express';
import * as tradingController from '../controllers/trading.controller.js';

const router = express.Router();

router.post('/buy', tradingController.buy);
router.post('/sell', tradingController.sell);
//TODO: router.get('/fetch-price', tradingController.fetchPrice);

router.get('/wallet/:user_id', tradingController.walletBalance);
router.get('/stock_balance/:user_id/:stock_id', tradingController.stockBalance);

router.get('/test', tradingController.test);

export default router;