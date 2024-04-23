import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Cryptocurrencies from "./Components/Cryptocurrencies";
import "./App.css";
import Header from "./Components/Header";
import Favourite from "./Components/Favourite";
import CryptoDetails from "./Components/CryptoDetails";
import { Footer } from "./Components/Footer";
import { useAuth } from "./hooks/useAuth";
import { Orders } from "./Components/Orders";
import Wallet from "./Components/Wallet";
import About from './Components/About'
import Transactions from "./Components/Transactions";

function App() {
  useAuth();

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/favourite" element={<Favourite />} />
        <Route path="/:id" element={<CryptoDetails />} />
        <Route path="/new" element={<Cryptocurrencies />} />
        <Route path="/about" element={<About />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;