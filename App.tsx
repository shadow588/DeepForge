import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Lab from './pages/Lab';
import Demo from './pages/Demo';
import Solutions from './pages/Solutions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="solutions" element={<Solutions />} />
          <Route path="chat" element={<Lab />} />
          <Route path="demo" element={<Demo />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;