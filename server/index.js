const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({
    port: 3001
});
var people=[]
var a=1;
var b=0;
wss.on('connection', function (ws) {
    console.log(a+`个已连接`);

    ws.on('message', function (message){
        //console.log(message)
        if(message=="客服上线"){
            b=1;
            a=1;
        }else{
            var id=JSON.parse(message).id;
            var title=JSON.parse(message).title;
            if(title){
                var k=0;
                for(var i=0;i<=people.length;i++){
                    if(people[i]==id){
                        k++;
                    }
                }
                if(k==0){
                    people.push(id)
                    // console.log(people);
                    a++;
                }    
            }
        }
        const result = JSON.parse(message); 
            if(result.login){
                ws.socketIdxos = result.id;
                // console.log(ws.socketIdxos)
            }else{
                    wss.clients.forEach(function (s) {
                        /*除了自己发送全部*/
                        if (s.socketIdxos == result.recipient&& s.readyState == 1) {
                            // console.log(result.recipient)
                            // console.log(message)
                            s.send(message);
                        }
                      });
                }
    });
    ws.on('close',function close(message){
        a=a-1;
        people.pop();
        console.log(people)
    })
});
console.log('正在监听 3001...');

