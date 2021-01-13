<template>
  <div class="business">
    <a-row type="flex" justify="space-between">
      <a-col span="7">
        <a-card class="my-card" :bordered="false">
          <div class="my-card-item"><span class="number">56</span></div>
          <div class="my-card-item long">
            <div class="long-title">今日挂号人次</div>
            <div>
              <img class="point" src="@/assets/trending_flat_u254.png" />
              <span>较昨日上涨 20%</span>
            </div>
          </div>
          <div class="flex-center my-card-item__tu my-card-item__tu1">
            <img class="my-card-item" src="@/assets/assignment_u258.png" />
          </div>
        </a-card>
      </a-col>
      <a-col span="7">
        <a-card class="my-card" :bordered="false">
          <div class="my-card-item"><span class="number">56</span></div>
          <div class="my-card-item long">
            <div class="long-title">今日接诊人次</div>
            <div>
              <img class="point" src="@/assets/trending_flat_u271.png" />
              <span>较昨日上涨 20%</span>
            </div>
          </div>
          <div class="flex-center my-card-item__tu my-card-item__tu2">
            <img class="my-card-item" src="@/assets/supervisor_account_u275.png" />
          </div>
        </a-card>
      </a-col>
      <a-col span="7">
        <a-card class="my-card" :bordered="false">
          <div class="my-card-item"><span class="number">56</span></div>
          <div class="my-card-item long">
            <div class="long-title">今日收入合计</div>
            <div>
              <img class="point" src="@/assets/trending_flat_u291.png" />
              <span>较昨日上涨 20%</span>
            </div>
          </div>
          <div class="flex-center my-card-item__tu my-card-item__tu3">
            <img class="my-card-item" src="@/assets/account_balance_wallet_u283.png" />
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="24" class="col-chart">
        <div>
          <div class="col-chart__top">
            <div class="col-chart__title">医院收入趋势</div>
          </div>
          <v-chart :options="options" autoresize theme="light" class="chart"></v-chart>
        </div>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="24" class="col-chart">
        <div>
          <div class="col-chart__top">
            <div class="col-chart__title">今日门诊记录</div>
          </div>
          <a-table :columns="columns" :data-source="data" class="table" :bordered="false">
            <a slot="id" slot-scope="text">{{ text }}</a>
            <span slot="tags" slot-scope="tags">
              {{ tags }}
            </span>
            <span slot="action">
              <a>Delete</a>
            </span>
          </a-table>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: 'id',
    key: 'id',
    title: '序号',
  },

  {
    title: '就诊状态',
    dataIndex: 'age',
    key: 'attendance_status',
  },

  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: {
      customRender: 'tags',
    },
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: {
      customRender: 'action',
    },
  },
]

const data = [
  {
    key: '1',
    id: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    id: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    id: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]
// import echarts from 'echarts'
import * as echarts from 'echarts'
export default {
  // watch: {
  //   ss: {
  //     handler() {},
  //     immediate: true,
  //   },
  // },
  data() {
    return {
      data,
      columns,
      options: {
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter:
            '<div style="width:100px;text-align: center;color: #fff;">{b0}<br /> {c0}</div>',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          splitLine: {
            show: false, //去掉网格线
          },
        },
        yAxis: {
          type: 'value',
          boundaryGap: false,
          splitLine: {
            show: false, //去掉网格线
          },
        },

        grid: {
          left: '3%',
        },
        series: [
          {
            name: '样例3',
            type: 'line',
            symbol: 'emptyCircle',
            symbolSize: 15, //折线点的大小
            itemStyle: {
              color: '#6A5ACD',
              normal: {
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 4,
                  type: 'solid',
                  color: '#0000FF',
                },
              },
              emphasis: {
                color: '#6A5ACD',
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 2,
                  type: 'dotted',
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#1E90FF',
                    },
                    {
                      offset: 1,
                      color: '#0000FF',
                    },
                  ]),
                },
              },
            }, //线条样式
            areaStyle: {
              // color: "rgba(197,200,246,1)",
              normal: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(197,200,246,1)',
                  },
                  {
                    offset: 0.34,
                    color: 'rgba(197,200,246,0.7)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(197,200,246,0.1)',
                  },
                ]),
              },
            }, //区域颜色渐变
            data: [450, 432, 401, 454, 590, 530, 110, 242],
          },
        ],
      },
    }
  },
}
</script> 

<style scoped>
body /deep/ .ant-layout-content {
  overflow-y: scroll !important;
}

.business {
  width: 100%;
  /* height: 100%; */
  background-color: #fff;
  position: relative;
  border-radius: 5px;
  margin: 0 auto !important;
  padding: 24px;
}

.business::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}

.business {
  scrollbar-width: none;
  /* firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
}

.business /deep/ .ant-card-body {
  display: flex;
  width: 100%;
  padding: 20px;
}

.my-card {
  box-shadow: 0px 0px 10px 5px rgba(242, 242, 242, 0.5);
  border-radius: 10px;
}

.number {
  font-size: 44px;
  font-weight: 600;
}

.long {
  flex: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 15px;
}

.long-title {
  align-self: flex-start;
}

.point {
  transform: rotate(270deg);
}

.flex-center {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.my-card-item > img {
  width: 50px;
  height: 50px;
}

.my-card-item__tu {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.my-card-item__tu1 {
  background: #f0f1fd;
}

.my-card-item__tu2 {
  background: #fff0f0;
}

.my-card-item__tu3 {
  background: #eafaf5;
}

.echarts {
  width: 105%;
  height: 300px;
}

.col-chart {
  border-radius: 8px;
  box-shadow: 0px 0px 10px 5px rgba(242, 242, 242, 0.5);
  margin-top: 30px;
  padding: 20px;
  position: relative;
}

.col-chart::before {
  content: ' ';
  display: block;
  position: absolute;
  height: 1px;
  width: 100%;
  background: #ccc;
  top: 60px;
  left: 0;
}

.col-chart__title {
  font-size: 18px;
  font-weight: 600;
}

.table {
  margin-top: 40px;
}

.table /deep/ .ant-table-thead > tr > th {
  background: #fff;
}

.table /deep/ .ant-table-thead > tr > th {
  color: #999;
  font-weight: 600;
}

.table /deep/ .ant-table-tbody > tr > td {
  border: none;
}

.table /deep/ .ant-table-row {
  margin: 5px 0;
  box-shadow: 0px 0px 10px 3px rgba(242, 242, 242, 0.5);
}

.table /deep/ .ant-table table {
  border-collapse: separate;
  border-spacing: 0px 10px;
}

.table /deep/ .ant-table-thead > tr > th {
  padding: 0 16px;
  border: none;
}

.table /deep/ .ant-pagination-item {
  border-radius: 50%;
}

.table /deep/ .ant-pagination-item-link {
  border-radius: 50%;
}
</style>
