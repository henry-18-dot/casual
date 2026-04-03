const API = process.env.TOOL_API || 'http://127.0.0.1:8787';
const route = process.argv[2] || '/';
const project = process.argv[3] || 'external-project';

const response = await fetch(`${API}/api/screenshot`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ route, project }),
});

const data = await response.json();
if (!response.ok || !data.ok) {
  console.error('capture failed', data);
  process.exit(1);
}
console.log(JSON.stringify(data, null, 2));
