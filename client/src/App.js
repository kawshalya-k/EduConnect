import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SessionBooking from './pages/Sessions/SessionBooking';
import BookingConfirmed from './pages/Sessions/BookingConfirmed';
import SessionFeedback from './pages/Sessions/SessionFeedback';
import MySessions from './pages/Sessions/MySessions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SessionBooking />} />
        <Route path='/booking-confirmed' element={<BookingConfirmed />} />
        <Route path='/session-feedback' element={<SessionFeedback />} />
        <Route path='/my-sessions' element={<MySessions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
