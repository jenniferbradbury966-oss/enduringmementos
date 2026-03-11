import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Interview from './pages/Interview';
import Memorial from './pages/Memorial';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/memorial" element={<Memorial />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
