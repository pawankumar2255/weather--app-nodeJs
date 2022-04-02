const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    var myData = tempVal.replace("{%tempval%}", Math.round(orgVal.main.temp - 273));
    myData = myData.replace("{%temp_max%}", Math.round(orgVal.main.temp_max - 273));
    myData = myData.replace("{%temp_min%}", Math.round(orgVal.main.temp_min - 273));
    myData = myData.replace("{%location%}", orgVal.name);
    myData = myData.replace("{%country%}", orgVal.sys.country);
    myData = myData.replace("{%weather%}", orgVal.weather[0].main);
    myData = myData.replace("{%windspeed%}", Math.round((orgVal.wind.speed)*(18/5)));
    myData = myData.replace("{%humid%}", orgVal.main.humidity);
    
    return myData;

} 

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        let apid = "https://api.openweathermap.org/data/2.5/weather?q=dharamsala&appid=3d96a0002ea43225ce38e3d92a949ffb"
        
        requests(apid)

            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData]
                const realTimeData = arrData.map(val => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to error", err);
                res.end();
            });
    }
});

server.listen(4000, "127.0.0.1");