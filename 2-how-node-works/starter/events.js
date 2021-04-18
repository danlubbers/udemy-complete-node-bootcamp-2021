const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on("newSale", () => {
  console.log("New Sale Emitted!!!");
});

myEmitter.on("newSale", () => {
  console.log("Customer sale!!!");
});

myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} itemss left in inventory.`);
});

myEmitter.emit("newSale", 9);

/////////////////////////////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received!");
  res.end("Request received!");
});

server.on("close", () => {
  console.log("server closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests...");
});
