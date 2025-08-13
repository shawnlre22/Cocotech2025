import NavBar from '../Components/NavBar';

import "../Components/DashboardSummary.css";
import Container from 'react-bootstrap/esm/Container';
import DashboardSummary from '../Components/DashboardSummary';
import ActiveTrades from '../Components/ActiveTrades';
import AssetLocation from '../Components/AssetLocation';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./trading.css"

import React, { useState } from "react";


const Trading = () => {




//1. 3 cards
// totalPV(cal), totalInvestedCost
//title, data
const [cardsData, setCardsData] = useState([])
const [trades, setTrades] = useState([])
const [assetData, setAssetData] = useState([])


//2. AT tables
// stockId, unitsOfStock, unitPrice, Active {buy/sell button}

React.useEffect(() => {
      async function fetchData() {
        try {
          const tmpCardsData = []
          //fetch stock price also
          const [stockIdsRes, stockBalancesRes, stockPricesRes, investedValRes] =  await Promise.all([
            fetch("http://localhost:3001/trading/stocks"),
            fetch("http://localhost:3001/trading/stock_balances/1"),
            fetch("http://localhost:3001/trading/fetch-prices"),
            fetch("http://localhost:3001/trading/stocksCost/1")
          ]);

          if (!stockIdsRes.ok || !stockBalancesRes.ok || !stockPricesRes.ok || !investedValRes.ok) {
            throw new Error("One of the requests failed");
          }

          const [stockIdJson, stockBalancesJson, stockPricesJson, investedValJson] = await Promise.all([
            stockIdsRes.json(),
            stockBalancesRes.json(),
            stockPricesRes.json(),
            investedValRes.json()
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

            tmpCardsData.push({title: "Total Portfolio Value", data: tmp1})

          }

          if (investedValJson.result) {
            let tmp = 0

            investedValJson.result.forEach(obj => {
              tmp = tmp + Number(obj.cost)
            })
            console.log(tmp)
              tmpCardsData.push({title: "Total Invested Amount", data: tmp})
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

return (
<>
<NavBar></NavBar>
  <Container>
    <br></br>
    <h3>Trading Overview</h3>
    <div className="CardInfo">
      

      {cardsData.map(obj => {
        return (<div>
       <DashboardSummary title={obj.title} data={Number(obj.data).toFixed(2)}></DashboardSummary>
        </div>)
      })}
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