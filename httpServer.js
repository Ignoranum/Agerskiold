import http from 'http';

export default http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/ping') {
    const startTime = Date.now();

    // Simulate some work (you can replace this with your actual server logic)
    setTimeout(() => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      console.log(`Ping response time: ${responseTime}ms`);
      res.end(`Ping response time: ${responseTime}ms`);
    }, 234); // Simulated work takes 234 milliseconds
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});