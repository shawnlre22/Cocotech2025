import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from "react-bootstrap/InputGroup";
import axios from 'axios'

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
            setStockId(stockIdJson.result[0].id)
            
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
            console.log(tmpMap)
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
        setIsValid(unitStockPrices[stockId] && (totalPrice<=walletBalance??false))
      } else {
        setIsValid(unitStockPrices[stockId] && (unitsOfStock<=stockBalances[stockId]??false))
      }
    },[totalPrice, unitsOfStock, stockId,isBuy])




  

    const handleSubmit = (e) => {
      e.preventDefault();
      setIsValid(false);
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
    <Form id="buy_sell_form">
      <Form.Group className="mb-3" controlId="formIsBuySell">
        <Form.Label>Buy or Sell</Form.Label>
        <Form.Select aria-label="Default select example" value={isBuy}
        onChange={ e => {console.log(e.target.value);setIsBuy(Number(e.target.value))}}>
          <option value="1">Buy</option>
          <option value="0">Sell</option>
        </Form.Select>
      </Form.Group>

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
        <Form.Label >Unit Stock Price</Form.Label>
        <InputGroup>
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control  placeholder={unitStockPrices[stockId] ?? "ERROR"} />
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
        <Form.Label >Units of stocks to {isBuy? "BUY" : "SELL (Transaction will be executed according to this number)"}</Form.Label>
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
            while (e.target.value.length > 1 && e.target.value[0]==='0') {
              e.target.value = e.target.value.slice(1)
            } 
            setUnitsOfStock(Number(e.target.value));
            setLastChanged("units")
          }}
        />
      </Form.Group>


      <Form.Group className="mb-3">
      <Form.Label >Total Amount of Money to {isBuy? "BUY (Transaction will be executed according to this number)" : "SELL"}</Form.Label>
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
            while (e.target.value.length > 1 && e.target.value[0]==='0') {
              e.target.value = e.target.value.slice(1)
            } 
            setTotalPrice(Number(e.target.value));
            setLastChanged("total")
          }}
          
        />
        </InputGroup>
      </Form.Group>

      {!isValid &&
        <p style={{ color: 'red' }}>
          Insufficient
          {isBuy ? " Wallet ": " Stock "}
          Balance, or invalid unit stock price
        </p> 
      }
      
      <Button disabled={!isValid}
      onClick={handleSubmit}
      
      >{isBuy ? "BUY" : "SELL"}</Button>

    </Form>


    );



}