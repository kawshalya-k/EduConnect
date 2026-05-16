import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sessions from './pages/Sessions';
import BookingConfirmed from './pages/BookingConfirmed';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Sessions />} />
        <Route path='/booking-confirmed' element={<BookingConfirmed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
