const http = require('http');

// This will hold info about the current master
let master = {};
var os = require("os");
var hostname = os.hostname();
console.log(`${hostname} started`);

// A callback that is used for our outgoing client requests to the sidecar
const cb = (response) => {
  let data = '';
  response.on('data', (piece) => {
    data = data + piece;
  });
  response.on('end', () => {
    master = JSON.parse(data);
  });
};

// Make an async request to the sidecar at http://localhost:4040
const updateMaster = function updateMaster() {
  const req = http.get({
    host: 'localhost',
    path: '/',
    port: 4040,
  }, cb);

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  req.end();
};

updateMaster();

// Set up regular updates
setInterval(updateMaster, 5000);

// set up the web server
const www = http.createServer((request, response) => {
  response.writeHead(200);
  var masterName = master.name;
  if(masterName.includes(hostname)){

    response.end(`I am master`);
  }
  else {
    response.end('I am not the master');
  }

  
});

www.listen(3000);


