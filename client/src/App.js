import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { fetchNumbers, commenceDial } from './service/phoneNumberService'

function App() {
  const [numbers, setNumbers] = useState([])
  const [status, setStatus] = useState([])
  const [enable, setEnable] = useState(false)

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
  }, [numbers.length]);

  useEffect(() => {
    const sse = new EventSource('http://localhost:5001/status');

    sse.onmessage = e => setStatus(JSON.parse(e.data).status);

    sse.addEventListener('error', (e) => {
      console.error('Error: ',  e);
    });

    return () => {
      sse.close();
    };
  }, []);

  if (!numbers) {
    return null;
  }

  const handleClick = (e) => {
    e.preventDefault();
    commenceDial()
    setEnable(true)
  }

  return (
    <div className="App">
      <h1>Dialing App</h1>
      <ul>
        {numbers.map((number, idx) => <li>{number} {status[idx]} </li>)}
      </ul>
      <button disabled={enable} onClick={handleClick}>Dial</button>
    </div>
  );
}

export default App;
