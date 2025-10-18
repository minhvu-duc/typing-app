import React, { useState, useEffect, useRef } from 'react';
import { words as wordList } from '../words';
import { cn } from '../lib/utils';

const Typing = () => {
  const [words, setWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState('waiting'); // waiting, running, finished
  const [results, setResults] = useState({ wpm: 0, accuracy: 0 });
  const [correctWords, setCorrectWords] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    generateWords();
  }, []);

  useEffect(() => {
    if (status === 'running') {
      inputRef.current.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0) {
      endTest();
    }
  }, [status, timeLeft]);

  const generateWords = () => {
    const randomWords = [...wordList].sort(() => Math.random() - 0.5).slice(0, 50);
    setWords(randomWords);
  };

  const startTest = () => {
    setStatus('running');
    setTimeLeft(60);
    setCurrentWordIndex(0);
    setInputValue('');
    setCorrectWords([]);
    setIncorrectWords([]);
    generateWords();
  };

  const endTest = () => {
    setStatus('finished');
    const wpm = correctWords.length;
    const accuracy = Math.round((correctWords.length / (correctWords.length + incorrectWords.length)) * 100) || 0;
    setResults({ wpm, accuracy });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 32) { // Spacebar
      e.preventDefault();
      const wordToCompare = words[currentWordIndex];
      const typedWord = inputValue.trim();

      if (typedWord === wordToCompare) {
        setCorrectWords([...correctWords, currentWordIndex]);
      } else {
        setIncorrectWords([...incorrectWords, currentWordIndex]);
      }

      if (currentWordIndex === words.length - 1) {
        endTest();
      } else {
        setCurrentWordIndex(currentWordIndex + 1);
        setInputValue('');
      }
    }
  };

  const getWordClass = (wordIndex) => {
    const isCurrent = wordIndex === currentWordIndex;
    const isCorrect = correctWords.includes(wordIndex);
    const isIncorrect = incorrectWords.includes(wordIndex);
    const isTyped = inputValue.length > 0 && isCurrent;

    let currentWordClassName = '';
    if (isTyped) {
      if (words[currentWordIndex].startsWith(inputValue.trim())) {
        currentWordClassName = 'text-green-500';
      } else {
        currentWordClassName = 'text-red-500';
      }
    }

    return cn(
      'word',
      {
        'bg-yellow-200': isCurrent,
        'text-green-600': isCorrect,
        'text-red-600': isIncorrect,
      },
      isCurrent ? currentWordClassName : ''
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-4xl font-bold text-center">Typing Speed Test</h1>
        {status === 'finished' && (
          <div className="mb-4 text-center">
            <h2 className="text-2xl">Results</h2>
            <p>WPM: {results.wpm}</p>
            <p>Accuracy: {results.accuracy}%</p>
          </div>
        )}
        <div className="p-4 mb-4 text-2xl leading-relaxed border rounded-md bg-gray-50">
          {words.map((word, index) => (
            <span key={index} className={getWordClass(index)}>
              {word}{' '}
            </span>
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={status !== 'running'}
          className="w-full p-2 text-xl border rounded-md"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="text-xl">Time left: {timeLeft}s</div>
          <button
            onClick={startTest}
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700"
          >
            {status === 'running' ? 'Restart' : 'Start Test'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Typing;
