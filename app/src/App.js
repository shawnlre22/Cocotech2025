
import './App.css';
import { BuySellForm } from './pages/BuySellForm';
import { Wallet} from './pages/Wallet';
import TestApi from './pages/TestApi'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'


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
					<Route path="/trading" element={
						<>
							<p>
								Trading
							</p>
						</>
						} />
					<Route path="/wallet" element={<Wallet/>
						} />
					<Route path="/tradingform" element={<BuySellForm />
						} />
            
				</Routes>
      </BrowserRouter>
	

  )
}

export default App;
