import connection from '../config/db.js';

//buy and sell is indicated in is_buy
export const buy = async (user_id, stock_id, unit_stock_price, units_of_stock, total_price, is_buy) => {
    try {
		const now = new Date();
        const sqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

        await connection.query(`INSERT INTO txn_history
(user_id,
stock_id,
units_of_stock,
txn_amt,
unit_stock_price,
txn_time,
is_buy)
VALUES
(?,?,?,?,?,?,?);
`, [user_id, stock_id, units_of_stock, total_price, unit_stock_price, sqlDateTime, is_buy])



        return { user_id,
            stock_id,
            units_of_stock,
            txn_amt: unit_stock_price,
            unit_stock_price,
            txn_time: sqlDateTime,
            is_buy,
            message: `Stock ${is_buy ? "buy" : "sell"} Success` };
    } catch (error) {
        console.error('Error buying stock', error);
        throw error;
    }
};

//GET
export const calculateWalletBalance = async (user_id) => {
    try {
      const result = await connection.query(` SELECT user_id, current_balance AS balance 
        FROM user_wallet_balance WHERE user_id = ?`,
        [user_id]);

      return {result: result[0][0]};
    }
    catch (error) {
        console.error('Error calculating wallet balance', error);
        throw error;
    }      
}

//update Wallet balance from top up/cash out
export const updateWalletBalance = async (user_id, change) => {
  try {
    await connection.query(
      `UPDATE user_wallet_balance 
       SET current_balance = current_balance + ? 
       WHERE user_id = ?`,
      [change, user_id]
    );

    // Return the updated balance
    return calculateWalletBalance(user_id);
  } catch (error) {
    console.error('Error updating wallet balance', error);
    throw error;
  }
};

//GET
export const calculateStockBalance = async (user_id,stock_id) => {
    try {
      const result = await connection.query(` SELECT *  
        FROM active_trades WHERE user_id = ? AND stock_id = ?`,
        [user_id, stock_id]);

      return {result: result[0][0]};
    }
    catch (error) {
        console.error('Error calculating wallet balance', error);
        throw error;
    }      
}

//POST
export const topUpCashOut = async (user_id,amount, is_top_up) => {
  try {
    const now = new Date();
    const sqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');


    const query = `
    INSERT INTO wallets
(user_id,
txn_time,
amount,
is_topup)
VALUES
(?,?,?,?)
    `
    const result = await connection.query(query, [user_id, sqlDateTime, amount, is_top_up])

    return { user_id, amount, is_top_up,
            txn_time: sqlDateTime,
            message: `Wallet ${is_top_up ? "Top Up" : "Cash Out"} Success` };
  }
  catch (error) {
        console.error('Error Top Up or Cash Out', error);
        throw error;
    }       
}


export const getAllStocks = async () => {
  try {
  const query = `SELECT * FROM stocks`
  const result = await connection.query(query);
  return {result: result[0]};
  } catch (error) {
    console.error('Error getting all stocks', error);
    throw error;
  }
}