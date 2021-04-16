const fs = require("fs"); // file system
const http = require("http"); // networking capabilities
const url = require("url"); // routing

//////////////////////////////////////////////////////////////
// FILES

// Blocking
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocaado: ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written");

// Non-Blocking, Async way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, (err) => {
//         console.log("Combined text completed!!!");
//       });
//     });
//   });
// });

// console.log("Will read file");

//////////////////////////////////////////////////////////////
// SERVER

const server = http.createServer((req, res) => {
  console.log(req.url);

  const pathname = req.url;

  if (pathname === "/" || pathname === "/overview") {
    res.end("This is the Overview");
  } else if (pathname === "/product") {
    res.end("This is the Product");
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("page not found!");
  }

  // res.end("Server Communication!!!");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
