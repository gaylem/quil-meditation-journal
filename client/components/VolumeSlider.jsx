import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/system';

// Style the Slider component
const StyledSlider = styled(Slider)`
  min-width: 100%;
  color: #fbeaeb;
`;

const VolumeSlider = ({ audioElement, volume, setVolume }) => {
  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioElement.volume = newValue / 100;
  };

  return (
    <div className='audio-slider'>
      {/* Use the StyledSlider component instead of Slider */}
      <img src='assets/images/volume-off.png' className='high' alt='Volume off icon' />
      <StyledSlider valueLabelDisplay='auto' value={volume} onChange={handleVolumeChange} aria-label='Volume Slider' />
      <img src='assets/images/volume-high.png' className='low' alt='Volume high icon' />
    </div>
  );
};

export default VolumeSlider;
