const http = require("http"),
  fs = require("fs"),
  path = require("path"),
  mime = require("mime"),
  cache = {},
  chatServer= require('./lib/chat_server');

  


const server = http.createServer((req, res) => {
  let filePath = false;
  if (req.url === "/") 
    filePath = "public/index.html";
  else  
    filePath = `public${req.url}`;

  let absPath = `./${filePath}`;
  serverStatic(res, cache, absPath);
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});


chatServer.listen(server);


function send404(res) {
  res.writeHead(404, { "Contrnt-Type": "text/plain" });
  res.write("Error 404: resource not found");
  res.end();
}

function sendFile(res, filePath, fileContents) {
  res.writeHead(200, { "Content-Type": mime.getType(path.basename(filePath)) });
  res.end(fileContents);
}

function serverStatic(res, cache, absPath) {
  if (cache[absPath]) sendFile(res, absPath, cache[absPath]);
  else {
    fs.exists(absPath, exists => {
      if (exists) {
        fs.readFile(absPath, (err, data) => {
          if (err) send404(res);
          else {
            cache[absPath] = data;
            sendFile(res, absPath, data);
          }
        });
      } else send404(res);
    });
  }
}
