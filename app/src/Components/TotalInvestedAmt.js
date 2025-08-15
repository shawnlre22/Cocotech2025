import React from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer} from 'recharts';
import './TotalInvestedAmt.css';

export const TotalInvestedAmt = ({data}) => {

    let data1 = JSON.parse(JSON.stringify(data));
    console.log("HI1:",data, data.slice(-5))
    for (let i=1; i<data1.length; i++) {
        data1[i].total_invested_amt = Number(Number(data1[i].total_invested_amt) + Number(data1[i-1].total_invested_amt)).toFixed(2)
    }
    console.log("HI2:",data1, data1.slice(-5))

    const dummyData = data1.slice(-5)
    let yr = 2020
    dummyData.forEach(d => {
        d.txn_minute = yr
        yr += 1
    })

    return (
         <div className="asset-location-chart">
                  <ResponsiveContainer width="100%" height={350}>
        <LineChart width={730} height={250} data={data1.slice(-5)}
  >
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="txn_minute" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="linear" dataKey="total_invested_amt" stroke="#8884d8" name="Invested Amount"/>

 
</LineChart>
</ResponsiveContainer>
        </div>
    )
}