const http = require('http');
const PORT = process.env.PORT;

const callPoll = (backoffTime = 1) => {
  console.log("Polling the server to check for message...");
  http.get(`http://127.0.0.1:${PORT}/api/long-poll`, (res) => {
    let data = '';

    // A chunk of data received.
    res.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response received.
    res.on('end', () => {
      try {
        console.log(JSON.parse(data));
      } catch (e) {
        console.error(e.message);
        setTimeout(() => {
          callPoll(backoffTime * 2);
        }, backoffTime * 1000);
      }
      callPoll();
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
    setTimeout(() => {
      callPoll(backoffTime * 2);
    }, backoffTime * 1000);
  });
}

callPoll();