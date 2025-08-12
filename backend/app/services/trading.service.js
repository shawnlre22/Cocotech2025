import connection from '../config/db.js';

//buy and sell is indicated in is_buy
export const buy = async (user_id, stock_id, unit_stock_price, units_of_stock, total_price, is_buy) => {
    try {
		const now = new Date();
        const sqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

        await connection.query(`INSERT INTO cocotech1.txn_history
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