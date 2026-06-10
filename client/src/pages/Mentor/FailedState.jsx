import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/Layout/PageLayout';
import failureHero from '../../Assets/FailedStateImage.jpg';

import './FailedState.css';

const RETRY_HOURS = 24; // 24 hour cooldown

export default function VerificationFailed() {
  const navigate = useNavigate();
  // Countdown: start from 23:59:58 for demo
  const [timeLeft, setTimeLeft] = useState(RETRY_HOURS * 3600 - 2);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <PageLayout>
      <div className="failed-page">
        {/* Hero image */}
        <div className="failed-hero-image">
          <img src={failureHero} alt="Verification Failure Banner" />
        </div>

        <div className="failed-content">
          {/* Alert Icon */}
          <div className="failed-alert-icon">
            <span>!</span>
          </div>

          <h1 className="failed-title">Verification Failed</h1>
          <p className="failed-desc">
            Don't worry, it happens to the best of us. Take some time to review the materials and
            try again. Practice makes perfect!
          </p>

          {/* Countdown */}
          <div className="failed-countdown-box">
            <p className="countdown-label">RE-ATTEMPT AVAILABLE IN</p>
            <div className="countdown-timer">
              <div className="countdown-unit">
                <span className="countdown-num">{hours}</span>
                <span className="countdown-unit-label">HOURS</span>
              </div>
              <div className="countdown-unit">
                <span className="countdown-num">{minutes}</span>
                <span className="countdown-unit-label">MINUTES</span>
              </div>
              <div className="countdown-unit">
                <span className="countdown-num">{seconds}</span>
                <span className="countdown-unit-label">SECONDS</span>
              </div>
            </div>
          </div>

          <button className="review-materials-btn" onClick={() => navigate('/help')}>
            📚 Review Study Materials
          </button>

          <button className="visit-help-btn" onClick={() => navigate('/help')}>
            ❓ Visit Help Center
          </button>

          {/* Progress dots */}
          <div className="progress-dots">
            <span className="dot active" />
            <span className="dot active" />
            <span className="dot active" />
            <span className="dot error" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}