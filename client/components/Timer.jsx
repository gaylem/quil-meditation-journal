import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaUndo, FaMusic } from 'react-icons/fa';
import useSound from 'use-sound';
import churchbell from '../../public/assets/churchbell.wav';
import '../scss/timer.scss';

// import churchbell from './static/audio/bells.wav';

const Timer = () => {
  const zeroPad = (num, places) => String(num).padStart(places, '0');

  const startTime = 300;
  const [play] = useSound(churchbell);
  const [timerFinished, setTimerFinished] = useState(false);
  const [seconds, setSeconds] = useState(startTime);
  const [isActive, setIsActive] = useState(false);

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

  return (
    <div className='Timer'>
      <div className='time'>
        <div className={`timer-circle ${isActive ? 'timer-circle-grow' : ''}`}>
          {Math.floor(seconds / 60)}:{zeroPad(seconds % 60, 2)}
        </div>
      </div>
      <p className='quote'>Let&apos;s begin.</p>
      <div className='row'>
        <div className='duration-container'>
          <input className='duration-input' list='options' placeholder='Set Time' name='duration' />
          <datalist id='options'>
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
          {/* // 'pause' : 'start'} */}
        </button>
        <button className='circle-button button-primary-inactive' onClick={reset}>
          <FaUndo />
          {/* reset */}
        </button>
        <div />
      </div>
    </div>
  );
};

export default Timer;
