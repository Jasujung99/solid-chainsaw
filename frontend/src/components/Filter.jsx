export default function Filter({ models, value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">All</option>
      {models.map(m => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  );
}
