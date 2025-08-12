import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Trading from './pages/Trading';
import Wallet from './pages/Wallet';

function App() {
  return (
    <BrowserRouter>
				<Routes>
					<Route path="/" element={
						<>
							<p>
								Home
							</p>

						</>
						}></Route>
					<Route path="/trading" element={<Trading />}></Route>
					<Route path="/wallet" element={<Wallet />}></Route>
				</Routes>
      </BrowserRouter>
	

  )
}

export default App;
