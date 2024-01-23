import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back one step in the history
  };

  return (
    <button className='back-btn' onClick={goBack}>
      <img src='assets/images/back-arrow.png' alt='Back arrow' />
      Back
    </button>
  );
};

export default BackButton;
