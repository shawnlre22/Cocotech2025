
import './App.css';
import { BuySellForm } from './pages/BuySellForm';
import { Wallet} from './pages/Wallet';
import TestApi from './pages/TestApi'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import 'bootstrap/dist/css/bootstrap.min.css'

=======
import Trading from './pages/Trading';
import Wallet from './pages/Wallet';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
>>>>>>> 737b61239dedd9e871231657f9a199ad2a2ecb2b

function App() {
  return (
    <BrowserRouter>
				<Routes>
<<<<<<< HEAD
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
=======
					<Route path="/" element={<Home />}></Route>
					<Route path="/trading" element={<Trading />}></Route>
					<Route path="/wallet" element={<Wallet />}></Route>
>>>>>>> 737b61239dedd9e871231657f9a199ad2a2ecb2b
					<Route path="/tradingform" element={<BuySellForm />
						} />
            

				</Routes>
    </BrowserRouter>
	

  )
}

export default App;
