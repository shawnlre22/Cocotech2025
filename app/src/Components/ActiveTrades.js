import React from 'react';
import './ActiveTrades.css';

const ActiveTrades = ({ trades }) => {
    console.log("AT:",trades)
    return (
        <div className="table-container">
            <table className="active-trades-table">
                <thead>
                    <tr>
                        <th>Stock Symbol</th>
                        <th>Quantity</th>
                        <th>Current Unit Price</th>
                        
                        
                    </tr>
                </thead>
                <tbody>
                    {trades.map((trade) => (
                        <tr key={trade.stock_id}>
                        <td>{trade.stock_id}</td>
                            <td>{trade.quantity}</td>
                            <td>{trade.unit_price}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActiveTrades;