import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


export const BuySellForm = () => {

    const [isBuy, setIsBuy] = useState(1) //1:buy 0:sell
    
    const userId = 1;

    //form fields
    const [stockId, setStockId] = useState('')
    const [unitStockPrice, setUnitStockPrice] = useState(0);
    const [unitsOfStock, setUnitsOfStock] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    //for ddl
    const [stockIds, setStockIds] = useState([])

    React.useEffect(() => {
		fetch("http://localhost:3001/trading/stocks")
			.then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
			.then((data) => {
        const tmpList = []
				if (data.result) {
          data.result.map(obj => tmpList.push(obj.id))
          setStockIds(tmpList)
          setStockId(data.result[0].id)
        }
			}).catch((err) => {
        console.error("Fetch error:", err);
      })
	  }, []);
    

    //{isBuy === 1 && walletbalance}
    //  {isBuy === 0 && stockbalance}
    //  {stockPrice}
      
    return (
    <Form id="buy_sell_form">
      <Form.Group className="mb-3" controlId="formIsBuySell">
        <Form.Label>Buy or Sell</Form.Label>
        <Form.Select aria-label="Default select example" value={isBuy}
        onChange={ e => {console.log(e.target.value);setIsBuy(e.target.value)}}>
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

      <Form.Group>
        <Form.Control type="number" onKeyDown={ (evt) => {
          console.log(evt.target.value)
          return (evt.key === 'e' && evt.preventDefault())
         } } />
      </Form.Group>

      

      
      

    </Form>


    );



}