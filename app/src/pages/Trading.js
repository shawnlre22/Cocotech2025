import NavBar from '../Components/NavBar';

import "../Components/DashboardSummary.css";
import Container from 'react-bootstrap/esm/Container';
import DashboardSummary from '../Components/DashboardSummary';
import ActiveTrades from '../Components/ActiveTrades';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./trading.css"


const Trading = () => {
  const trades = [
    { id: '1', asset: 'AAPL', quantity: 10, price: 150, status: 'Active', riskStatus: 'Low' },
    { id: '2', asset: 'TSLA', quantity: 5, price: 700, status: 'Active', riskStatus: 'High' },
    { id: '3', asset: 'AMZN', quantity: 2, price: 3200, status: 'Active', riskStatus: 'Medium' },
    { id: '4', asset: 'GOOGL', quantity: 4, price: 2800, status: 'Active', riskStatus: 'Low' },
    { id: '5', asset: 'MSFT', quantity: 8, price: 300, status: 'Active', riskStatus: 'Medium' },
    { id: '6', asset: 'NFLX', quantity: 3, price: 500, status: 'Active', riskStatus: 'High' },
]; //dummy trades


return (
<>
<NavBar></NavBar>
  <Container>
    <br></br>
    <h3>Trading Overview</h3>
    <div class="CardInfo">
      <div><DashboardSummary title="Total Portfolio Value" data="51000"></DashboardSummary></div>
      <div><DashboardSummary title="Total Invested Amount" data="45000"></DashboardSummary></div>
      <div><DashboardSummary title="Overall gain/loss" data="+6000"></DashboardSummary></div>
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
      </Col>
    </Row>
  </Container>
</>
)};
  
export default Trading;