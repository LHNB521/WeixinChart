var message = {
    speaker: "客服",
    recipient:"",
    id: "客服",
    content:"",
    img:"",
    login:false
};
var imgdata
var speaker='',id='',content='',img='';
var c=0;
const ws = new WebSocket('ws://localhost:3001');
/**
 * 链接websocket并发送和监听
 */
function connect(){
    ws.onopen = function () {
        console.log(`已打开链接`)
        ws.send(JSON.stringify({
            "id":"客服",
            "login":true,
          }));
    }

    ws.onclose=function(){
        console.log("链接已关闭...");
        connect();
    }
    //接受函数
    function jieshou(){
        ws.onmessage = function(res){
            if(res.data=="用户下线"){
                console.log("用户下线")
            }else{
                panduan(res.data); 
            }
        }
    };
    jieshou();
}
connect();//创建链接实例

/**
 * 判断函数消息内容
 */
var ID=[]
function panduan(str){
    var message0=JSON.parse(str)
    var nameing=message0.id
    if(message0.title){
        message.recipient=nameing
        var k=0;
        for(var i=0;i<ID.length;i++){
            if(ID[i]==nameing){
                k++;
            }
        }
        if(k==0){
            ID.push(nameing)
            console.log(ID)
        }
    }else{
        showMessage(str);
    }
}

function sendimg(){
    document.getElementById('file').click();
    var file = document.getElementById('file');
    var image = document.getElementById("img");
    file.onchange = function() {        //onchange 事件会在域的内容改变时发生。
        var fileData = this.files[0];  //获取到一个FileList对象中的第一个文件( File 对象),是我们上传的文件
        var pettern = /^image/;
        if (!pettern.test(fileData.type)) {
            alert("图片格式不正确");
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(fileData);//异步读取文件内容，结果用data:url的字符串形式表示
        /*当读取操作成功完成时调用*/
        reader.onload = function(e) {
            console.log(e); //查看对象
            console.log(this.result);//要的数据 这里的this指向FileReader（）对象的实例reader
            image.setAttribute("src", this.result)
            imgdata=this.result
        }
    } 
}
/**
 * 获取input框的输入值函数
 * 点击发送事件
 */
function send(){
    document.getElementById('send').onclick = function(){
        var image = document.getElementById("img");
        var text=document.getElementById('text').value;
        message.speaker="客服";
        message.id="客服";
        message.content=text;//输入内容
        message.img=imgdata;//获取图片
        message.recipient=a[c];
        var messagejson=JSON.stringify(message);
        console.log(ID.length)
        if(ID[0]){
            alert("没人！");
            return;
        }
        console.log(messagejson);
        if (message.content || message.img) {              //当不为空发送消息
            ws.send(messagejson);//发送走你
            image.setAttribute("src", "./img/tupian.png")
            showMessage(messagejson);//渲染到页面上
        } else {
            alert('输入为空或者没有用户在线');
        }
        document.getElementById('text').value="";
        imgdata="";
    }
}
send();
/**
 * 接受消息渲染消息函数
 */
var a=[];
function showMessage(str) {
    var speaker0=JSON.parse(str).speaker;//发言者
    var content0=JSON.parse(str).content;//发言内容
    var img0=JSON.parse(str).img;//图片
    var div = document.createElement('div');//创建聊天一个div
    var new1 = document.getElementById('new1');
    var div0=document.createElement('div')

    if(img0==undefined||img0==""){
        div.innerHTML = speaker0+"说："+content0;   //显示
    }else{
        var img1=`<img src="${img0}" style="width:200px;height:200px;display:block">`;
        div.innerHTML = speaker0+"说："+content0+img1;   //显示
    }
    if(speaker0!="客服"){
        showuser(speaker0);
        //console.log(speaker0)
    }
    var b=0;
    var d=0;
    var div0;
    for(var i=0;i<a.length;i++){
        if(a[i]==speaker0){
            b++;
            d==1;
        }
    }
    if(speaker0=="客服"){
        b++;
        div.style.color="red";
    }
    if(b==0){
        div0 = document.createElement('div');//创建一个div
        div0.style.width=760
        new1.appendChild(div0);//在new1中显示这个div
        a.push(speaker0)
        c=a.indexOf(speaker0);
        div0.id=c;
        document.getElementById(c).style.display="none"
    }
    //console.log(a)
    if(speaker0!="客服"){
        c=a.indexOf(speaker0);
    }
    // console.log(c)
    var div0id=document.getElementById(c)

    if(a.length<=1){
        div0id.style.display="block"   
    }else{
        // for(var i=0;i<a.length;i++){
        //     var div0id=document.getElementById(i)
        //     if(div0id.style.display=="block"){
        //         console.log("4545")
        //     }else{
        //         //div0id.style.display="none"
        //         console.log("1212")
        //     }
        // }
    }
    if(speaker0!='客服'){
        tixing(str);
    }
    div0id.appendChild(div)
}
/**
 * [showuser 用户列表]
 * @123
 */
var aa=[]
function showuser(str){
    var div = document.createElement('div')
    var user=document.getElementById("user_user")
    
    var b=0;
    for(var i=0;i<=aa.length;i++){
        if(aa[i]==str){
            b++;
        }
    }
    if(b==0){
        aa.push(str)
        div.style.height='30px'
        // div.style.width='60px'
        div.innerHTML="♀"+str
        div.style.color="red"
        user.appendChild(div)
        //new1.style.display="none"
        div.onclick=function(){
            for(var i=0;i<a.length;i++){
                var divli=document.getElementById(i)
                divli.style.display="none"
            }
            var haha=document.getElementById(a.indexOf(str))
            haha.style.display="block";
            div.style.color="blue";
            console.log(a)
            //console.log(a.indexOf(str))
            c=a.indexOf(str);
        }
    }
    //console.log(aa)
}
/**
 * 消息提醒
 */
function tixing(str){
    var speaker0=JSON.parse(str).speaker;//发言者
    var content0=JSON.parse(str).content;//发言内容
    var img0=JSON.parse(str).img;//图片
    var i=a.indexOf(speaker0)
    // console.log(i)
    // console.log(a)
    var div0=document.getElementById('user_user').getElementsByTagName("div");
    var div=div0[i]
    div.style.color="red"
}



        /**
         * 客服登录验证
         * 账号123
         * 密码123
         */
        var enterId = document.getElementById('enterId');
        var enter = document.getElementById('enter');
        var password = 123;
        var zhanghao = 123;
        enterId.onclick = function () {
            var inputTxt = document.getElementById('inputId').value;   //获取输入值
            var inputT = document.getElementById('inputI').value;
            if (aa == 1) {
                alert("有客服啦！");
            } else {
                if (inputTxt == password && inputT == zhanghao) {
                    enter.style.display = 'none'
                } else {
                    alert("输入账号或密码错入，请从新输入")
                }
            }

        }

