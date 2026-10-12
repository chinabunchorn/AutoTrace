// index.html?start=result&case=B jumps straight to a page, handy while testing
const params = new URLSearchParams(location.search);
const start = params.get('start') || 'upload';
const caseKey = params.get('case') === 'B' ? 'B' : 'A';

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, { start, caseKey }));
