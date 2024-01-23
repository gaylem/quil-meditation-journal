import React, { useRef, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/system';
import Hammer from 'hammerjs';

const StyledSlider = styled(Slider)`
  min-width: 100%;
  color: #fbeaeb;
`;

const VolumeSlider = ({ audioElement, volume, setVolume }) => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const sliderElement = sliderRef.current;

    const hammer = new Hammer(sliderElement);

    hammer.on('panstart', event => {
      const touchPercentage = (event.center.x - sliderElement.getBoundingClientRect().left) / sliderElement.clientWidth;
      const newVolume = Math.min(100, Math.max(0, Math.round(touchPercentage * 100)));

      setVolume(newVolume);
      audioElement.volume = newVolume / 100;
    });

    return () => {
      hammer.destroy();
    };
  }, [audioElement, setVolume]);

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioElement.volume = newValue / 100;
  };

  return (
    <div className='audio-slider'>
      <img src='assets/images/volume-off.png' className='high' alt='Volume off icon' />
      <StyledSlider ref={sliderRef} valueLabelDisplay='auto' value={volume} onChange={handleVolumeChange} aria-label='Volume Slider' />
      <img src='assets/images/volume-high.png' className='low' alt='Volume high icon' />
    </div>
  );
};

export default VolumeSlider;
