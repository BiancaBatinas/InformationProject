const express = require("express");
const app = express();
const Datastore = require("nedb"); //initializare baza de date
var fetch = require("node-fetch");
const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log(`listening at ${Port}`);
}); //ne conectam la portul 3000. Serverul este functional
//index.js este codul pentru server---- trebuie sters la sfarsit
//pagina html din folderul 'public' este trimisa catre server
app.use(express.static("public")); //construim un folder public care contine paginile html ale proiectului
app.use(express.json({ limit: "1mb" })); //limita pachetului de date jason preluat

const database = new Datastore("store.db"); //creare baza de date
database.loadDatabase();

//preluam toate obiectele din baza de date
app.get("/api", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
  
});

//folosim metoda POST pentru a trimite datele catre server
app.post("/api", (request, response) => {
  console.log("request");
  const Data = request.body;
  console.log(request.body);
  database.insert(Data);
  const Time = Date.now();
  //salvam ora in milisecunde cand s-a preluat longitudinea si latitudinea
  Data.Time = Time;
  response.json(Data);
});

app.get("/weather/:latlon", async (request, response) => {
 
  const latlon = request.params.latlon.split(",");
  console.log(latlon);
  const latitudine = latlon[0];
  const longitudine = latlon[1];
  console.log(latitudine, longitudine);
  const api_info = `https://api.openweathermap.org/data/2.5/weather?lat=${latitudine}&lon=${longitudine}&appid=dee38129c3b4a816b2f431cea2610c7f`;
  const response_fetch = await fetch(api_info);
  const Json_api = await response_fetch.json();
  response.json(Json_api);
  
  
});
