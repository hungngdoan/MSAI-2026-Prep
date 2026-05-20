const fs = require("fs");
const http = require("http");
const path = require("path");

const host = "localhost";
const port = Number(process.env.PORT || 8082);
const root = path.resolve(__dirname, "..", "docs");
const projectRoot = path.resolve(__dirname, "..");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

function send(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(body);
}

function resolveRequestPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const filePath = path.normalize(path.join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    return null;
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath === "/data/progress.json") {
    const progressPath = path.join(projectRoot, "progress.json");
    fs.readFile(progressPath, (error, data) => {
      if (error) {
        send(res, error.code === "ENOENT" ? 404 : 500, error.code === "ENOENT" ? "Not found" : "Server error");
        return;
      }
      send(res, 200, data, "application/json; charset=utf-8");
    });
    return;
  }

  const filePath = resolveRequestPath(req.url || "/");
  if (!filePath) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, error.code === "ENOENT" ? 404 : 500, error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    send(res, 200, data, contentType);
  });
});

server.listen(port, host, () => {
  console.log(`[MSAI] Server at http://${host}:${port}/`);
});
