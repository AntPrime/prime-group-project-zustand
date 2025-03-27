import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessPage.css';

function SuccessPage({ message, redirectTo, delay = 2000 }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo);
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, redirectTo, delay]);

  return (
    <div className="success-page">
      <div className="success-content">
        <div className="success-icon">✓</div>
        <h2 className="success-message">{message}</h2>
        <p className="success-redirect">Redirecting...</p>
      </div>
    </div>
  );
}

export default SuccessPage;