import net from 'net';

export default net.createServer((socket) => {
  console.log('Client connected.');

  socket.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`Received from client: ${message}`);

    const msg = message.split(':')[0];
    if (msg === 'ping') {
      const [pingMsg, clientTimestamp] = message.split(':');
      const serverTimestamp = Date.now();
      console.log(pingMsg);
      console.log(`Round-trip time: ${serverTimestamp - parseInt(clientTimestamp)} ms`);
      socket.write(`pong:${clientTimestamp}`);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected.');
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Error:', error);
  });
});