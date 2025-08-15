import NavBar from '../Components/NavBar';
import Container from 'react-bootstrap/esm/Container';
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from "react-bootstrap/InputGroup";
import axios from 'axios'
import { BrowserRouter as  useLocation } from 'react-router-dom';
import './BuySell.css';

//TODO: 1. fetch stocks price
// 2. submit form call api and handle error
// 3. FE polish......
export const BuySellForm = () => {

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
    


    //const location = useLocation();
    const queryParams = new URLSearchParams(window.location.search); // Parse query string
    
    const stockIdQuery = queryParams.get('stock_id');
    const isBuyQuery = queryParams.get('is_buy');

  

    React.useEffect(() => {
      async function fetchData() {
        try {
          //fetch stock price also
          const [stockIdsRes,walletBalanceRes, stockBalancesRes, stockPricesRes] =  await Promise.all([
            fetch("http://localhost:3001/trading/stocks"),
            fetch("http://localhost:3001/trading/wallet/1"),
            fetch("http://localhost:3001/trading/stock_balances/1"),
            fetch("http://localhost:3001/trading/fetch-prices")
          ]);

          if (!stockIdsRes.ok || !walletBalanceRes.ok || !stockBalancesRes.ok || !stockPricesRes.ok) {
            throw new Error("One of the requests failed");
          }

          const [stockIdJson, walletBalanceJson, stockBalancesJson, stockPricesJson] = await Promise.all([
            stockIdsRes.json(),
            walletBalanceRes.json(),
            stockBalancesRes.json(),
            stockPricesRes.json()
          ]);


          //stock
          
          if (stockIdJson.result) {
            const tmpList = []
            stockIdJson.result.map(obj => tmpList.push(obj.id))
            setStockIds(tmpList)
             //setStockId(stockIdJson.result[0].id)
            
            if (stockIdQuery) {
              setStockId(stockIdQuery)
            } else {
              setStockId(stockIdJson.result[0].id)
            }
              
            
          }

          //walletBalance
          if (walletBalanceJson.result) {
            console.log(walletBalanceJson.result.balance)
            setWalletBalance(Number(walletBalanceJson.result.balance))
          } 

          //stockBalances
          if (stockBalancesJson.result) {
            
            const tmpMap = {}

            stockBalancesJson.result.forEach(obj => {
              tmpMap[obj.stock_id] = Number(obj.net_units);
            })
            setStockBalances(tmpMap)
          } 

          const unit_stock_price = {AAPL: 1.00, TSLA: 1.50}
          setUnitStockPrices(unit_stock_price)

           if (stockPricesJson) {
            console.log(stockPricesJson.result)
            setUnitStockPrices(stockPricesJson.result)
          }

        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          
          if (isBuyQuery) {
            console.log(isBuyQuery)
            setIsBuy(Number(isBuyQuery))
          }
            
          setLoading(false);
        }
        
      }

      fetchData();

    },[])


    React.useEffect( () => {
      if (lastChanged==="units") {
        const tmp = Number.parseFloat(unitsOfStock * unitStockPrices[stockId]).toFixed(2)
        setTotalPrice(Number(tmp) ?? null)
      }
    }, [unitsOfStock,stockId, lastChanged])

    React.useEffect( () => {
      if (lastChanged==="total") {
        const tmp = Number.parseFloat(totalPrice / unitStockPrices[stockId]).toFixed(2)
      setUnitsOfStock(Number(tmp) ?? null)
      }
    }, [totalPrice,stockId, lastChanged])
    

    React.useEffect( () => {
      //console.log(totalPrice, walletBalance, totalPrice<=walletBalance, typeof totalPrice, typeof walletBalance)
      //console.log(unitsOfStock,stockBalances[stockId], unitsOfStock<=stockBalances[stockId],
      //  typeof unitsOfStock, typeof stockBalances[stockId])
      
      if (isBuy) {
        setIsValid(unitStockPrices[stockId] && (totalPrice<=walletBalance??false) && totalPrice>0 && unitsOfStock>0)
      } else {
        setIsValid(unitStockPrices[stockId] && (unitsOfStock<=stockBalances[stockId]??false) && totalPrice>0 && unitsOfStock>0)
      }
    },[totalPrice, unitsOfStock, stockId,isBuy])




  

    const handleSubmit = (e) => {
      e.preventDefault();
      setIsValid(false);
      setLoading(true);
      console.log(isValid,loading, )
      const base_url = "http://localhost:3001/trading/" + (isBuy ? "buy" : "sell");
      const init = { method: 'POST', accept: 'application/json', body: JSON.stringify({
        user_id: userId,
        stock_id: stockId,
        total_price: totalPrice,
        units_of_stock: unitsOfStock
      }) };
      /*

      console.log(init)

    
        fetch(`${base_url}`, init)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${response.message || 'Unknown error'}`);
              }
              return response.json()})
            .then(d => {
                alert(d);
            })
            .catch(err => {
              console.error("Fetch error:", err);
            })
            .finally(() => {
              setIsValid(true);
            })
              */

        axios.post(base_url, {
          user_id: userId,
          stock_id: stockId,
          total_price: totalPrice,
          units_of_stock: unitsOfStock
        }).then(d => {
                alert(d.data.message);
            })
            .catch(err => {
              console.error("Fetch error:", err);
            })
            .finally(() => {
              window.location.reload();
            })
    }


    return (
    <>
      <NavBar></NavBar>
      <Container>
      <br></br>
    <Form id="buy_sell_form">

              {/* Buy/Sell Toggle */}
              <Form.Label>Action</Form.Label>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <Button
                  className={isBuy ? "btn-buy0" : "btn-inactive"} // green when active
                  onClick={() => setIsBuy(1)}
                  style={{ flex: 1 }}
                >
                  Buy
                </Button>
                <Button
                  className={!isBuy ? "btn-sell0" : "btn-inactive"} // red when active
                  onClick={() => setIsBuy(0)}
                  style={{ flex: 1 }}
                >
                  Sell
                </Button>
              </div>

    

      <Form.Group className="mb-3" controlId="formStockId">
        <Form.Label>Stock</Form.Label>
        <Form.Select value={stockId} onChange={e => {console.log(e.target.value);setStockId(e.target.value)}}>
          {stockIds.map(sid => 
            <option value={sid}>{sid}</option>
          )}
        </Form.Select>
      </Form.Group>

      <fieldset disabled>
      <Form.Group className="mb-3" controlId="formUnitStockPrice">
        <Form.Label >Price per Unit</Form.Label>
        <InputGroup>
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control  placeholder={Number(unitStockPrices[stockId]).toFixed(2) ?? "ERROR"} />
        </InputGroup>
      </Form.Group>
      </fieldset>

      {isBuy === 1 && 
      <fieldset disabled>
      <Form.Group className="mb-3" controlId="formWalletBalance">
        <Form.Label >Wallet Balance</Form.Label>
        <InputGroup>
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control  placeholder={Number(walletBalance).toFixed(2)} />
        </InputGroup>
      </Form.Group>
      </fieldset>
      }


      {isBuy === 0 && 
      <fieldset disabled>
      <Form.Group className="mb-3" controlId="formWalletBalance">
        <Form.Label >Stock Balance in Units</Form.Label>
        <Form.Control  placeholder={stockBalances[stockId] ? Number(stockBalances[stockId]).toFixed(2) : '0.00'} />
      </Form.Group>
      </fieldset>
      }


    

      <Form.Group className="mb-3">
        <Form.Label >Units to {isBuy? "Buy" : "Sell (Transaction will be executed according to this number)"}</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          value={unitsOfStock}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-"].includes(e.key)) {
              e.preventDefault(); // block immediately
            }
          }}
          onInput={(e) => {
            const value = e.target.value;
            if (!/^\d+(\.\d{1,2})?$/.test(value) && value !== '') {
              e.target.value = value.slice(0, -1); // remove last char
            } 
            while (e.target.value.length > 1 && e.target.value[0]==='0'&& e.target.value[1] !=='.') {
              e.target.value = e.target.value.slice(1)
            } 
            setUnitsOfStock(Number(e.target.value));
            setLastChanged("units")
          }}
        />
      </Form.Group>


      <Form.Group className="mb-3">
      <Form.Label >Total Amount to {isBuy? "Buy (Transaction will be executed according to this number)" : "Sell"}</Form.Label>
        <InputGroup>
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control
          type="number"
          step="0.01"
          value={totalPrice}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-"].includes(e.key)) {
              e.preventDefault(); // block immediately
            }
          }}
          onInput={(e) => {
            const value = e.target.value;
            if (!/^\d+(\.\d{1,2})?$/.test(value) && value !== '') {
              e.target.value = value.slice(0, -1); // remove last char
            } 
            while (e.target.value.length > 1 && e.target.value[0]==='0' && e.target.value[1] !=='.') {
              e.target.value = e.target.value.slice(1)
            } 
            setTotalPrice(Number(e.target.value));
            setLastChanged("total")
          }}
          
        />
        </InputGroup>
      </Form.Group>


      {(!isValid && !loading )&& (unitsOfStock!==0 && totalPrice!==0) &&
        <p style={{ color: 'red' }}>
          Insufficient
          {isBuy ? " Wallet ": " Stock "}
          Balance, or invalid units of stock/amount of money
        </p> 
      }
      
      <Button
        className={isBuy ? "btn-buy" : "btn-sell"} // Apply dynamic class
        disabled={!isValid || loading}
        onClick={handleSubmit}
      >
        Confirm {isBuy ? "BUY" : "SELL"}
      </Button>

    </Form>
    </Container>
    </>
    );



}