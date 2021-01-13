import request from "@/utils/request";

// 获取处方分类
export function getRecipelCategory() {
  return request({
    url: "common/getRecipelCategory",
    method: "get"
  });
}

// 根据处方分类获取药品分类
export function getDrugCategory(catId) {
  return request({
    url: "common/getDrugCategory",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      catId: catId
    }
  });
}

// 获取医嘱用法
export function getAdviceUsage(key) {
  return request({
    url: "common/getAdviceUsage",
    method: "get",
    params: key
  });
}

// 获取医嘱执行频率
export function getAdviceFrequency(key) {
  return request({
    url: "common/getAdviceFrequency",
    method: "get",
    params: key
  });
}

// 获取身体部位
export function getBodyPart(key) {
  return request({
    url: "common/getBodyPart",
    method: "get",
    params: {
      key: key
    }
  });
}

// 接诊状态
export function getTreatState() {
  return request({
    url: "common/treat/state",
    method: "get"
  });
}

// 问诊类型
export function getTreatTypes() {
  return request({
    url: "common/treat/types",
    method: "get"
  });
}

// 获取省列表
export function getProvinceList() {
  return request({
    url: "area/getProvinceList",
    method: "get"
  });
}

// 获取市列表
export function getCityList(provinceCode) {
  return request({
    url: "area/getCityList",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      provinceCode: provinceCode
    }
  });
}

//获取婚姻状况编码
export function getMaritalList() {
  return request({
    url: "common/marital",
    method: "get"
  });
}

//获取职业编码
export function getProfessionList() {
  return request({
    url: "common/profession",
    method: "get"
  });
}

//获取性别编码
export function getSexList() {
  return request({
    url: "common/sex",
    method: "get"
  });
}

//获取学历编码
export function getEducationList() {
  return request({
    url: "common/education",
    method: "get"
  });
}

// 获取订单类型
export function getOrderTypes() {
  return request({
    url: "common/order/type",
    method: "get"
  });
}