import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);

  // Kusa nitong i-di-display ang Tailwind CSS para lumabas ang kulay at hugis
  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }, []);

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const deleteLastChar = () => {
    if (waitingForOperand) return;
    if (display.length === 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      const result = calculate(currentValue, inputValue, operation);

      if (result === 'Error') {
        setDisplay('Error');
        setPrevValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        return;
      }

      setPrevValue(result);
      setDisplay(String(result));
      setHistory(prev => [`${currentValue} ${operation} ${inputValue} = ${result}`, ...prev.slice(0, 3)]);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (first, second, op) => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '×': return first * second;
      case '÷': 
        if (second === 0) return 'Error';
        return parseFloat((first / second).toFixed(8));
      default: return second;
    }
  };

  const handleEquals = () => {
    if (!operation || prevValue === null) return;
    const inputValue = parseFloat(display);
    const result = calculate(prevValue, inputValue, operation);

    if (result === 'Error') {
      setDisplay('Error');
    } else {
      setDisplay(String(result));
      setHistory(prev => [`${prevValue} ${operation} ${inputValue} = ${result}`, ...prev.slice(0, 3)]);
    }

    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-emerald-50 to-pink-50 text-slate-800 p-4 flex flex-col items-center justify-center font-sans">
      
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-pink-900">PastelCalc</h1>
        <p className="text-xs text-pink-600">Pink & Pastel Green Theme</p>
      </div>

      {/* Main Calculator */}
      <div className="w-full max-w-xs rounded-3xl p-5 bg-white/90 shadow-xl border border-pink-200">
        
        {/* Screen Display */}
        <div className="mb-4 p-4 rounded-2xl flex flex-col items-end justify-between min-h-[90px] bg-emerald-50 border border-emerald-200">
          <div className="text-xs font-mono text-emerald-700/70 h-4">
            {prevValue !== null ? `${prevValue} ${operation || ''}` : ''}
          </div>
          <div className={`text-3xl font-mono font-bold ${display === 'Error' ? 'text-red-600' : 'text-slate-800'}`}>
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          
          {/* RED AC BUTTON */}
          <button 
            onClick={clearAll}
            className="col-span-2 py-3 rounded-xl font-bold bg-red-500 text-white shadow hover:bg-red-600 active:scale-95 transition-all"
          >
            AC
          </button>

          {/* RED DELETE BUTTON */}
          <button 
            onClick={deleteLastChar}
            className="py-3 rounded-xl font-bold bg-red-400 text-white shadow hover:bg-red-500 active:scale-95 transition-all"
          >
            DEL
          </button>

          {/* PASTEL GREEN OPERATORS */}
          <button 
            onClick={() => performOperation('÷')}
            className="py-3 rounded-xl font-bold bg-emerald-200 text-emerald-900 hover:bg-emerald-300 active:scale-95 transition-all"
          >
            ÷
          </button>

          {/* PINK PASTEL NUMBERS */}
          {[7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => inputDigit(num)}
              className="py-3 rounded-xl font-bold bg-pink-100 text-pink-900 hover:bg-pink-200 active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}

          <button 
            onClick={() => performOperation('×')}
            className="py-3 rounded-xl font-bold bg-emerald-200 text-emerald-900 hover:bg-emerald-300 active:scale-95 transition-all"
          >
            ×
          </button>

          {[4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => inputDigit(num)}
              className="py-3 rounded-xl font-bold bg-pink-100 text-pink-900 hover:bg-pink-200 active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}

          <button 
            onClick={() => performOperation('-')}
            className="py-3 rounded-xl font-bold bg-emerald-200 text-emerald-900 hover:bg-emerald-300 active:scale-95 transition-all"
          >
            -
          </button>

          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => inputDigit(num)}
              className="py-3 rounded-xl font-bold bg-pink-100 text-pink-900 hover:bg-pink-200 active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}

          <button 
            onClick={() => performOperation('+')}
            className="py-3 rounded-xl font-bold bg-emerald-200 text-emerald-900 hover:bg-emerald-300 active:scale-95 transition-all"
          >
            +
          </button>

          <button 
            onClick={() => inputDigit(0)}
            className="col-span-2 py-3 rounded-xl font-bold bg-pink-100 text-pink-900 hover:bg-pink-200 active:scale-95 transition-all"
          >
            0
          </button>

          <button 
            onClick={inputDecimal}
            className="py-3 rounded-xl font-bold bg-pink-100 text-pink-900 hover:bg-pink-200 active:scale-95 transition-all"
          >
            .
          </button>

          <button 
            onClick={handleEquals}
            className="py-3 rounded-xl font-bold bg-emerald-400 text-emerald-950 hover:bg-emerald-500 shadow active:scale-95 transition-all"
          >
            =
          </button>
        </div>
      </div>

      {/* Recent History */}
      {history.length > 0 && (
        <div className="mt-6 w-full max-w-xs p-4 bg-white/60 rounded-2xl border border-pink-200">
          <p className="text-xs font-bold text-pink-900 mb-2">History:</p>
          <ul className="text-xs font-mono space-y-1 text-emerald-900">
            {history.map((item, idx) => (
              <li key={idx} className="p-1.5 bg-emerald-50 rounded border border-emerald-100">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Automatic Render Mount para sa Online Runners / OneCompiler
const rootElement = document.getElementById('root') || document.body;
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
