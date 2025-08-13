import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const Wallet = () => {
  const [isBuy, setIsBuy] = useState(1); // 1: Top Up, 0: Cash Out
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const userId = 1;

  // Fetch wallet balance from backend
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

  // Handle top up / cash out
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }

    // POST to top up or cash out
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
        fetchWalletBalance(); // Refresh after transaction
      })
      .catch((err) => console.error("Update error:", err));
  };

  // Check if Cash Out exceeds balance
  const isCashOutInvalid =
    isBuy === 0 && Number(amount) > walletBalance;

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Action</Form.Label>
        <Form.Select
          value={isBuy}
          onChange={(e) => setIsBuy(Number(e.target.value))}
        >
          <option value="1">Top Up</option>
          <option value="0">Cash Out</option>
        </Form.Select>
      </Form.Group>

      <div className="mb-3">
        <strong>Wallet Balance: ${walletBalance.toLocaleString()}</strong>
      </div>

      <Form.Group>
        <Form.Control
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(evt) => {
            if (["e", "+", "-"].includes(evt.key)) {
              evt.preventDefault();
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

      <Button
        type="submit"
        className="mt-3"
        disabled={isCashOutInvalid || !amount}
      >
        {isBuy === 1 ? "Top Up" : "Cash Out"}
      </Button>
    </Form>
  );
};
