import NavBar from '../Components/NavBar';

import "../Components/DashboardSummary.css";
import Container from 'react-bootstrap/esm/Container';
import DashboardSummary from '../Components/DashboardSummary';
import ActiveTrades from '../Components/ActiveTrades';
import AssetLocation from '../Components/AssetLocation';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./trading.css"



import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Trading = () => {
  const trades = [
    { id: '1', asset: 'AAPL', quantity: 10, price: 150, status: 'Active', riskStatus: 'Low' },
    { id: '2', asset: 'TSLA', quantity: 5, price: 700, status: 'Active', riskStatus: 'High' },
    { id: '3', asset: 'AMZN', quantity: 2, price: 3200, status: 'Active', riskStatus: 'Medium' },
    { id: '4', asset: 'GOOGL', quantity: 4, price: 2800, status: 'Active', riskStatus: 'Low' },
    { id: '5', asset: 'MSFT', quantity: 8, price: 300, status: 'Active', riskStatus: 'Medium' },
    { id: '6', asset: 'NFLX', quantity: 3, price: 500, status: 'Active', riskStatus: 'High' },
]; //dummy trades

const assetData = [
  { name: 'Stocks', value: 400 },
  { name: 'Bonds', value: 300 },
  { name: 'Crypto', value: 200 },
  { name: 'Cash', value: 100 },
];  //dummy trades
const [isBuy, setIsBuy] = useState(1); // 1: Top Up, 0: Cash Out
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const userId = 1;

  const fetchWalletBalance = () => {
    fetch(`http://localhost:3001/trading/wallet/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const balance = Number(data?.result?.balance || 0);
        setWalletBalance(balance);
      })
      .catch((err) => console.error("Balance fetch error:", err));
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }

    const endpoint =
      isBuy === 1
        ? "http://localhost:3001/trading/wallet/topup"
        : "http://localhost:3001/trading/wallet/cashout";

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        amount: Number(amount),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update balance");
        return res.json();
      })
      .then(() => {
        setAmount("");
        fetchWalletBalance();
      })
      .catch((err) => console.error("Update error:", err));
  };

  const isCashOutInvalid = isBuy === 0 && Number(amount) > walletBalance;

  // Colors for modes
  const topUpColor = "rgb(140, 162, 10)";
  const cashOutColor = "rgb(0, 128, 192)";
  const currentColor = isBuy === 1 ? topUpColor : cashOutColor;

return (
<>
<NavBar></NavBar>
  <Container>
            <br />
            <Form onSubmit={handleSubmit}>
              <Row xs="auto">
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Action</Form.Label>
                    <Form.Select
                      value={isBuy}
                      onChange={(e) => setIsBuy(Number(e.target.value))}
                      style={{
                        backgroundColor: currentColor,
                        color: "black", // keep text readable
                      }}
                    >
                      <option value="1">Top Up</option>
                      <option value="0">Cash Out</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
    
                <Col>
                  <div className="mb-3">
                    <strong>
                      Wallet Balance: ${walletBalance.toLocaleString()}
                    </strong>
                  </div>
                  <Form.Group>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      onKeyDown={(evt) => {
                        if (["e", "+", "-"].includes(evt.key)) {
                          evt.preventDefault();
                        }
                      }}
                      onBlur={() => {
                        if (amount) {
                          setAmount(parseFloat(amount).toFixed(2));
                        }
                      }}
                      required
                    />
                  </Form.Group>
                  {isCashOutInvalid && (
                    <div className="text-danger mt-1">
                      Cannot cash out more than your current balance.
                    </div>
                  )}
                </Col>
    
                <Col  className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                  <Button
                    type="submit"
                    className="mt-3"
                    style={{
                      backgroundColor: currentColor,
                      borderColor: currentColor,
                      color: "black", // keep text readable
                    }}
                    disabled={isCashOutInvalid || !amount}
                  >
                    {isBuy === 1 ? "Top Up" : "Cash Out"}
                  </Button>
                </Col>
              </Row>
            </Form>
  </Container>

  <Container>
    <br></br>
    <h3>Trading Overview</h3>
    <div class="CardInfo">
      <div><DashboardSummary title="Total Portfolio Value" data="51000"></DashboardSummary></div>
      <div><DashboardSummary title="Total Invested Amount" data="45000"></DashboardSummary></div>
      <div><DashboardSummary title="Overall gain/loss" data="+6000"></DashboardSummary></div>
    </div>
  </Container>
  <br></br>
  <Container>
    <Row>
      <Col sm={8}>
        <h4>Active Trades</h4>
        <ActiveTrades trades={trades} />

      </Col>
      <Col sm={4}>
        <h4>Asset Location</h4>
         {/* Donut chart */}
         <AssetLocation data={assetData} />
      </Col>
    </Row>
  </Container>
</>
)};
  
export default Trading;
