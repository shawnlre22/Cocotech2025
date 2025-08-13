import NavBar from '../Components/NavBar';

import "../Components/DashboardSummary.css";
import Container from 'react-bootstrap/esm/Container';
import DashboardSummary from '../Components/DashboardSummary';
import ActiveTrades from '../Components/ActiveTrades';
import AssetLocation from '../Components/AssetLocation';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./trading.css"
import Trading from './Trading'



  
export default function Home() {
  return (
    <Trading></Trading>
  )
};
