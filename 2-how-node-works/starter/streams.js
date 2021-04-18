const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 1
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) console.log(err);

  //   res.end(data);
  // });

  // Solution 2: STREAMS
  // const readable = fs.createReadStream("test-file.txt");
  // readable.on("data", (data) => {
  //   res.write(data);
  // });
  // readable.on("end", () => {
  //   res.end;
  // });
  // readable.on("error", (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end("File not found!");
  // });

  // Solution 3:
  const readable = fs.createReadStream("test-file.txt");
  // readableSource.pipe(writeable Destination)
  readable.pipe(res);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server Running");
});
