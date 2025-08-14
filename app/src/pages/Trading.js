import NavBar from '../Components/NavBar';

import "../Components/DashboardSummary.css";
import Container from 'react-bootstrap/esm/Container';
import DashboardSummary from '../Components/DashboardSummary';
import ActiveTrades from '../Components/ActiveTrades';
import AssetLocation from '../Components/AssetLocation';
import {TotalInvestedAmt} from '../Components/TotalInvestedAmt';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./trading.css";

import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Trading = () => {

//1. 3 cards
// totalPV(cal), totalInvestedCost
//title, data
const [cardsData, setCardsData] = useState([])
const [trades, setTrades] = useState([])
const [assetData, setAssetData] = useState([])
const [totalInvestedAmt, setTotalInvestedAmt] = useState([])

//2. AT tables
// stockId, unitsOfStock, unitPrice, Active {buy/sell button}

React.useEffect(() => {
      async function fetchData() {
        try {
          const tmpCardsData = []
          //fetch stock price also
          const [stockIdsRes, stockBalancesRes, stockPricesRes, investedValRes, investedAmtRes] =  await Promise.all([
            fetch("http://localhost:3001/trading/stocks"),
            fetch("http://localhost:3001/trading/stock_balances/1"),
            fetch("http://localhost:3001/trading/fetch-prices"),
            fetch("http://localhost:3001/trading/stocksCost/1"),
            fetch("http://localhost:3001/trading/totalInvestedAmt/1"),
          ]);

          if (!stockIdsRes.ok || !stockBalancesRes.ok || !stockPricesRes.ok || !investedValRes.ok || !investedAmtRes.ok) {
            throw new Error("One of the requests failed");
          }

          const [stockIdJson, stockBalancesJson, stockPricesJson, investedValJson, investedAmtJson] = await Promise.all([
            stockIdsRes.json(),
            stockBalancesRes.json(),
            stockPricesRes.json(),
            investedValRes.json(),
            investedAmtRes.json()
          ]);


          //stock
          
          if (stockIdJson.result) {
            const tmpList = []
            stockIdJson.result.map(obj => tmpList.push(obj.id))
            //setStockIds(tmpList)
            //setStockId(stockIdJson.result[0].id)
            
          }

          //stockBalances
          

           if (stockPricesJson.result) {
            console.log(stockPricesJson.result)
            //setUnitStockPrices(stockPricesJson.result)
          }

          const tmpMap = {}
          const tmpTrades = []
          const tmpAssetData = []
          if (stockBalancesJson.result) {
          
            stockBalancesJson.result.forEach(obj => {
              tmpMap[obj.stock_id] = Number(obj.net_units);

              tmpTrades.push({
                stock_id: obj.stock_id,
                quantity: Number(obj.net_units).toFixed(2),
                unit_price: Number(stockPricesJson.result[obj.stock_id]).toFixed(2)

              })

              tmpAssetData.push({
                name: obj.stock_id,
                value: Number(Number(obj.net_units * stockPricesJson.result[obj.stock_id]).toFixed(2))
              })


            })
            console.log(tmpTrades)
            //setStockBalances(tmpMap)
            setTrades(tmpTrades)

            setAssetData(tmpAssetData)
          } 

          



          if (stockBalancesJson.result && stockPricesJson.result) {
            let tmp1 = 0;

            stockBalancesJson.result.forEach(obj => {
              tmpMap[obj.stock_id] = Number(obj.net_units);
              tmp1 = tmp1 + stockPricesJson.result[obj.stock_id] * Number(obj.net_units)
            })

            tmpCardsData.push({id:"1", title: "Total Portfolio Value", data: tmp1})

          }

          if (investedValJson.result) {
            let tmp = 0

            investedValJson.result.forEach(obj => {
              tmp = tmp + Number(obj.cost)
            })
            console.log(tmp)
              tmpCardsData.push({id:'2', title: "Total Invested Value", data: tmp})
          }

          if(investedAmtJson.result) {
           
            const resultMap = {};

            investedAmtJson.result.forEach(({ txn_minute, stock_id, invested_amt }) => {
              const amt = parseFloat(invested_amt);
              if (!resultMap[txn_minute]) {
                resultMap[txn_minute] = { txn_minute, total_invested_amt: 0 };
              }
              resultMap[txn_minute][stock_id] = amt;
              resultMap[txn_minute].total_invested_amt += amt;
            });

            setTotalInvestedAmt(Object.values(resultMap));
            


          }

           setCardsData(tmpCardsData)

        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          
        }
        
      }

      fetchData();

    },[])


/*
<div><DashboardSummary title="Total Portfolio Value" data="51000"></DashboardSummary></div>
      <div><DashboardSummary title="Total Invested Amount" data="45000"></DashboardSummary></div>
      <div><DashboardSummary title="Overall gain/loss" data="+6000"></DashboardSummary></div>

      Market Value/Qty
      Price/Cost
      P/L
      */
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
                  
                  <Form.Group>
                  <Form.Label>
                    <strong>
                      Wallet Balance: ${walletBalance.toLocaleString()}
                    </strong>
                  </Form.Label>
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
                  <Form.Group>
                 <Form.Label>
                   
                  </Form.Label>
                  <Button
                    type="submit"
                    className="mt-3"
                    style={{
                      backgroundColor: currentColor,
                      borderColor: currentColor,
                      color: "white", // keep text readable

                    }}
                    disabled={isCashOutInvalid || !amount}
                  >
                    {isBuy === 1 ? "Top Up" : "Cash Out"}
                  </Button>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
  </Container>

  <Container>
  <br />
  <h3>Trading Overview</h3>
  <div className="CardInfo">
    {cardsData.map(obj => {
      let tooltipText = '';
      console.log(obj);
      if (obj.id === "1") {
        tooltipText = 'Sum of Market Value of all owned Stocks';
      } else if (obj.id === "2") {
        tooltipText = '(Sum of Cost of Stocks Bought) - (Sum of Value of Stocks Sold)';
      }
      console.log(tooltipText)

      return (
        <div key={obj.title}>
          <DashboardSummary
            title={obj.title}
            data={Number(obj.data).toFixed(2)}
            tooltipText={tooltipText}
          />
        </div>
      );
    })}
  </div>
</Container>

  <br></br>
  <Container>
    <Row>
    <Col sm={4}>
        <h4>Asset Location</h4>
         {/* Donut chart */}
         <AssetLocation data={assetData} />
      </Col>
      <Col sm={8}>
      <h4>Total Invested Amount</h4>
        <TotalInvestedAmt data={totalInvestedAmt} />

      </Col>
      
    </Row>
  </Container>


   <br></br>
  <Container>
    <Row>
      <Col sm={12}>
        <h4>Active Trades</h4>
        <ActiveTrades trades={trades} />

      </Col>
    </Row>
  </Container>

</>
)};
  
export default Trading;
