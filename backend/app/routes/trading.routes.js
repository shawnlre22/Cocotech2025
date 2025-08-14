import express from 'express';
import * as tradingController from '../controllers/trading.controller.js';

const router = express.Router();

router.post('/buy', tradingController.buy);
router.post('/sell', tradingController.sell);
router.get('/fetch-price/:stock_id', tradingController.fetchStockPrice);
router.get('/fetch-prices', tradingController.fetchStockPrices);

router.get('/wallet/:user_id', tradingController.walletBalance);
router.post('/wallet/topup', tradingController.topUp);
router.post('/wallet/cashout', tradingController.cashOut);

router.get('/stock_balance/:user_id/:stock_id', tradingController.stockBalance);
router.get('/stock_balances/:user_id', tradingController.stockBalances);

router.get('/test', tradingController.test);

router.get('/stocks', tradingController.getAllStocks);

router.get('/stocksCost/:user_id', tradingController.getStocksCost)

router.get('/txnHistory/:user_id', tradingController.getTxnHistory)

router.get('/totalInvestedAmt/:user_id', tradingController.totalInvestedAmt)

export default router;