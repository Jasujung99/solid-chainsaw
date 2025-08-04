import { useState } from 'react';
import './CompareView.css';

export default function CompareView() {
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);

  const handleDrop = (e, setter) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('result');
    if (data) setter(JSON.parse(data));
  };
  const allowDrop = e => e.preventDefault();

  return (
    <div className="compare">
      <div id="compare-left" className="dropzone" onDragOver={allowDrop} onDrop={e => handleDrop(e, setLeft)}>
        {left && <img src={left.thumbnail} alt={left.model} />}
      </div>
      <div id="compare-right" className="dropzone" onDragOver={allowDrop} onDrop={e => handleDrop(e, setRight)}>
        {right && <img src={right.thumbnail} alt={right.model} />}
      </div>
    </div>
  );
}
