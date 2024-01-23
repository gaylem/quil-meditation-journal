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

    // Initialize Hammer.js on the slider element
    const hammer = new Hammer(sliderElement);

    // Handle the pan event (similar to touchstart)
    hammer.on('panstart', event => {
      const touchPercentage = (event.center.x - sliderElement.getBoundingClientRect().left) / sliderElement.clientWidth;
      const newVolume = Math.min(100, Math.max(0, Math.round(touchPercentage * 100)));

      setVolume(newVolume);
      audioElement.volume = newVolume / 100;
    });

    // Clean up Hammer.js on component unmount
    return () => {
      hammer.destroy();
    };
  }, [audioElement, setVolume]);

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioElement.volume = newValue / 100;
  };

  return (
    <div className='audio-slider' ref={sliderRef}>
      <img src='assets/images/volume-off.png' className='high' alt='Volume off icon' />
      <StyledSlider valueLabelDisplay='auto' value={volume} onChange={handleVolumeChange} aria-label='Volume Slider' />
      <img src='assets/images/volume-high.png' className='low' alt='Volume high icon' />
    </div>
  );
};

export default VolumeSlider;

// import React, { useState } from 'react';
// import Slider from '@mui/material/Slider';
// import { styled } from '@mui/system';

// // Style the Slider component
// const StyledSlider = styled(Slider)`
//   min-width: 100%;
//   color: #fbeaeb;
// `;

// const VolumeSlider = ({ audioElement, volume, setVolume }) => {
//   const handleVolumeChange = (event, newValue) => {
//     setVolume(newValue);
//     audioElement.volume = newValue / 100;
//   };

//   const handleMouseDown = () => {
//     // When the slider is clicked, update the volume
//     const newVolume = volume; // Use the existing volume
//     audioElement.volume = newVolume / 100;
//   };

//   const handleTouchStart = event => {
//     // Calculate the percentage of the slider where the touch occurred
//     const touchPercentage = (event.touches[0].clientX - event.currentTarget.getBoundingClientRect().left) / event.currentTarget.clientWidth;

//     // Calculate the new volume based on the touch percentage
//     const newVolume = Math.min(100, Math.max(0, Math.round(touchPercentage * 100)));

//     // Update the volume state and audio element
//     setVolume(newVolume);
//     audioElement.volume = newVolume / 100;

//     // Prevent default behavior to avoid unintended actions on touch
//     event.preventDefault();
//   };

//   return (
//     <div className='audio-slider'>
//       {/* Use the StyledSlider component instead of Slider */}
//       <img src='assets/images/volume-off.png' className='high' alt='Volume off icon' />
//       <StyledSlider valueLabelDisplay='auto' value={volume} onChange={handleVolumeChange} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} aria-label='Volume Slider' />
//       <img src='assets/images/volume-high.png' className='low' alt='Volume high icon' />
//     </div>
//   );
// };

// export default VolumeSlider;
