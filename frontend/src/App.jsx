import { useEffect, useState } from 'react';
import GridView from './components/GridView';
import TimeSeriesChart from './components/TimeSeriesChart';
import Filter from './components/Filter';
import CompareView from './components/CompareView';
import { fetchResults } from './api';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState('');
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    fetchResults().then(setResults).catch(console.error);
  }, []);

  const models = [...new Set(results.map(r => r.model))];
  const filtered = filter ? results.filter(r => r.model === filter) : results;
  const chartData = filtered.map(r => ({ timestamp: r.timestamp, score: r.score }));

  const handleDragStart = (e, result) => {
    e.dataTransfer.setData('result', JSON.stringify(result));
  };

  return (
    <div>
      <h1>Model Results</h1>
      <Filter models={models} value={filter} onChange={setFilter} />
      <button onClick={() => setCompare(c => !c)}>Toggle Compare</button>
      {compare && <CompareView />}
      <TimeSeriesChart data={chartData} />
      <GridView results={filtered} onDragStart={handleDragStart} />
    </div>
  );
}

export default App;
