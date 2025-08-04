export async function fetchResults() {
  const res = await fetch('/results.json');
  if (!res.ok) throw new Error('Failed to load results');
  const data = await res.json();
  return data.results;
}
