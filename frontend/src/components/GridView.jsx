import './GridView.css';

export default function GridView({ results, onDragStart }) {
  return (
    <div className="grid">
      {results.map(r => (
        <div key={r.id} className="grid-item" draggable onDragStart={e => onDragStart(e, r)}>
          <a href={r.original} target="_blank" rel="noopener noreferrer">
            <img src={r.thumbnail} alt={r.model} />
            <div className="overlay">{r.analysis}</div>
          </a>
        </div>
      ))}
    </div>
  );
}
