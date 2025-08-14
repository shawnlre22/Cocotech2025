import React, { useState } from "react";
import "./TradeHistoryTable.css";
import { Row, Col, Form } from "react-bootstrap";

const TradeHistoryTable = ({ history }) => {
  const [filterType, setFilterType] = useState(-1); // -1 = all, 1 = buy, 0 = sell

  // Filter trade history based on Buy/Sell selection
  const filteredHistory =
    filterType === -1
      ? history
      : history.filter((trade) => Number(trade.is_buy) === Number(filterType));

  return (
    <div className="table-container">
      {/* Filter row */}
      <Row className="mb-3 align-items-center">
        <Col sm={2}>
          <Form.Label><strong>Filter:</strong></Form.Label>
        </Col>
        <Col sm={3}>
          <Form.Select
            value={filterType}
            onChange={(e) => setFilterType(Number(e.target.value))}
          >
            <option value={-1}>All</option>
            <option value={1}>BUY</option>
            <option value={0}>SELL</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Trade Table */}
      <table className="active-trades-table table table-striped table-bordered">
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
          {filteredHistory.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No trades to display
              </td>
            </tr>
          ) : (
            filteredHistory.map((trade) => (
              <tr key={trade.stock_id + trade.txn_time}>
                <td>{trade.txn_time}</td>
                <td>{Number(trade.is_buy) === 1 ? "BUY" : "SELL"}</td>
                <td>{trade.stock_id}</td>
                <td>{trade.units_of_stock}</td>
                <td>{trade.unit_stock_price}</td>
                <td>{trade.txn_amt}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TradeHistoryTable;
