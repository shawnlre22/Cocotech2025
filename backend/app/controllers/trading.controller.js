import * as tradingService from '../services/trading.service.js';
import axios from 'axios';
/*
userid, stockid
fetch price,
execute
*/


/**
 * Fetch stock data from Yahoo Finance
 * @param {string} symbol - The stock symbol (e.g., "AAPL" for Apple)
 * @returns {Promise<Object>} - The stock data
 */


const fetchStockData = async (symbol) => {
  try {  
      const now = Math.floor(Date.now() / 1000); // current Unix timestamp
      const oneDayAgo = now - 24 * 60 * 60;      // 1 day ago

      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?` +
      `symbol=${symbol}&period1=${oneDayAgo}&period2=${now}&interval=1m&` +
      `includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&region=US`;
      const response = await axios.get(url);

      if (response.data && response.data.chart && response.data.chart.result.length > 0) {
          const regMarket = response.data.chart.result[0]["meta"]["previousClose"];
          return regMarket;
      } else {
          throw new Error('No data found for the given symbol');
      }
  } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error.message);
      throw error;
  }
};

export const buy = async (req, res) => {
    try {
        const body = req.body;
        const is_buy = 1;

        //TODO: check wallet_amt > transaction amt


        const user_id = body.user_id;
        const stock_id = body.stock_id;

        //capped by the total price!
        const total_price = body.total_price;

        //TODO: placeholder or stub only, fetch by finance api!!!!!!
        const new_unit_stock_price = 1.0; 

        const new_units_of_stock = body.total_price / new_unit_stock_price;

        const result = await tradingService.buy(user_id, stock_id, new_unit_stock_price, new_units_of_stock, total_price, is_buy);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


/*
userid, stockid
fetch price,
execute,
sell by UNIT OF STOCK
*/
export const sell = async (req, res) => {
    try {
        const body = req.body;
        const is_buy = 0;

        const user_id = body.user_id;
        const stock_id = body.stock_id;


        //TODO: placeholder or stub only, fetch by finance api!!!!!!
        const new_unit_stock_price = 1.0; 

        //TODO: check current holdings!!!!!
        const units_of_stock = body.units_of_stock;
        const total_price = new_unit_stock_price * units_of_stock;


        const result = await tradingService.buy(user_id, stock_id, new_unit_stock_price, units_of_stock, total_price, is_buy);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const walletBalance = async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const result = await tradingService.calculateWalletBalance(user_id);
      res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

//modify wallet depending on top up/cash out
export const modifyWalletBalance = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { change } = req.body; // positive for Top Up, negative for Cash Out

    if (!change || isNaN(change)) {
      return res.status(400).json({ error: "Invalid change amount" });
    }

    const result = await tradingService.updateWalletBalance(user_id, change);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const stockBalance = async (req, res) => {
    try {
      const { user_id, stock_id } = req.params;

      const result = await tradingService.calculateStockBalance(user_id,stock_id);
      res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const test = (req, res) => {
  res.status(200).json({result: "hello"});
}

export const topUp = async (req, res) => {
    try {
      const { user_id, amount } = req.body;
      const is_top_up = 1;
      const result = await tradingService.topUpCashOut(user_id,amount,is_top_up);
      res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const cashOut = async (req, res) => {
    try {
      const { user_id, amount } = req.body;
      const is_top_up = 0;

      //check wallet current balance
      const resultjson = await tradingService.calculateWalletBalance(user_id);
      const walletBalance = resultjson.result.balance;
 

      if (!floatLessThanOrEqual(amount, walletBalance)) {
        throw new Error("Insufficient wallet balance");
      }

      const result = await tradingService.topUpCashOut(user_id,amount,is_top_up);
      res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function floatLessThanOrEqual(a, b, epsilon = 1e-10) {
  return a < b || Math.abs(a - b) < epsilon;
}

export const getAllStocks = async (req, res) => {
  try {
    const result = await tradingService.getAllStocks();
   
      res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  
}