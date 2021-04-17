const fs = require('fs'); // file system
const http = require('http'); // networking capabilities
const url = require('url'); // routing
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

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

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHTML = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
    res.end(output);

    // PRODUCT
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];

    const output = replaceTemplate(templateProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('page not found!');
  }

  // res.end("Server Communication!!!");
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening on port 8000');
});
