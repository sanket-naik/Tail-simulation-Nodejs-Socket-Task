var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let fs=require('fs')

//PROCESS PORT
let PORT=process.env.PORT||8080

//TO STORE THE LOGGER STRING
let arr=[]

//ROUTE SARVED WITH INDEX.HTML
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

//WEBSOCKET FOR REALTIME UPDATE
io.on('connection', function(socket) {
    console.log('WebSocket established is live!');
});

//READING LOGGER FILE ON EVERY 100MS
const readFile=() => {
    fs.readFile('logger.txt',(err, data)=>{
        if(err)throw err;
        //CONVERT TO STRING FORMAT
        let res=data.toString('utf8')
        //CORVERTING STRING TO ARRAY
        res=res.split('\n')
        //REMOVE EMPTY ARRAY
        res=res.filter((entry)=>{ return entry.trim() != ''; });
        //DISPLAY LAST 5 ELEMENTS
        arr=res.slice(Math.max(res.length - 5, 1))
    })
}

//EMIT CHANGES TO UI
setInterval(function() {
  readFile();
  let data = arr
  io.emit('tail', data);
}, 1000);

//LISTENING SERVER
http.listen(PORT, function() {
    console.log(`Listening on ${PORT}`);
});