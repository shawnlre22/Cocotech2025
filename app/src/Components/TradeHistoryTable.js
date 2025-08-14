import React from 'react';
import './TradeHistoryTable.css';

const TradeHistoryTable = ({ history }) => {
    return (
        <div className="table-container">
            <table className="active-trades-table">
                <thead>
                    <tr>
                        <th>Transaction Time</th>
                        <th>Action</th>
                        <th>Stock Symbol</th>
                        <th>Quantity</th>
                        <th>Unit Price at Execution</th>
                        <th>Total Transaction Amount</th>
                        
                        
                    </tr>
                </thead>
                <tbody>
                    {history.map((trade) => (
                        <tr key={trade.stock_id}>
                            
                            <td>{trade.txn_time}</td>
                            <td>{trade.is_buy ? "BUY" : "SELL"}</td>
                            <td>{trade.stock_id}</td>
                            <td>{trade.units_of_stock}</td>
                            <td>{trade.unit_stock_price}</td>
                            <td>{trade.txn_amt}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TradeHistoryTable;