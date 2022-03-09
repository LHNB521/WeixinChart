//index.js
//获取应用实例
const app = getApp()
// socket 连接插件
import io from '../socket.io.xcx.min.js'
// const io = require('../weapp.socket.io.js')
//链接地址
var socketurl = 'ws://127.0.0.1:3001'
var that

Page({
  data: {
    mode: 'scaleToFill',
    use: [],
    newbool: true,
    newslist: [],
    txt: [{
      speaker: '',
      content: '欢迎',
      img:''
    }],
    messages: [],
    inputMarBot: false,
    name: [],
    name1: [],
    img1:[]
  },

  /*周期函数*/
  onLoad: function (a) {
    var name1 = [];
    that = this
    that.setData({
      name: a.id
    })
    var a = wx.getStorageSync('name')
    console.log(a[0]);
    for (var x in a) {
      name1.push(a[x])
    }
    console.log(this.data.name)
    for (var x in a) {
      if (a[x] == this.data.name) {
        if (wx.getStorageSync(this.data.name) == '') {
          wx.showToast({
            title: '没有聊天记录',
          })
        } else {
          this.setData({
            txt: wx.getStorageSync(this.data.name)
          })
        };
      }
    }
    name1.push(this.data.name)
    wx.setStorageSync('name', name1);
    this.socketstart();
    this.pageScrollToBottom();
  },



  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#j').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },




  /*socket链接走起--*/
  socketstart: function () {
    //设置链接地址
    var id = this.data.name;
    const socket = (this.socket = io(socketurl))
    var namearr = wx.getStorageSync('haha')
    console.log(namearr)

    socket.on('connect', function (s) {
      socket.emit('message2', id)
      wx.showToast({
        title: '链接成功!',
      })
    });

    socket.on('message1', function (d) {
      that.receive(d);
    })
    socket.on('message4', function (d) {
      that.receive2(d);
    })
    socket.on('userArr',function(d){
  
      that.receive3(d);
    })
  },



  /*** 接收消息*/
  receive: function (d) {
    if (d.userid == this.data.name) {
      var obj = {}
      obj.speaker = "server"
      obj.content = d.body
      if(d.img==1){
        d.img=""
      }
      obj.img=d.img
      let txt = that.data.txt
      console.log(obj)
      txt.push(obj)
      that.setData({
        txt
      })
    console.log(txt)
    
    }
  },
 
 //排队提醒
  receive2: function (d) {
    var a = d.indexOf(this.data.name);
    if (a != 0) {
      var obj = {}
      obj.speaker = "server"
      obj.content = "前方排队" + 1 + "人";
      let txt = that.data.txt
      txt.push(obj)
      that.setData({
        txt
      })
    }
  },
//接受在线用户数组
  receive3:function(d){
    wx.setStorageSync('haha', d)
 },

  //获取输入框的内容
  userInput: function (e) {
    this.setData({
      use: e.detail.value,
    });

  },
  emoj: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        //console.log(tempFilePaths)
        //console.log(wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64"))
        that.setData({
          img1: 'data:image/jpg;base64,'+wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        });
      }
    })
  },
  //事件处理函数
  send: function () {
    
    var req = {
      'nameid': this.data.name,
      'body': this.data.use,
      'img':this.data.img1
    }
    console.log(req)
    var that = this
    var obj = {}
    if (req.body == ""&&req.img=="") {
      wx.showToast({
        title: '消息不能为空哦',
      })
    } else {
      this.socket.emit('message', req)
      wx.setStorageSync('key', this.data.use);
      var a = wx.getStorageSync('key');
      console.log(a);
      obj.speaker = "user"
      obj.content = this.data.use
      obj.img=this.data.img1
      let txt = that.data.txt
      txt.push(obj)
      that.setData({
        txt
      })
      console.log(that.data.txt)
      wx.setStorageSync(this.data.name, this.data.txt);
      this.setData({
        use: '',
        img1:'',
      });
    }
  },


  // 用户点击右上角分享

  onShareAppMessage: function () {

  }
})