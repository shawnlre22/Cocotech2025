import React from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer} from 'recharts';
import './TotalInvestedAmt.css';

export const TotalInvestedAmt = ({data}) => {


    for (let i=1; i<data.length; i++) {
        data[i].total_invested_amt = Number(Number(data[i].total_invested_amt) + Number(data[i-1].total_invested_amt)).toFixed(2)
    }

    const dummyData = data.slice(-5)
    let yr = 2020
    dummyData.forEach(d => {
        d.txn_minute = yr
        yr += 1
    })

    return (
         <div className="asset-location-chart">
                  <ResponsiveContainer width="100%" height={350}>
        <LineChart width={730} height={250} data={data.slice(-5)}
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