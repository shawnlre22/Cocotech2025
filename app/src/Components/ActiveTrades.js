import React from 'react';
import './ActiveTrades.css';

const ActiveTrades = ({ trades }) => {
    return (
        <div className="table-container">
            <table className="active-trades-table">
                <thead>
                    <tr>
                        <th>Trade ID</th>
                        <th>Asset</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Risk Status</th> 
                    </tr>
                </thead>
                <tbody>
                    {trades.map((trade) => (
                        <tr key={trade.id}>
                            <td>{trade.id}</td>
                            <td>{trade.asset}</td>
                            <td>{trade.quantity}</td>
                            <td>{trade.price}</td>
                            <td>{trade.status}</td>
                            <td>{trade.riskStatus}</td> {/* New data for Risk Status */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActiveTrades;