<template>
  <div>
    <!-- <a-button type="primary" @click="showDrawer"> <a-icon type="plus" /> New account </a-button> -->
    <a-drawer title="与 xxx 患者对话中" :width="720" :visible="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
      <div class="chat-content">
        <!-- recordContent 聊天记录数组-->
        <div v-for="(item,index) in messageList" :key="index">
          <!-- 对方 -->
          <div class="word" v-if="item.flow !== 'out'">
            <img class="avatar" src="../assets/p0.png">
            <div class="info">
              <p class="time">病患 {{moment(item.time*1000).format('YYYY-MM-DD HH:mm:ss')}}</p>
              <div class="info-content">
                <span v-if="item.payload.text">{{item.payload.text}}</span>
                <!-- <img style="max-width:300px;" v-else :src="item.payload.imageInfoArray[1].imageUrl" alt=""> -->
                <viewer v-else class="prPic">
                  <img style="max-width:300px;" :src="item.payload.imageInfoArray[0].imageUrl" />
                </viewer>
              </div>
            </div>
          </div>
          <!-- 我的 -->
          <div class="word-my" v-else>
            <div class="info">
              <p class="time">{{doctorName()}} {{moment(item.time*1000).format('YYYY-MM-DD HH:mm:ss')}}</p>
              <div class="info-content">
                <span v-if="item.payload.text">{{item.payload.text}}</span>
                <!-- <img style="max-width:300px;"  :src="item.payload.imageInfoArray[1].imageUrl" alt=""> -->
                <viewer v-else class="prPic">
                  <img style="max-width:300px;" :src="item.payload.imageInfoArray[0].imageUrl" />
                </viewer>
              </div>
            </div>
            <img class="avatar" src="../assets/p0.png">
          </div>
        </div>
      </div>
      <hr />
      <div style="display:flex;">
        <a-input style="width:90%;" v-model="content" @keyup.enter="sendMessage"></a-input>
        <a-button style="width:10%;" @click="sendMessage">发送</a-button>
      </div>
      <!-- <a-button @click="sendImg">发送图片</a-button> -->
      <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
        <a-button>
          <a-icon type="upload" /> 发送图片
        </a-button>
      </a-upload>
      <div :style="{
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
      </div>
    </a-drawer>
  </div>
</template>
<script>
import moment from 'moment'
import TIM from 'tim-js-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'
let options = {
  SDKAppID: 1400484455, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
}
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options) // SDK 实例通常用 tim 表示
// 设置 SDK 日志输出级别，详细分级请参见 <a href="https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#setLogLevel">setLogLevel 接口的说明</a>
export default {
  data() {
    return {
      visible: false,
      userID: '',
      toUser: '',
      content: '',
      messageList: [],
      fileList: [],
      file: {},
    }
  },
  mounted() {
    tim.setLogLevel(1) // 普通级别，日志量较多，接入时建议使用
    // tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
    // 注册腾讯云即时通信 IM 上传插件
    tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, (event) => {
      // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
      // event.name - TIM.EVENT.MESSAGE_RECEIVED
      // event.data - 存储 Message 对象的数组 - [Message]
      this.getMessageList()
    })
  },
  methods: {
    moment,
    doctorName() {
      return localStorage.getItem('userName')
    },
    showDrawer(userID, userSig, toUser) {
      let promise = tim.login({ userID: userID, userSig: userSig })
      promise
        .then((imResponse) => {
          this.userID = userID
          this.toUser = toUser
          // console.log(imResponse.data) // 登录成功
          if (imResponse.data.repeatLogin === true) {
            // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
            // console.log(imResponse.data.errorInfo)
          }
          setTimeout(() => {
            this.getMessageList()
          }, 500)
        })
        .catch((imError) => {
          console.warn('login error:', imError) // 登录失败的相关信息
        })

      this.visible = true
    },
    sendMessage() {
      if (this.content) {
        // 发送文本消息，Web 端与小程序端相同
        // 1. 创建消息实例，接口返回的实例可以上屏
        console.log(this.toUser)
        let message = tim.createTextMessage({
          to: 'user0',
          conversationType: TIM.TYPES.CONV_C2C,
          // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
          // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
          // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
          payload: {
            text: this.content,
          },
        })
        // 2. 发送消息
        let promise = tim.sendMessage(message)
        promise
          .then((imResponse) => {
            // 发送成功
            console.log(imResponse)
            this.getMessageList()
            this.content = ''
          })
          .catch((imError) => {
            // 发送失败
            console.warn('sendMessage error:', imError)
          })
      }
    },
    getMessageList() {
      // 打开某个会话时，第一次拉取消息列表
      let promise = tim.getMessageList({ conversationID: `C2Cuser0`, count: 15 })
      promise.then((imResponse) => {
        console.log(imResponse)
        const messageList = imResponse.data.messageList // 消息列表。
        const nextReqMessageID = imResponse.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
        const isCompleted = imResponse.data.isCompleted // 表示是否已经拉完所有消息。
        this.messageList = messageList
      })
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      console.log(this.fileList)
      this.file = file
      console.log(this.file)
      this.sendImg()
      return false
    },
    sendImg() {
      // Web 端发送图片消息示例1 - 传入 DOM 节点
      // 1. 创建消息实例，接口返回的实例可以上屏
      let message = tim.createImageMessage({
        to: 'user0',
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
          this.getMessageList()
          this.fileList = []
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
.chat-content {
  width: 100%;
  height: 65vh;
  overflow-y: auto;
  padding: 20px;
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
  padding: 10px;
  font-size: 14px;
  float: left;
  background: rgb(194, 194, 194);
  position: relative;
  margin-top: 8px;
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
  max-width: 70%;
  padding: 10px;
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
</style>