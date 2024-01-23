import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/system';

// Style the Slider component
const StyledSlider = styled(Slider)`
  min-width: 100%;
  color: #fbeaeb;
  box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,bottom 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
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
      <StyledSlider valueLabelDisplay='auto' value={volume} onChange={handleVolumeChange} aria-labelledby='continuous-slider' />
      <img src='assets/images/volume-high.png' className='low' alt='Volume high icon' />
    </div>
  );
};

export default VolumeSlider;
