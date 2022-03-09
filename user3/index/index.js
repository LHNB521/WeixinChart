//index.js
//获取应用实例
const app = getApp()
var haha=[]
var heihei=[]
Page({
  
  data: {
    message: "进入客服会话",
    hiddenmodalput: true,
    name:'',
  },
  onLoad: function () {
    haha = wx.getStorageSync('haha')
    heihei = wx.getStorageSync('name')
  },

  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮
  off: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //获取输入框的名字
  nameInput: function (e) {
    this.setData({
      name: e.detail.value,
    });
  },

  //确认
  chat: function () {
    var id=this.data.name
    if(haha.indexOf(id)!=-1&&heihei.indexOf(id)==-1){
      wx.showToast({
        title: '昵称已注册',
      })
    }else{
      if (this.data.name == "") {
        wx.showToast({
          title: '消息不能为空哦',
        })
      } else {
        this.setData({
          hiddenmodalput: true
        })
        wx.navigateTo({
          url: '../chat/chat?id=' + id,
        })
      }

    }
    

  }
  

})
