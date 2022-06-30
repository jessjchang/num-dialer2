import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { fetchNumbers } from './service/phoneNumberService'

function App() {
  const [numbers, setNumbers] = useState([])
  const [status, setStatus] = useState([])
  
  useEffect(() => {
    const getNumbers = async () => {
      const numbers = await fetchNumbers();
      setNumbers(numbers)
    }
    getNumbers();
    console.log(numbers)
    let newStatus = [];
    for (let i = 0; i < numbers.length; i++) {
      newStatus.push("idle");
    }
    setStatus(newStatus);
  }, [numbers.length])

  if (!numbers) {
    return null;
  }

  return (
    <div className="App">
      <h1>Dialing App</h1>
      <ul>
        {numbers.map((number, idx) => <li>{number} {status[idx]} </li>)}
      </ul>
      <button>Dial</button>
    </div>
  );
}

export default App;
