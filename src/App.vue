<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <router-view v-if="isRouterAlive" />
    </div>
  </a-config-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload,
    }
  },
  data() {
    return {
      zh_CN,
      isRouterAlive: true,
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}
/* .ant-btn:focus{
  color: not specified !important;
  background: none !important;
} */
.ant-input[disabled] {
  color: rgba(0, 0, 0, 0.65) !important;
}
.ant-select-disabled {
  color: rgba(0, 0, 0, 0.65) !important;
}
.ant-btn-primary {
  background-color: #656ee8 !important;
  border: 1px solid #656ee8 !important;
}
.ant-btn-primary:hover {
  background-color: #7b82e2 !important;
  border: 1px solid #7b82e2 !important;
}
.ant-btn-primary[disabled] {
  background-color: rgb(245, 245, 245) !important;
  border: 1px solid #dcdcdc !important;
}
.ant-menu.ant-menu-dark .ant-menu-item-selected,
.ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
  background-color: #656ee8 !important;
}
.ant-dropdown-link .ant-divider {
  height: 65px;
}
.content .ant-tabs-bar {
  margin: 0;
}
.changebgInput .ant-input {
  background-color: #f0f1fd;
  border: 1px solid #f0f1fd;
  padding-bottom: 10px;
  font-size: 14px;
  padding-left: 40px !important;
}
.changebgSelect .ant-select-selection {
  font-size: 14px;
  color: #2c2c2c;
  background-color: #f0f1fd;
  border: 1px solid #f0f1fd;
}
.ant-input-search-button {
  background-color: #656ee8 !important;
  border: none !important;
}
.ant-input-search-button:hover {
  background-color: #656ee8 !important;
  border: none !important;
}
.ant-modal {
  color: #000000;
}
.leftTable .ant-table-thead > tr > th,
.leftTable .ant-table-tbody > tr > td {
  padding: 16px 3px !important;
  font-size: 13px;
  color: #000000;
}
.leftTable .ant-table-thead > tr > th {
  font-weight: bold;
  background-color: rgb(224, 226, 250);
}
.rightBoxMiddle .ant-table-thead > tr > th,
.rightBoxMiddle .ant-table-tbody > tr > td {
  padding: 10px 5px !important;
  font-size: 13px;
  color: #000000;
}
.rightBoxMiddle .ant-table-thead > tr > th {
  font-weight: bold;
  background-color: #ffffff;
  border-bottom: 2px solid rgb(231, 231, 231);
}
.rightBoxMiddle .ant-table-tbody > tr > td {
  padding: 9px 5px !important;
}
.preBoxTop .ant-tabs-bar {
  border-bottom: 0;
}
.preBoxTop .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  height: 35px;
  line-height: 35px;
  border-radius: 4px !important;
  border: 1px solid #e8e8e8 !important;
}
.preBoxTop .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  border: 1px solid #656ee8 !important;
}

.manageDown .ant-table-thead > tr > th,
.manageDown .ant-table-tbody > tr > td {
  padding: 20px 5px !important;
  color: #000000;
  text-align: center;
}
.manageDown .ant-table-thead > tr > th {
  font-weight: bold;
  background-color: rgb(194, 197, 246);
  border: none;
}

.transferPrBottom .ant-table-thead > tr > th,
.transferPrBottom .ant-table-tbody > tr > td {
  padding: 16px 5px !important;
  color: #000000;
  background-color: #ffffff;
}
.transferPrBottom .ant-table-thead > tr > th {
  font-weight: bold;
  color: #6b6b6b;
}
.transferPrBottom .ant-table-tbody > tr > td {
  padding: 12px 5px !important;
}
.authority span.ant-radio + * {
  padding-left: 0;
}
.addPriceModal .ant-table-thead > tr > th,
.addPriceModal .ant-table-tbody > tr > td {
  padding: 10px 5px !important;
  font-size: 13px;
  color: #000000;
}
.addPriceModal .ant-table-thead > tr > th {
  font-weight: bold;
  background-color: #ffffff;
}
.detailTable .ant-table-thead > tr > th,
.detailTable .ant-table-tbody > tr > td {
  padding: 10px 3px !important;
  font-size: 14px;
  color: #000000;
}
.detailTable .ant-table-thead > tr > th {
  font-weight: bold;
  background-color: rgb(224, 226, 250);
  border: none;
}
.projectDetail .ant-tabs-bar {
  border-bottom: 2px solid rgb(242, 242, 242);
  height: 30px;
}
.projectDetail .ant-tabs-tab-active {
  background-color: #656ee8 !important;
  color: #ffffff !important;
}
.projectDetail .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  color: #000000;
  border: none !important;
  background-color: rgb(242, 242, 242);
  height: 30px;
  line-height: 30px;
}
.projectDetail .ant-tabs-tab:hover {
  background-color: #656ee8 !important;
  color: #ffffff !important;
}
.redLabel label {
  color: red;
}
</style>
