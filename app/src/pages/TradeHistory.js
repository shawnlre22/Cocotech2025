import React, { useState, useEffect } from "react";
import NavBar from "../Components/NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TradeHistoryTable from "../Components/TradeHistoryTable";
import "../Components/DashboardSummary.css";
import "./trading.css";

const Trading = () => {
  const [tradeHistory, setTradeHistory] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const tradeHistoryRes = await fetch(
          "http://localhost:3001/trading/txnHistory/1"
        );

        if (!tradeHistoryRes.ok) {
          throw new Error("Failed to fetch trade history");
        }

        const tradeHistoryJson = await tradeHistoryRes.json();

        if (tradeHistoryJson.result) {
          const processedTrades = tradeHistoryJson.result.map((obj) => {
            const tmpObj = {};
            Object.keys(obj).forEach((k) => {
              tmpObj[k] = k === "is_buy" ? obj[k]["data"][0] : obj[k];
            });
            return tmpObj;
          });
          setTradeHistory(processedTrades);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      <Container>
        <br />
        <Row>
          <Col sm={12}>
            <h4>Trade History</h4>
            {/* Pass full trade history to table; filter handled inside table */}
            <TradeHistoryTable history={tradeHistory} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Trading;
