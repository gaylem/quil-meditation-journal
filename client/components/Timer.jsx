import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaUndo } from 'react-icons/fa';
import useSound from 'use-sound';
import churchbell from '../../public/assets/churchbell.mp3';
import '../scss/timer.scss';

const Timer = () => {
  const zeroPad = (num, places) => String(num).padStart(places, '0');

  const startTime = 0;
  const [play] = useSound(churchbell);
  const [timerFinished, setTimerFinished] = useState(false);
  const [seconds, setSeconds] = useState(startTime);
  const [isActive, setIsActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedCountdown, setSelectedCountdown] = useState('');

  const toggle = () => {
    setIsActive(!isActive);
    setTimerFinished(false);
  };

  const reset = () => {
    setSeconds(startTime);
    setIsActive(false);
    setTimerFinished(false);
  };

  useEffect(() => {
    const playSound = () => {
      if (!timerFinished) {
        play();
        setTimerFinished(true);
      }
    };

    let interval = null;

    if (seconds <= 0) {
      setIsActive(false);
      playSound();
    }

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, timerFinished, play]);

  useEffect(() => {
    // Handle countdown separately
    if (isActive && selectedCountdown) {
      const countdownInSeconds = parseInt(selectedCountdown.replace('s', ''), 10);
      if (!isNaN(countdownInSeconds)) {
        setSeconds(countdownInSeconds);
      }
    }
  }, [isActive, selectedCountdown]);

  const handleCountdownChange = event => {
    const selectedValue = event.target.value;
    setSelectedCountdown(selectedValue);

    const parseCountdown = durationString => {
      const value = parseInt(durationString.replace('s', ''), 10);
      const valueInSeconds = isNaN(value) ? 0 : value;
      return valueInSeconds;
    };

    const countdownInSeconds = parseCountdown(selectedValue);
    setSeconds(countdownInSeconds);
  };

  const handleDurationChange = event => {
    const selectedValue = event.target.value;
    setSelectedDuration(selectedValue);

    const parseDuration = durationString => {
      const valueInMinutes = parseInt(durationString.replace('m', ''), 10);
      const valueInSeconds = isNaN(valueInMinutes) ? 0 : valueInMinutes * 60;
      return valueInSeconds;
    };

    // Convert the selected value (remove 'm') to seconds and set the timer
    const durationInSeconds = parseDuration(selectedValue);
    setSeconds(durationInSeconds);
  };

  return (
    <div className='Timer'>
      <div className='time'>
        <div className={`timer-circle ${isActive ? 'timer-circle-grow' : ''}`}>
          {Math.floor(seconds / 60)}:{zeroPad(seconds % 60, 2)}
        </div>
      </div>
      <p className='quote'>Let&apos;s begin.</p>
      <div className='time-dropdown'>
        <div className='countdown-container'>
          <input className='countdown-input' list='countdown-options' placeholder='Countdown' name='countdown' value={selectedCountdown} onChange={handleCountdownChange} />
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
        <div className='duration-container'>
          <input className='duration-input' list='duration-options' placeholder='Duration' name='duration' value={selectedDuration} onChange={handleDurationChange} />
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
      <div className='row'>
        <div className='circle-button-container'>
          <button className='circle-button button-primary-inactive' onClick={() => setSeconds(s => Math.max(0, s + 60))}>
            +1m
          </button>
          <button className='circle-button button-primary-inactive' onClick={() => setSeconds(s => Math.max(0.0, s - 60))}>
            -1m
          </button>
          <button
            className={`circle-button button-primary-${isActive ? 'active' : 'inactive'}`}
            onClick={() => {
              toggle();
              play();
            }}>
            {isActive ? <FaPause /> : <FaPlay />}
          </button>
          <button className='circle-button button-primary-inactive' onClick={reset}>
            <FaUndo />
          </button>
          <div />
        </div>
      </div>
    </div>
  );
};

export default Timer;
