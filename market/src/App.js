import React from 'react'
import './styles/global.css'
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from './pages/home';
import NFT from './pages/NFT'
import SellNFT from './pages/create-item'
import Dashboard from './pages/creator-dashboard';
import ReSale from './pages/resell';
import MyNFT from './pages/my-nft';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
function App() {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nft" element={<NFT />} />
        <Route path="/create-item" element={<SellNFT />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resell" element={<ReSale />} /> 
        <Route path="/mynft" element={<MyNFT />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
