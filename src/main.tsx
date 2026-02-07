import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './routes/Home';
import Proposal from './routes/Proposal';
import Letter from './routes/Letter';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="proposal" element={<Proposal />} />
        <Route path="letter" element={<Letter />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
