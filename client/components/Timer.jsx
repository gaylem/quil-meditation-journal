import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import churchbell from '../../public/assets/churchbell.mp3';
import '../scss/timer.scss';
import playImage from '../../public/assets/play-button.png';
import replayImage from '../../public/assets/replay-button.png';
import pauseImage from '../../public/assets/pause-button.png';

const Timer = () => {
  const [countdown, setCountdown] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isActive, setActive] = useState(false);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const [durationFinished, setDurationFinished] = useState(false);
  const [play] = useSound(churchbell);

  const togglePlayPause = () => {
    setActive(!isActive);
  };

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
  };

  useEffect(() => {
    let countdownInterval;
    let durationInterval;

    if (isActive && countdown > 0 && duration > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }

    if (isActive && countdown === 0 && !countdownFinished) {
      setCountdownFinished(true);
      play();
      clearInterval(countdownInterval);
    }

    if (isActive && countdown === 0 && duration > 0 && !durationFinished && countdownFinished) {
      durationInterval = setInterval(() => {
        setDuration(prevDuration => prevDuration - 1);
      }, 1000);
    }

    if (isActive && countdown === 0 && duration === 0 && !durationFinished && countdownFinished) {
      setDurationFinished(true);
      play();
      clearInterval(countdownInterval);
      clearInterval(durationInterval);
      setActive(false);
    }

    return () => {
      clearInterval(countdownInterval);
      clearInterval(durationInterval);
    };
  }, [isActive, countdown, duration, countdownFinished, durationFinished]);

  const handleCountdownChange = event => {
    const selectedValue = event.target.value;
    const countdownInSeconds = parseCountdown(selectedValue);
    setCountdown(countdownInSeconds);
  };

  const handleDurationChange = event => {
    const selectedValue = event.target.value;
    const durationInSeconds = parseDuration(selectedValue);
    setDuration(durationInSeconds);
  };

  const parseCountdown = durationString => {
    const value = parseInt(durationString.replace('s', ''), 10);
    return isNaN(value) ? 0 : value;
  };

  const parseDuration = durationString => {
    const valueInMinutes = parseInt(durationString.replace('m', ''), 10);
    return isNaN(valueInMinutes) ? 0 : valueInMinutes * 60;
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='Timer'>
      <div className='time'>
        <div className={`timer-circle ${isActive ? 'timer-circle-grow' : ''}`}>{countdown ? formatTime(countdown) : formatTime(duration)}</div>
      </div>
      <p className='quote'>Let&apos;s begin.</p>
      <div className='time-dropdown'>
        <div className='countdown-container'>
          <input className='countdown-input' list='countdown-options' placeholder='Countdown' name='countdown' onChange={handleCountdownChange} />
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
          <input className='duration-input' list='duration-options' placeholder='Duration' name='duration' onChange={handleDurationChange} />
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
      <div className='circle-button-container'>
        {/* <button className='circle-button button-primary-inactive' onClick={() => setSeconds(s => Math.max(0, s + 60))}>
              +1m
            </button>
            <button className='circle-button button-primary-inactive' onClick={() => setSeconds(s => Math.max(0.0, s - 60))}>
              -1m
            </button>*/}
        <button className={`circle-button button-primary-${isActive ? 'active' : 'inactive'}`} onClick={togglePlayPause}>
          <img src={isActive ? pauseImage : playImage} id='play-pause-btn' alt={isActive ? 'Pause' : 'Play'} />
        </button>
        <button className='circle-button button-primary-inactive' onClick={reset}>
          <img src={replayImage} alt='Replay' id='replay-btn' />
        </button>
        <div />
      </div>
    </div>
  );
};

export default Timer;
