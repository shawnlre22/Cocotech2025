import NavBar from '../Components/NavBar';

import "../Components/DashboardSummary.css";
import Container from 'react-bootstrap/esm/Container';
import TradeHistoryTable from '../Components/TradeHistoryTable';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./trading.css"

import React, { useState } from "react";


const Trading = () => {


const assetDataTmp = [
  { name: 'Stocks', value: 400 },
  { name: 'Bonds', value: 300 },
  { name: 'Crypto', value: 200 },
  { name: 'Cash', value: 100 },
  { name: 'Cash2', value: 10 },
];  //dummy trades


const [isBuy, setIsBuy] = useState(1) //1:buy 0:sell
    
const userId = 1;

const [loading, setLoading] = useState(true);

//form fields
const [stockId, setStockId] = useState('')
const [unitStockPrices, setUnitStockPrices] = useState({});
const [unitsOfStock, setUnitsOfStock] = useState(0);
const [totalPrice, setTotalPrice] = useState(0);

//for ddl
const [stockIds, setStockIds] = useState([])

//wallet stock balance
const [walletBalance, setWalletBalance] = useState(0);
const [stockBalances, setStockBalances] = useState([]);

//form assistance
const [lastChanged, setLastChanged] = useState("");
const [isValid, setIsValid] = useState(true);


//1. 3 cards
// totalPV(cal), totalInvestedCost
//title, data
const [tradeHistory, setTradeHistory] = useState([])
const [trades, setTrades] = useState([])


//2. AT tables
// stockId, unitsOfStock, unitPrice, Active {buy/sell button}

React.useEffect(() => {
      async function fetchData() {
        try {
          const tmpCardsData = []
          //fetch stock price also
          const [tradeHistoryRes] =  await Promise.all([
            fetch("http://localhost:3001/trading/txnHistory/1")
          ]);

          if (!tradeHistoryRes.ok) {
            throw new Error("One of the requests failed");
          }

          const [tradeHistoryJson] = await Promise.all([
            tradeHistoryRes.json()
          ]);


          //stock
          
          if (tradeHistoryJson.result) {
            const tmpList = []
            tradeHistoryJson.result.forEach(obj => {
                const tmpObj = {}
                console.log(obj)
                Object.keys(obj).forEach(k => {
                    if (k === 'is_buy') {
                        tmpObj[k] = obj[k]['data'][0]
                    } else {
                        tmpObj[k] = obj[k]
                    }
                })
                tmpList.push(tmpObj)
                
            })
            setTradeHistory(tmpList)

            
          }

          //stockBalances
          

          

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

return (
<>
<NavBar></NavBar>
  
  <Container>
    <Row>
      <Col sm={12}>
        <h4>Trade History</h4>
        <TradeHistoryTable history={tradeHistory} />

      </Col>
      
    </Row>
  </Container>
</>
)};
  
export default Trading;