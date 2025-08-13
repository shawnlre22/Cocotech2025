
import './App.css';
import { BuySellForm } from './pages/BuySellForm';
import TestApi from './pages/TestApi'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Trading from './pages/Trading';
import Wallet from './pages/Wallet';

import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />}></Route>
					<Route path="/trading" element={<Trading />}></Route>
					<Route path="/wallet" element={<Wallet />}></Route>

					<Route path="/buysell" element={<BuySellForm />}></Route>

				
            

				</Routes>
    </BrowserRouter>
	

  )
}

export default App;
