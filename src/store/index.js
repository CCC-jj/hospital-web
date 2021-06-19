/**
 * 步骤一
 * vuex 入口文件
 */
// 引入 vue
import Vue from "vue";
// 引入 vuex
import Vuex from "vuex";

// import actions from './actions'
// import mutations from './mutations'

Vue.use(Vuex);

// 导出
const store = new Vuex.Store({
  // modules: {
  //   mutations
  // },
  // actions
  state: {
    news: false,
    conversationID: "",
    messageList: [],
    conversationList: [],
    newsNum: 0
  },
  mutations: {
    changeNews(state, value) {
      state.news = value;
    },
    changeConversationID(state, value) {
      state.conversationID = value;
    },
    changeMessageList(state, value) {
      state.messageList = value;
    },
    pushMessageList(state, value) {
      state.messageList.push(value);
    },
    concatMessageList(state, value) {
      state.messageList = value.concat(state.messageList);
    },
    // 收到消息
    onMessageReceived(state, event) {
      console.log(event.data);
      let text = event.data[0].payload.text
        ? event.data[0].payload.text
        : "自定义消息";
      Vue.prototype.$notification.open({
        message: "你有一条新消息",
        top: "50px",
        duration: 2,
        description: `来自：${event.data[0].nick}；消息内容：${text}`
        // "来自:" + event.data[0].nick + " --- " + "消息内容: " + text
      });
      state.newsNum++;
      // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
      // event.name - TIM.EVENT.MESSAGE_RECEIVED
      // event.data - 存储 Message 对象的数组 - [Message]
      if (event.data[0].conversationID == state.conversationID) {
        state.messageList.push(event.data[0]);
        if (event.data[0].flow === "in") {
          state.news = true;
        }
      }
    },
    setConversationList(state, value) {
      state.conversationList = value;
    },
    removeConversationList(state, value) {
      state.conversationList.filter(
        item => item.conversationID === value.conversationID
      );
      console.log(state.conversationList);
    }
  }
});

export default store;
