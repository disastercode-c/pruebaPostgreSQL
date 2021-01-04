const http = require("http");
const fs = require("fs");
const url = require("url");
const {
  insertar,
  consultar,
  eliminar,
  editar,
  votar,
  getHistorial,
} = require("./querys");

http
  .createServer(async (req, res) => {
    if (req.url == "/" && req.method == "GET") {
      res.setHeader("content-type", "text/html");
      const html = fs.readFileSync("index.html", "utf8");
      res.end(html);
    }

    if (req.url.startsWith("/candidato") && req.method == "POST") {
      let body = "";
      req.on("data", (payload) => {
        body += payload;
      });
      req.on("end", async () => {
        const datosInsertar = Object.values(JSON.parse(body));
        const result = await insertar(datosInsertar)
        res.end(JSON.stringify(result));
      });
    }

    if (req.url == "/candidatos" && req.method == "GET") {
      const candidatos = await consultar();
      res.end(JSON.stringify(candidatos));
    }

    if (req.url.startsWith("/candidato") && req.method == "DELETE") {
      let { id } = url.parse(req.url, true).query;
      const elimina = await eliminar(id);
      res.end(JSON.stringify(elimina));
    }

    if (req.url == "/candidato" && req.method == "PUT") {
      let body = "";
      req.on("data", (payload) => {
        body += payload;
      });
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body));
        const actualiza = await editar(datos);
        res.end(JSON.stringify(actualiza));
      });
    }

    if (req.url == "/votos" && req.method == "POST") {
      let body = "";
      req.on("data", (payload) => {
        body += payload;
      });
      req.on("end", async () => {
        const votos = Object.values(JSON.parse(body));
        const validar = await votar(votos);
        validar.rowCount == 0 ? (res.writeHead(500, "Error en el servidor"), res.end()): res.end(JSON.stringify(validar.rows))
      });
    }

    if (req.url == "/historial" && req.method == "GET") {
      const history = await getHistorial();
      res.end(JSON.stringify(history));
    }
  })
  .listen(3000);
