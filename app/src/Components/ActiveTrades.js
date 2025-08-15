import React from 'react';
import Button from 'react-bootstrap/Button';
import './ActiveTrades.css';

const ActiveTrades = ({ trades }) => {
    console.log("AT:",trades)

    const handleBuySellRedirect = (stock_id, is_buy) => {
        const params = new URLSearchParams({
            stock_id,
            is_buy,
            }).toString();
           
            window.location.href = `/buysell?${params}`;

    }


    return (
        <div className="table-container">
            <table className="active-trades-table">
                <thead>
                    <tr>
                        <th>Stock Symbol</th>
                        <th>Quantity</th>
                        <th>Current Unit Price</th>

                        <th>Action</th>
                        
                        
                    </tr>
                </thead>
                <tbody>
                    {trades.map((trade) => (
                        <tr key={trade.stock_id}>
                        <td>{trade.stock_id}</td>
                            <td>{trade.quantity}</td>
                            <td>{trade.unit_price}</td>

                            <td>
                                <Button 
                                className="btn-buy"
                                onClick={() =>
                                    handleBuySellRedirect(trade.stock_id, 1)
                                }>
                            
                                    BUY
                                </Button>
                                
                                <Button 
                                className="btn-sell"
                                onClick={() =>
                                    handleBuySellRedirect(trade.stock_id, 0)
                                }>
                            
                                    SELL
                                </Button>
                                
                                


                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActiveTrades;