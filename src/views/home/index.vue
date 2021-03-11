<template>
  <div class="home">
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
        <div class="logo" @click="toHome">
          <img v-if="orgUrl" src="../../assets/u56.png" alt="" srcset="">
          <img v-else :src="orgUrl" alt="" srcset="">
        </div>
        <a-menu theme="dark" mode="inline" :default-selected-keys="selectedKey" :selectedKeys="selectedKey" @click="selected" :default-open-keys="['sub1']">
          <!-- <a-menu-item key="1" title="经营概况" value="Business">
            <a-icon type="calendar" />
            <span>经营概况</span>
          </a-menu-item> -->
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="appstore" /><span>接诊台</span>
            </span>
            <a-menu-item key="2" title="接诊工作台" value="WorkPlace">
              <a-icon type="appstore" />
              <span>接诊工作台</span>
            </a-menu-item>
            <a-menu-item key="3" title="新开就诊" value="Admission">
              <a-icon type="folder-add" />
              <span>新开就诊</span>
            </a-menu-item>
            <a-menu-item key="5" title="检查工作台" value="CheckWorkplace">
              <a-icon type="file-search" />
              <span>检查工作台</span>
            </a-menu-item>
          </a-sub-menu>

          <a-menu-item key="4" title="收费管理" value="ManageCharge">
            <a-icon type="dollar" />
            <span>收费管理</span>
          </a-menu-item>

          <a-menu-item key="6" title="患者管理" value="ManagePatient">
            <a-icon type="user" />
            <span>患者管理</span>
          </a-menu-item>
          <a-sub-menu key="sub2">
            <span slot="title">
              <a-icon type="control" /><span>项目药品管理</span>
            </span>
            <a-menu-item key="8" title="药品信息设置" value="DrugInfoSet"> 药品信息设置 </a-menu-item>
            <a-menu-item key="9" title="检查项目设置" value="ProjectSet"> 检查项目设置 </a-menu-item>
          </a-sub-menu>
          <!-- <a-sub-menu key="sub3">
            <span slot="title">
              <a-icon type="bar-chart" /><span>统计报表</span>
            </span>
            <a-menu-item key="11" title="医生业绩统计" value="StatisticalReport"> 医生业绩统计 </a-menu-item>
          </a-sub-menu> -->
          <a-sub-menu key="sub4">
            <span slot="title">
              <a-icon type="setting" /><span>系统设置</span>
            </span>
            <a-menu-item key="13" title="病历信息维护" value="Maintain"> 病历信息维护 </a-menu-item>
            <a-menu-item key="14" title="模板维护" value="Template"> 模板维护 </a-menu-item>
            <a-menu-item key="18" title="员工管理" value="StaffManage"> 员工管理 </a-menu-item>
            <a-menu-item key="19" title="出诊设置" value="OutPatient"> 出诊设置 </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="17" title="操作日志" value="OperationLog">
            <a-icon type="audit" />
            <span>操作日志</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header :style="{
          zIndex: 10,
          background: '#fff',
          padding: 0,
        }">
          <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
          <div class="headerUser">
            <div>{{orgInfo.orgName}}</div>
            <a-dropdown :trigger="['click']">
              <a style="width:100px;color:rgba(0, 0, 0, 0.65);text-align:center;" class="ant-dropdown-link" @click="e => e.preventDefault()">
                切换
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-for="item in orgInfoList" :key="item.orgCode">
                  <a @click="changeOrg(item)">{{item.orgName}}</a>
                </a-menu-item>
                <a-divider />
              </a-menu>
            </a-dropdown>
            <a-dropdown>
              <span class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                <div>
                  <a-divider type="vertical" />
                  <div v-if="userInfo.photoUrl=='null'">
                    <img v-if="userInfo.userSex==2" style="width: 40px; height: 40px; border-radius: 50%" src="../../assets/p1.png" />
                    <img v-else style="width: 40px; height: 40px; border-radius: 50%" src="../../assets/p0.png" />
                  </div>
                  <div v-else>
                    <img style="width: 40px; height: 40px; border-radius: 50%" :src="userInfo.photoUrl" />
                  </div>
                  <span>{{userInfo.userName}}</span>
                </div>
              </span>
              <a-menu slot="overlay" @click="selected">
                <a-menu-item class="itemLink" key="15" title="修改密码" value="ChangePwd">
                  <a>修改密码</a>
                </a-menu-item>
                <a-menu-item class="itemLink" key="16" title="消息通知" value="Notification">
                  <a>消息通知</a>
                </a-menu-item>
                <a-menu-item class="itemLink">
                  <a @click="loginOut">退出系统</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-layout-header>
        <a-layout-content>
          <div class="content">
            <ContextMenu :itemList="menuItemList" :visible.sync="menuVisible" @select="onMenuSelect" />
            <a-tabs v-model="activeKey" hide-add type="editable-card" @edit="onEdit" @change="changeTabto" @contextmenu.native="e => onContextmenu(e)">
              <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
              </a-tab-pane>
            </a-tabs>
            <div class="cardBox">
              <router-view v-if="isRouterAlive" :collapsed="collapsed"></router-view>
            </div>
            <div class="contentBottom">Ant Design ©2018 Created by Ant UED</div>
          </div>
        </a-layout-content>
        <!-- <a-layout-footer style="textAlign: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer> -->
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import ContextMenu from '@/components/ContextMenu'
import { loginHospital, logout } from '@/api/login'
const panes = [
  {
    title: '接诊工作台',
    key: '2',
    name: 'WorkPlace',
    closable: false,
  },
]
export default {
  name: 'Home',
  components: {
    ContextMenu,
  },
  inject: ['reload'],
  provide() {
    return {
      reloadCard: this.reloadCard,
    }
  },
  data() {
    return {
      menuVisible: false,
      menuItemList: [{ key: '1', icon: 'close-circle', text: '关闭所有标签' }],
      userInfo: {},
      isRouterAlive: true,
      selectedKey: [],
      activeKey: '',
      activeTitle: '',
      activeName: '',
      panes,
      newTabIndex: 0,
      collapsed: false,
      opensubKey: [],
      orgUrl: '',
      orgInfo: {},
      orgInfoList: [],
    }
  },
  created() {
    this.orgInfo = JSON.parse(localStorage.getItem('orgInfo'))
    this.orgInfoList = JSON.parse(localStorage.getItem('orgInfoList'))
    this.orgUrl = localStorage.getItem('orgUrl')
    this.userInfo = {
      userName: localStorage.getItem('userName'),
      photoUrl: localStorage.getItem('photoUrl'),
      userSex: localStorage.getItem('userSex'),
    }
    if (this.$route.params.subKey) {
      this.opensubKey = this.$route.params.subKey
    }
  },
  mounted() {
    const rt = this.$route
    const activeTitle = rt.meta.title
    const activeKey = rt.meta.key
    const activeName = rt.meta.path
    if (activeKey == '2') {
      this.activeTitle = '接诊工作台'
      this.activeName = 'WorkPlace'
      this.activeKey = '2'
      this.selectedKey = ['2']
    } else {
      const panes = this.panes.filter((pane) => pane.key !== activeKey)
      panes.push({
        title: activeTitle,
        key: activeKey,
        name: activeName,
      })
      this.panes = panes
      this.activeTitle = activeTitle
      this.activeName = activeName
      this.activeKey = activeKey
      this.selectedKey = [activeKey]
    }
  },
  methods: {
    onMenuSelect(key, target) {
      this.closeAll()
    },
    onContextmenu(e) {
      e.preventDefault()
      this.menuVisible = true
    },
    closeAll() {
      const panes = this.panes.filter((pane) => pane.key == '2')
      this.panes = panes
      this.activeTitle = '接诊工作台'
      this.activeName = 'WorkPlace'
      this.activeKey = '2'
      this.selectedKey = ['2']
      this.$router.push({ name: 'WorkPlace' })
    },
    reloadCard() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    selected({ item, key }) {
      this.selectedKey = [key]
      if (!item.value) {
      } else if (this.panes.filter((pane) => pane.key == key).length !== 0) {
        const activeTitle = item.title
        const activeKey = key
        const activeName = item.value
        this.activeTitle = activeTitle
        this.activeName = activeName
        this.activeKey = activeKey
        this.$router.push({ name: activeName })
        if (this.selectedKey == '3') {
          // if (this.$route.params.page) {
          Object.assign(this.$route.params, { patientId: '', page: '', subKey: ['sub1'] })
          this.reloadCard()
          // }
        }
      } else {
        const panes = this.panes.filter((pane) => pane.key !== key)
        const activeTitle = item.title
        const activeKey = key
        const activeName = item.value
        panes.push({
          title: activeTitle,
          key: activeKey,
          name: activeName,
        })
        if (this.selectedKey == '3') {
          Object.assign(this.$route.params, { patientId: '', page: '', subKey: ['sub1'] })
          this.reloadCard()
        }
        this.panes = panes
        this.activeTitle = activeTitle
        this.activeName = activeName
        this.activeKey = activeKey
        this.$router.push({ name: activeName })
      }
    },
    callback(key) {
      // console.log(key)
    },
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    remove(targetKey) {
      let activeKey = this.activeKey
      let activeTitle = this.activeTitle
      let activeName = this.activeName
      let lastIndex
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1
        }
      })
      const panes = this.panes.filter((pane) => pane.key !== targetKey)
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key
          activeTitle = panes[lastIndex].title
          activeName = panes[lastIndex].name
          this.$router.push({ name: activeName, params: {} })
        } else {
          activeKey = panes[0].key
          activeTitle = panes[0].title
          activeName = panes[0].name
          this.$router.push({ name: activeName, params: {} })
        }
      }
      this.panes = panes
      this.activeKey = activeKey
      this.activeTitle = activeTitle
      this.activeName = activeName
      this.selectedKey = [activeKey]
    },
    changeTabto(key) {
      const panes = this.panes.filter((pane) => pane.key == key)
      this.selectedKey = [key]
      if (this.selectedKey == '3') {
        Object.assign(this.$route.params, { patientId: '', page: '', subKey: ['sub1'] })
        this.reloadCard()
      }

      this.$router.push({ name: panes[0].name })
    },
    toHome() {
      this.$router.push({ path: '/' })
      this.activeKey = '2'
      this.selectedKey = ['2']
    },
    changeOrg(item) {
      this.$confirm({
        title: '操作确认',
        centered: true,
        content: '确定要切换机构吗？',
        onOk: () => {
          loginHospital(item.orgCode)
            .then((res) => {
              if (res.success) {
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('orgInfo', JSON.stringify(item))
                this.reload()
                this.$message.success('切换成功')
              } else {
                this.$message.warning(res.message)
              }
            })
            .catch((err) => {})
        },
        onCancel() {},
      })
    },
    loginOut() {
      this.$confirm({
        title: '退出确认',
        centered: true,
        content: '确定要退出系统吗？',
        onOk: () => {
          logout().then((res) => {
            if (res.success) {
              localStorage.removeItem('token')
              window.document.title = '医生端'
              this.$router.push({ path: '/user/login' })
            } else {
              this.$message.error(res.message)
            }
          })
        },
        onCancel() {},
      })
    },
  },
}
</script>

<style lang="">
#components-layout-demo-custom-trigger {
  height: 100vh;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 42px;
  width: 42px;
  background: rgba(255, 255, 255);
  border-radius: 50%;
  margin: 16px auto;
  position: relative;
  cursor: pointer;
}
#components-layout-demo-custom-trigger .logo img {
  width: 100%;
  position: absolute;
  top: 6px;
}
/* .ant-menu.ant-menu-dark .ant-menu-item-selected,
.ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
  background-color: #656ee8;
} */
.ant-layout.ant-layout-has-sider > .ant-layout {
  overflow: auto;
  z-index: 99;
}

.headerUser {
  display: flex;
  margin-left: auto;
  margin-right: 20px;
  float: right;
  font-weight: bold;
  /* overflow: hidden; */
}
.headerUser img {
  margin-right: 10px;
}

/* .ant-dropdown-link .ant-divider {
  height: 65px;
} */
.ant-divider {
  margin: 0;
}
.ant-dropdown-link {
  width: 200px;
}
.ant-dropdown-link > div {
  display: flex;
  justify-content: space-around;
}
.itemLink {
  text-align: center;
}
.content {
  margin-top: 15px;
}
.cardBox {
  color: #000000;
  width: 98%;
  margin: 0 auto !important;
  position: relative;
}
.ant-tabs {
  overflow: visible;
  width: 98%;
  margin: 0 auto !important;
}
.ant-tabs-tab:hover {
  color: #656ee8 !important;
}
.ant-tabs-tab-active {
  color: #656ee8 !important;
}
/* .content .ant-tabs-bar {
  margin: 0;
} */
.contentBottom {
  height: 80px;
  text-align: center;
  line-height: 80px;
}
.contextmenu {
  width: 100px;
  margin: 0;
  border: 1px solid #ccc;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);
}
.contextmenu li {
  margin: 0;
  padding: 0px 22px;
}
.contextmenu li:hover {
  background: #f2f2f2;
  cursor: pointer;
}
.contextmenu li button {
  color: #2c3e50;
}
</style>
