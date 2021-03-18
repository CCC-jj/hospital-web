<template>
  <div>
    <!-- <a-button type="primary" @click="showDrawer"> <a-icon type="plus" /> New account </a-button> -->
    <div v-if="openChat" class="chatBox">
      <div class="chat-content" id="chatRecord">
        <div style="text-align: center; margin-bottom: 5px;"><span @click="getMoreMessage" :class="[{moreText: more}]">{{more?'查看更多':'没有更多了'}}</span></div>
        <div class="toBottomText" @click="toBottom(100)"><span>{{news?'您有新消息！':'回到底部'}}</span></div>
        <!-- recordContent 聊天记录数组-->
        <div v-for="(item,index) in messageList" :key="index">
          <!-- 对方 -->
          <div class="word" v-if="item.flow === 'in'">
            <img class="avatar" src="../assets/p0.png" />
            <div class="info">
              <p class="time">病患 {{moment(item.time*1000).format('YYYY-MM-DD HH:mm:ss')}}</p>
              <div class="info-content">

                <span v-if="item.type==='TIMTextElem'">{{item.payload.text}}</span>

                <viewer v-else-if="item.type==='TIMImageElem'" class="prPic">
                  <img style="max-width:150px;" :src="item.payload.imageInfoArray[0].imageUrl" />
                </viewer>

                <div v-else-if="item.type==='TIMCustomElem'" class="cardInfoBox">

                  <div v-if="JSON.parse(item.payload.data).type==='001'" class="cardInfo">
                    <p style="text-align:center;">{{JSON.parse(item.payload.data).title}}</p>
                    <p>诊断 <span style="color:#656ee8;">{{JSON.parse(item.payload.data).diagnosis}}</span></p>
                    <p>药品 <span style="color:#656ee8;">{{JSON.parse(item.payload.data).drugs}}</span></p>
                  </div>

                  <div v-if="JSON.parse(item.payload.data).type==='002'" class="cardInfo">
                    <p style="text-align:center;">{{JSON.parse(item.payload.data).title}}</p>
                    <p>{{JSON.parse(item.payload.data).descriptionTitle}} <span style="color:#656ee8;">{{JSON.parse(item.payload.data).descriptionValue}}</span></p>
                    <p>{{JSON.parse(item.payload.data).sickTimeTitle}} <span style="color:#656ee8;">{{JSON.parse(item.payload.data).sickTimeValue}}</span></p>
                    <p>{{JSON.parse(item.payload.data).statementTitle}} <span style="color:#656ee8;">{{JSON.parse(item.payload.data).statementValue}}</span></p>
                    <viewer class="imgBox">
                      <img v-for="(itemImg,indexImge) in JSON.parse(item.payload.data).imageUrl" :key="indexImge" :src="itemImg" />
                    </viewer>
                  </div>

                </div>

                <div v-else>{{item.payload}}</div>
              </div>
            </div>
          </div>
          <!-- 我的 -->
          <div class="word-my" v-else-if="typeElse(item)">
            <div class="info">
              <p class="time">{{doctorName()}} {{moment(item.time*1000).format('YYYY-MM-DD HH:mm:ss')}}</p>
              <div class="info-content">

                <span v-if="item.type==='TIMTextElem'">{{item.payload.text}}</span>

                <viewer v-else-if="item.type==='TIMImageElem'" class="prPic">
                  <img style="max-width:150px;" :src="item.payload.imageInfoArray[0].imageUrl" />
                </viewer>

                <div v-else-if="item.type==='TIMCustomElem'" class="cardInfoBox">

                  <div v-if="JSON.parse(item.payload.data).type==='001'" class="cardInfo">
                    <p style="text-align:center;">{{JSON.parse(item.payload.data).title}}</p>
                    <p>诊断 <span style="color:#656ee8;">{{JSON.parse(item.payload.data).diagnosis}}</span></p>
                    <p>药品 <span style="color:#656ee8;">{{JSON.parse(item.payload.data).drugs}}</span></p>
                  </div>

                  <div v-if="JSON.parse(item.payload.data).type==='002'" class="cardInfo">
                    <p style="text-align:center;">{{JSON.parse(item.payload.data).title}}</p>
                    <p>{{JSON.parse(item.payload.data).descriptionTitle}} <span style="color:#656ee8;">{{JSON.parse(item.payload.data).descriptionValue}}</span></p>
                    <p>{{JSON.parse(item.payload.data).sickTimeTitle}} <span style="color:#656ee8;">{{JSON.parse(item.payload.data).sickTimeValue}}</span></p>
                    <p>{{JSON.parse(item.payload.data).statementTitle}} <span style="color:#656ee8;">{{JSON.parse(item.payload.data).statementValue}}</span></p>
                    <viewer class="imgBox">
                      <img v-for="(itemImg,indexImge) in JSON.parse(item.payload.data).imageUrl" :key="indexImge" :src="itemImg" />
                    </viewer>
                  </div>
                </div>

                <div v-else>{{item.payload}}</div>
              </div>
            </div>
            <img class="avatar" src="../assets/p0.png" />
          </div>
        </div>

      </div>
      <hr />
      <div style="display:flex;">
        <a-input style="width:80%;" v-model="content" @keyup.enter="sendMessage"></a-input>
        <a-button style="width:20%;" @click="sendMessage">发送</a-button>
      </div>
      <!-- <a-button @click="sendImg">发送图片</a-button> -->
      <a-upload accept="image/png, image/jpeg" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
        <a-button>
          <a-icon type="upload" /> 发送图片
        </a-button>
      </a-upload>
      <!-- <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          Cancel
        </a-button>
        <a-button type="primary" @click="onClose">
          Submit
        </a-button>
      </div> -->
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'
import TIM from 'tim-js-sdk'
let options = {
  SDKAppID: 1400484455, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
}
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options) // SDK 实例通常用 tim 表示
export default {
  data() {
    return {
      openChat: false,
      visible: false,
      userID: '',
      toUser: '',
      // conversationID: '',
      content: '',
      // messageList: [],
      nextReqMessageID: '',
      fileList: [],
      file: {},
      more: true,
      isBottom: false,
      // news: false,
    }
  },
  computed: {
    ...mapState(['news', 'conversationID', 'messageList']),
  },
  updated() {
    // 聊天定位到底部
    if (this.openChat && !this.isBottom) {
      let ele = document.getElementById('chatRecord')
      ele.scrollTop = ele.scrollHeight
      setTimeout(() => {
        this.setMessageRead()
      }, 500)
    }
  },
  mounted() {},
  destroyed() {
    this.changeNews(false)
    this.changeConversationID('')
    this.changeMessageList([])

    // let promise = tim.logout()
    // promise
    //   .then((imResponse) => {
    //     // console.log(imResponse.data) // 登出成功
    //   })
    //   .catch((imError) => {
    //     console.warn('logout error:', imError)
    //   })
  },
  methods: {
    moment,
    ...mapMutations([
      'changeNews',
      'changeConversationID',
      'changeMessageList',
      'pushMessageList',
      'concatMessageList',
      'onMessageReceived',
    ]),
    changeParse(i) {
      if (i) {
        return JSON.parse(i)
      }
    },
    getMoreMessage() {
      this.isBottom = true
      if (this.more) {
        this.getMessageList(this.nextReqMessageID)
      }
    },
    // 回到底部
    toBottom(i) {
      let ele = document.getElementById('chatRecord')
      let clientHeight = ele.clientHeight || document.body.clientHeight
      let scrollHeight = ele.scrollHeight
      let rollheight = scrollHeight - clientHeight //超出窗口上界的值就是底部的scrolTop的值
      ele.scrollTop += 200
      if (ele.scrollTop + 1 <= rollheight) {
        //之所以+1，可以打印这两个值的日志就知道了，下面+1也是同理
        var c = setTimeout(() => this.toBottom(i), 10) //调用setTimeout是为了“回到底部”这过程不是一瞬间
      } else {
        clearTimeout(c)
      }
      this.isBottom = false
      // this.news = false
      this.changeNews(false)
      this.setMessageRead()
    },
    doctorName() {
      return localStorage.getItem('userName')
    },
    typeElse(item) {
      if (item.payload.data) {
        return JSON.parse(item.payload.data).type !== '003'
      } else {
        return item.flow === 'out'
      }
    },
    showDrawer(userID, userSig, toUser) {
      this.openChat = true
      if (this.openChat) {
        // let promise = tim.login({ userID: userID, userSig: userSig })
        // promise
        //   .then((imResponse) => {
        this.userID = userID
        this.toUser = toUser
        //     // console.log(imResponse.data) // 登录成功
        //     if (imResponse.data.repeatLogin === true) {
        //       // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
        //       // console.log(imResponse.data.errorInfo)
        //     }
        this.changeMessageList([])
        // this.messageList = []
        setTimeout(() => {
          this.getMessageList()
        }, 500)
        // })
        // .catch((imError) => {
        //   console.warn('login error:', imError) // 登录失败的相关信息
        // })
      }
    },
    sendMessage() {
      if (this.content) {
        // 发送文本消息，Web 端与小程序端相同
        // 1. 创建消息实例，接口返回的实例可以上屏
        let message = tim.createTextMessage({
          to: this.toUser,
          conversationType: TIM.TYPES.CONV_C2C,
          // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
          // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
          // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
          payload: {
            text: this.content,
          },
        })
        this.content = ''
        // 2. 发送消息
        let promise = tim.sendMessage(message)
        promise
          .then((imResponse) => {
            // 发送成功
            // this.getMessageList()
            // this.messageList.push(message)
            this.pushMessageList(message)
            this.toBottom(100)
          })
          .catch((imError) => {
            // 发送失败
            console.warn('sendMessage error:', imError)
          })
      }
    },
    getMessageList(nextReqMessageID) {
      // 打开某个会话时，第一次拉取消息列表
      let conversationID = `C2C${this.toUser}`
      // this.conversationID = conversationID
      this.changeConversationID(conversationID)
      let promise = tim.getMessageList({
        conversationID: conversationID,
        nextReqMessageID,
        count: 15,
      })
      promise.then((imResponse) => {
        const messageList = imResponse.data.messageList // 消息列表。
        const nextReqMessageID = imResponse.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
        const isCompleted = imResponse.data.isCompleted // 表示是否已经拉完所有消息。
        // this.messageList = messageList.concat(this.messageList)
        this.concatMessageList(messageList)
        this.setMessageRead()
        if (isCompleted) {
          this.more = false
          return
        }
        this.nextReqMessageID = nextReqMessageID
      })
    },
    // 消息已读
    setMessageRead() {
      // 将某会话下所有未读消息已读上报
      let promise = tim.setMessageRead({ conversationID: this.conversationID })
      promise
        .then(function (imResponse) {
          // 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
        })
        .catch(function (imError) {
          // 已读上报失败
          console.warn('setMessageRead error:', imError)
        })
    },
    // 收到消息
    // onMessageReceived(event) {
    //   // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
    //   // event.name - TIM.EVENT.MESSAGE_RECEIVED
    //   // event.data - 存储 Message 对象的数组 - [Message]
    //   if (event.data[0].conversationID === this.conversationID) {
    //     this.messageList.push(event.data[0])
    //     if (event.data[0].flow === 'in') {
    //       this.news = true
    //       // this.$nextTick(() => {
    //       this.$notification.open({
    //         message: '提示',
    //         description: '你有一条新消息',
    //       })
    //       // })
    //     }
    //     // this.toBottom(100)
    //   }
    // },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      this.file = file
      this.sendImg()
      return false
    },
    sendImg() {
      // Web 端发送图片消息示例1 - 传入 DOM 节点
      // 1. 创建消息实例，接口返回的实例可以上屏
      let message = tim.createImageMessage({
        to: this.toUser,
        conversationType: TIM.TYPES.CONV_C2C,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
        payload: {
          file: this.file,
        },
        onProgress: function (event) {
          console.log('file uploading:', event)
        },
      })

      // 2. 发送消息
      let promise = tim.sendMessage(message)
      promise
        .then((imResponse) => {
          // 发送成功
          console.log(imResponse)
          // this.getMessageList()
          // this.messageList.push(message)
          this.pushMessageList(message)
          this.fileList = []
          this.toBottom(100)
        })
        .catch((imError) => {
          // 发送失败
          console.warn('sendMessage error:', imError)
        })
    },
    onClose() {
      this.visible = false
    },
  },
}
</script>

<style scoped>
.chatBox {
  /* z-index: 9999;
  position: fixed; */
  /* top: 22%;
  right: 5%; */
  width: 100%;
  background: #e6e6e6;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 5px #a2a2a2;
  margin: 0 0 0 20px;
  position: relative;
}
.chat-content {
  width: 100%;
  height: 300px;
  overflow-y: auto;
  padding: 10px;
}
.chat-content::-webkit-scrollbar {
  display: none;
}
.chat-content .word {
  display: flex;
  margin-bottom: 20px;
}
.chat-content .word .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.chat-content .word .info {
  margin-left: 10px;
  width: 90%;
}
.chat-content .word .info .time {
  font-size: 12px;
  color: rgba(51, 51, 51, 0.8);
  margin: 0;
  height: 20px;
  line-height: 20px;
  margin-top: -5px;
}
.chat-content .word .info .info-content {
  word-wrap: break-word;
  max-width: 80%;
  border-radius: 5px;
  padding: 5px;
  font-size: 14px;
  float: left;
  background: rgb(194, 194, 194);
  position: relative;
  margin-top: 8px;
  text-align: left;
}
.chat-content .word .info .info-content::before {
  position: absolute;
  left: -8px;
  top: 8px;
  content: '';
  border-right: 10px solid rgb(194, 194, 194);
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}
.chat-content .word-my {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.chat-content .word-my .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.chat-content .word-my .info {
  width: 90%;
  margin-left: 10px;
  text-align: right;
}
.chat-content .word-my .info .time {
  font-size: 12px;
  color: rgba(51, 51, 51, 0.8);
  margin: 0;
  height: 20px;
  line-height: 20px;
  margin-top: -5px;
  margin-right: 10px;
}
.chat-content .word-my .info .info-content {
  border-radius: 5px;
  word-wrap: break-word;
  max-width: 80%;
  padding: 5px;
  font-size: 14px;
  float: right;
  margin-right: 10px;
  position: relative;
  margin-top: 8px;
  background: #a3c3f6;
  text-align: left;
}
.chat-content .word-my .info .info-content::after {
  position: absolute;
  right: -8px;
  top: 8px;
  content: '';
  border-left: 10px solid #a3c3f6;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.moreText {
  color: #656ee8;
  cursor: pointer;
}
.toBottomText {
  color: #656ee8;
  position: absolute;
  z-index: 8;
  top: 280px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  background: #fff;
  padding: 0 8px 0 8px;
  border-radius: 10px;
}
.cardInfo {
  background: #fff;
  padding: 5px;
}
.imgBox {
  display: flex;
  /* justify-content: space-between; */
  width: 100%;
  flex-wrap: wrap;
}
.imgBox > img {
  width: 32%;
  margin-right: 1%;
  margin-bottom: 4px;
}
</style>