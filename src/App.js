import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './App.scss';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [breakOn, setBreakOn] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft === 0) {
            const audioElement = document.getElementById('beep');
            if (audioElement) {
              audioElement.play();
            }
            if (breakOn) {
              setBreakOn(false);
              return sessionLength * 60;
            } else {
              setBreakOn(true);
              return breakLength * 60;
            }
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, breakOn, sessionLength, breakLength]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const incrementHandler = (e) => {
    if (e.target.name === 'breakLength' && breakLength < 60) {
      setBreakLength(breakLength + 1);
    } else if (e.target.name === 'sessionLength' && sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const decrementHandler = (e) => {
    if (e.target.name === 'breakLength' && breakLength > 1) {
      setBreakLength(breakLength - 1);
    } else if (e.target.name === 'sessionLength' && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const startpauseHandler = () => {
    setIsRunning(!isRunning);
  };

  const resetHandler = () => {
    setIsRunning(false);
    setBreakOn(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    const beep = document.getElementById('beep');
    beep.pause();
    beep.currentTime = 0;
  };

  return (
    <div className='container'>
      <h1>25+5 Clock</h1>
      <div className='setTime-container'>
        <div className='break-container'>
          <p id="break-label">Break length</p>
          <div className='break-buttons'>
            <button id='break-decrement' name='breakLength' onClick={decrementHandler}>
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
            <p id="break-length" className='length'>{breakLength}</p>
            <button id='break-increment' name='breakLength' onClick={incrementHandler}>
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          </div>

        </div>
        <div className='session-container'>
          <p id="session-label">Session length</p>
          <div className='session-buttons'>
            <button id='session-decrement' name='sessionLength' onClick={decrementHandler}>
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
            <p id="session-length" className='length'>{sessionLength}</p>
            <button id='session-increment' name='sessionLength' onClick={incrementHandler}>
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
            </div>
        </div>
      </div>
      <div className='main-container'>
        <p id="timer-label">{breakOn ? "Break" : "Session"}</p>
        <p id="time-left">{formatTime(timeLeft)}</p>
        <div className='main-buttons'>
        <button id="start_stop" onClick={startpauseHandler}>Start/Stop</button>
        <button id="reset" onClick={resetHandler}>Reset</button>
        </div>
        
      </div>
      <audio id="beep" src="https://audio.jukehost.co.uk/FsLde7xtvbS7hIr1DqL4bhyLGQLBDktM"></audio>
    </div>
  );
}

export default App;