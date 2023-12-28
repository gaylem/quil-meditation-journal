//** TIMER COMPONENT */

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useWakeLock } from 'react-screen-wake-lock';

// Import sound hook and audio file
import useSound from 'use-sound';
import singingBowl from '../../public/assets/audio/singing-bowl.mp3';

// Icon Images for play, pause, and reset buttons
import playImage from '../../public/assets/images/play-button.png';
import resetImage from '../../public/assets/images/reset-button.png';
import pauseImage from '../../public/assets/images/pause-button.png';

/**
 * Timer component for meditation sessions.
 *
 * @returns {JSX.Element} The rendered Meditation component.
 */
const Timer = () => {
  // State variables
  const [countdown, setCountdown] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isActive, setActive] = useState(false);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const [durationFinished, setDurationFinished] = useState(false);
  const [play, { stop }] = useSound(singingBowl);

  // Wake lock hook
  const { request, release } = useWakeLock({
    onRequest: () => console.log('Screen Wake Lock: requested!'),
    onError: () => console.log('An error happened 💥'),
    onRelease: () => console.log('Screen Wake Lock: released!'),
  });

  // If there is no user, stop the timer audio
  const { user } = useAuthContext();
  useEffect(() => {
    return () => {
      stop();
    };
  }, [user, stop]);

  /**
   * Creates a closure to ensure the sound plays only once at the beginning and end.
   *
   * @returns {function(): number} A function that, when called, plays the sound once.
   */
  const playOnce = () => {
    let count = 0;

    return function () {
      if (count === 1) {
        return count;
      } else {
        play();
        count++;
      }
    };
  };

  const playOnceBegin = playOnce();
  const playOnceEnd = playOnce();

  /**
   * Toggles the play/pause functionality of the timer.
   * If either countdown or duration is zero, the timer is not activated, and the sound is not played.
   */
  const togglePlayPause = () => {
    if (countdown === 0 && duration === 0) {
      // If either is zero, do not activate the timer and do not play the sound
      return;
    }

    // Set isActive to whatever the opposite of the current setting is
    setActive(!isActive);

    if (isActive) {
      // If it was paused, stop the sound
      stop();
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
    setCountdownFinished(false);
    setDurationFinished(false);
    setCountdown(0);
    setDuration(0);
    const countdownInput = document.querySelector('.countdown-input');
    const durationInput = document.querySelector('.duration-input');
    if (countdownInput) countdownInput.value = '';
    if (durationInput) durationInput.value = '';
    // Stop audio
    stop();
    // Release wake lock
    release();
  };

  /**
   * Effect hook to manage the countdown and duration intervals,
   * as well as handle the playOnceBegin and playOnceEnd functions.
   */
  useEffect(() => {
    let countdownInterval;
    let durationInterval;

    // Start the countdown interval when both countdown and duration are greater than zero
    if (isActive && countdown > 0 && duration > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }

    // Handle the end of countdown and trigger the sound once
    if (isActive && countdown === 0 && !countdownFinished) {
      setCountdownFinished(true);
      playOnceBegin();
      clearInterval(countdownInterval);
    }

    // Start the duration interval when countdown reaches zero and duration is greater than zero
    if (isActive && countdown === 0 && duration > 0 && !durationFinished && countdownFinished) {
      durationInterval = setInterval(() => {
        setDuration(prevDuration => prevDuration - 1);
      }, 1000);
    }

    // Handle the end of duration and trigger the sound once
    if (isActive && countdown === 0 && duration === 0 && !durationFinished && countdownFinished) {
      setDurationFinished(true);
      playOnceEnd();
      release(); // Release wake lock
      clearInterval(countdownInterval);
      clearInterval(durationInterval);
      setActive(false);
    }

    // Cleanup intervals when the component unmounts or dependencies change
    return () => {
      clearInterval(countdownInterval);
      clearInterval(durationInterval);
    };
  }, [isActive, countdown, duration, countdownFinished, durationFinished]);

  /**
   * Handles the countdown change when the user selects or enters data into the countdown datalist.
   *
   * @param {Event} event - The input event.
   */
  const handleCountdownChange = event => {
    const selectedValue = event.target.value;
    const countdownInSeconds = parseCountdown(selectedValue);
    setCountdown(countdownInSeconds);
  };

  /**
   * Parses the countdown input from the datalist to be compatible with the timer.
   *
   * @param {string} durationString - The string representing the countdown duration.
   * @returns {number} The parsed countdown duration in seconds.
   */
  const parseCountdown = durationString => {
    const value = parseInt(durationString.replace('s', ''), 10);
    return isNaN(value) ? 0 : value;
  };

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
          {/* Display either countdown or duration based on the active state */}
          {countdown ? formatTime(countdown) : formatTime(duration)}
        </div>
      </div>
      {/* Quote */}
      <h2 className='quote'>Let&apos;s begin.</h2>
      <div className='control-panel'>
        {/* Time Dropdowns */}
        <div className='time-dropdown'>
          {/* Countdown Input */}
          <div className='countdown-container'>
            <label htmlFor='countdown'>Countdown:</label>
            <input className='countdown-input' id='countdown' list='countdown-options' placeholder='Time in seconds' name='countdown' onChange={handleCountdownChange} />
            {/* Dropdown options for countdown */}
            <datalist id='countdown-options'>
              <option value='5s' />
              <option value='10s' />
              <option value='15s' />
              <option value='20s' />
              <option value='25s' />
              <option value='30s' />
              <option value='45s' />
              <option value='60s' />
            </datalist>
          </div>
          {/* Duration Input */}
          <div className='duration-container'>
            <label htmlFor='duration'>Duration:</label>
            <input className='duration-input' id='duration' list='duration-options' placeholder='Time in minutes' name='duration' onChange={handleDurationChange} />
            {/* Dropdown options for duration */}
            <datalist id='duration-options'>
              <option value='1m' />
              <option value='5m' />
              <option value='10m' />
              <option value='15m' />
              <option value='20m' />
              <option value='25m' />
              <option value='30m' />
              <option value='35m' />
              <option value='40m' />
              <option value='45m' />
              <option value='60m' />
              <option value='90m' />
              <option value='120m' />
            </datalist>
          </div>
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
    </div>
  );
};

export default Timer;
