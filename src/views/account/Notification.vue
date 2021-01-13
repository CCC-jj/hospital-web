<template>
  <div class="notification">
    <a-button class="infoBtn">业务消息</a-button>
    <hr class="exportLine" />
    <div class="infoBox">
      <a-list class="listTap" item-layout="horizontal" :data-source="data" :pagination="{showQuickJumper:true,total:20,showTotal: ((total) => {
        return `每页10条，共 ${total} 条`;
      })}">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-list-item-meta description="新增一条入库信息 操作人：王冕">
            <a class="title" slot="title">业务消息<span class="timeInfo">2020/09/04 10:08:09</span></a>
            <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          </a-list-item-meta>
					<div class="infoPoint">●</div>
					<div class="infoRight"><a-icon type="right" /></div>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script>
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
]
export default {
  data() {
    return {
      data,
    }
  },
}
</script>

<style scoped>
.notification {
  position: relative;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
}
.infoBtn {
	width: 100px;
  background-color: #656ee8;
  color: #ffffff;
  font-weight: bold;
  border: none;
}
.infoBtn:hover{
  background-color: #656ee8;
  color: #ffffff;
}
.infoBtn:focus{
  background-color: #656ee8;
  color: #ffffff;
}
.exportLine {
  border: 1px solid rgb(241, 241, 241);
  margin-top: 20px;
  margin-bottom: 25px;
}
.listTap{
	cursor: pointer;
}
.title{
	font-size: 16px;
	color: #000000;
}
.timeInfo{
	font-size: 14px;
	margin-left: 15px;
	color: #919191;
}
.infoPoint{
	font-size: 22px;
	color: rgb(255,98,98);
	font-weight: bold;
	margin-right: 8px;
}
.infoRight{
	font-size: 16px;
	color: #919191;
	line-height: 14px;
}
</style>