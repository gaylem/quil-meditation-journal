//** TIMER COMPONENT */

import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useWakeLock } from 'react-screen-wake-lock';

// Import sound hook and audio file
import singingBowl from '../../public/assets/audio/singing-bowl.mp3';

// Icon images for play, pause, and reset buttons
import playImage from '../../public/assets/images/play-button.png';
import resetImage from '../../public/assets/images/reset-button.png';
import pauseImage from '../../public/assets/images/pause-button.png';
import VolumeSlider from './VolumeSlider.jsx';

// Initialize audio element
const audioElement = new Audio(singingBowl);
audioElement.setAttribute('playsinline', '');
audioElement.muted = true;

/**
 * Timer component for meditation sessions.
 *
 * @returns {JSX.Element} The rendered Meditation component.
 */
const Timer = () => {
  // State variables
  const [isActive, setActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [durationFinished, setDurationFinished] = useState(false);
  const [volume, setVolume] = useState(50); // Initial volume value

  // Function to stop the audio
  const stopAudio = () => {
    audioElement.currentTime = 0;
    audioElement.pause();
  };

  // Wake lock hook
  const { request, release } = useWakeLock({
    onRequest: () => console.log('Screen Wake Lock: requested!'),
    onError: () => console.log('An error happened 💥'),
    onRelease: () => console.log('Screen Wake Lock: released!'),
  });

  // If there is no user, stop the timer audio
  const { user } = useAuthContext();
  useEffect(() => {
    if (!user) {
      return () => {
        audioElement.pause();
      };
    }
  }, [user]);

  /**
   * Creates a closure to ensure the sound plays only once at the beginning and end.
   *
   * @returns {function(): number} A function that, when called, plays the sound once.
   */

  // useRef to track audio plays across renders
  let countRef = useRef(0);

  const playOnce = () => {
    return function () {
      if (countRef.current === 1) {
        return countRef.current;
      } else {
        // Check if the audio is paused, and initiate playback with user gesture
        audioElement.muted = false;
        audioElement.play();
        countRef.current++;
      }
    };
  };

  const playOnceBegin = playOnce();
  const playOnceEnd = playOnce();

  /**
   * Toggles the play/pause functionality of the timer.
   * If duration is zero, the timer is not activated, and the sound is not played.
   */
  const togglePlayPause = () => {
    if (!isActive && duration === 0) {
      // If either is zero, do not activate the timer and do not play the sound
      return;
    }
    // Set isActive to whatever the opposite of the current setting is
    setActive(!isActive);

    if (isActive) {
      // If it was paused, stop the sound
      audioElement.pause();
    } else {
      // If it was not active, request wake lock
      request();
    }
  };

  /**
   * Resets the timer to 0:00 and stops the sound when the user clicks the reset button.
   */
  const reset = () => {
    setActive(false);
    setDurationFinished(false);
    setDuration(0);
    const durationInput = document.querySelector('.duration-input');
    if (durationInput) durationInput.value = '';
    // Stop audio
    stopAudio();
    // Release wake lock
    release();
    // Reset timer count to 0
    countRef.current = 0;
  };

  /**
   * Effect hook to manage the duration intervals,
   * as well as handle the playOnceBegin and playOnceEnd functions.
   */
  useEffect(() => {
    let durationInterval;

    if (isActive && duration > 0) {
      playOnceBegin();
    }

    // Start the duration interval when reaches zero and duration is greater than zero
    if (isActive && duration > 0 && !durationFinished) {
      durationInterval = setInterval(() => {
        setDuration(prevDuration => prevDuration - 1);
      }, 1000);
    }

    if (isActive && duration === 0 && !durationFinished) {
      setDurationFinished(true);
      countRef.current = 0;
    }

    // Cleanup intervals when the component unmounts or dependencies change
    return () => {
      clearInterval(durationInterval);
    };
  }, [isActive, duration, durationFinished]);

  // Effect hook to handle the playOnceEnd function
  useEffect(() => {
    if (durationFinished) {
      playOnceEnd();
      release(); // Release wake lock
      setActive(false);
    }
  }, [durationFinished]);

  /**
   * Handles the duration change when the user selects or enters data into the duration datalist.
   *
   * @param {Event} event - The input event.
   */
  const handleDurationChange = event => {
    const selectedValue = event.target.value;
    const durationInSeconds = parseDuration(selectedValue);
    setDuration(durationInSeconds);
  };

  /**
   * Parses the duration input from the datalist to be compatible with the timer.
   *
   * @param {string} durationString - The string representing the duration of the meditation.
   * @returns {number} The parsed duration in seconds.
   */
  const parseDuration = durationString => {
    const valueInMinutes = parseInt(durationString.replace('m', ''), 10);
    return isNaN(valueInMinutes) ? 0 : valueInMinutes * 60;
  };

  /**
   * Formats the given time in seconds to a string representation in the format MM:SS.
   *
   * @param {number} time - The time in seconds to be formatted.
   * @returns {string} The formatted time string (MM:SS).
   */
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  /**
   * Main timer component
   *
   * @returns {JSX.Element} The rendered Timer component.
   */
  return (
    <div className='timer'>
      {/* Timer Display */}
      <div className='time'>
        <div className={`timer-circle ${isActive ? 'timer-circle-grow' : ''}`}>
          {/* Display duration based on the active state */}
          {formatTime(duration)}
        </div>
      </div>
      {/* Quote */}
      <h2 className='quote'>Let&apos;s begin.</h2>
      <div className='control-panel'>
        <div className='top-row'>
          {/* Time Dropdowns */}
          {/* Duration Input */}
          <div className='duration-container'>
            <label htmlFor='duration'>Duration:</label>
            <input className='duration-input' id='duration' list='duration-options' placeholder='Time in minutes' name='duration' onChange={handleDurationChange} />
            {/* Dropdown options for duration */}
            <datalist id='duration-options'>
              <option value='1 minute' />
              <option value='5 minutes' />
              <option value='10 minutes' />
              <option value='15 minutes' />
              <option value='20 minutes' />
              <option value='25 minutes' />
              <option value='30 minutes' />
              <option value='35 minutes' />
              <option value='40 minutes' />
              <option value='45 minutes' />
              <option value='60 minutes' />
              <option value='90 minutes' />
              <option value='120 minutes' />
            </datalist>
          </div>

          {/* Control Buttons */}
          <div className='circle-button-container'>
            {/* Play/Pause Button */}
            <button className={`circle-button button-primary-${isActive ? 'active' : 'inactive'}`} onClick={togglePlayPause}>
              <img src={isActive ? pauseImage : playImage} id='play-pause-btn' alt={isActive ? 'Pause' : 'Play'} />
            </button>
            {/* Reset Button */}
            <button className='circle-button' onClick={reset}>
              <img src={resetImage} alt='Reset' id='reset-btn' />
            </button>
          </div>
        </div>
        <div className='bottom-row'>
          <VolumeSlider audioElement={audioElement} volume={volume} setVolume={setVolume} />
        </div>
      </div>
    </div>
  );
};

export default Timer;
