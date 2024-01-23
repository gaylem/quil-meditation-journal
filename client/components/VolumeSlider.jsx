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

  const handleSliderChange = () => {
    // When the slider is clicked or touched, unmute and play audio
    audioElement.muted = false;
    audioElement.play().catch(error => {
      // Handle autoplay error, if needed
      console.error('Autoplay error:', error);
    })
  };

  return (
    <div className='audio-slider'>
      {/* Use the StyledSlider component instead of Slider */}
      <img src='assets/images/volume-off.png' className='high' alt='Volume off icon' />
      <StyledSlider valueLabelDisplay='auto' value={volume} onChange={handleVolumeChange} onMouseDown={handleSliderChange} onTouchStart={handleSliderChange} aria-label='Volume Slider' />
      <img src='assets/images/volume-high.png' className='low' alt='Volume high icon' />
    </div>
  );
};

export default VolumeSlider;
