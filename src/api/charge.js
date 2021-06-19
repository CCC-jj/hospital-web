import request from "@/utils/request";

// 待收费订单查询
export function getQueryWait(params) {
  return request({
    url: "charge/query/wait",
    method: "post",
    data: params
  });
}

// 删除待收费订单
export function deleteUnpaidList(orderNo) {
  return request({
    url: "charge/unpaid/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      orderNo: orderNo
    }
  });
}

// 收银台
export function getCheckstand(orderNo) {
  return request({
    url: "charge/checkstand",
    method: "post",
    // headers: { "Content-Type": "x-www-form-urlencoded" },
    data: orderNo
  });
}

// 获取支付类型
export function getPaymentTypes() {
  return request({
    url: "charge/payment/types",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" }
  });
}

// 查询订单是否允许收费
export function getOrderQuery(orderNo) {
  return request({
    url: "charge/order/query",
    method: "post",
    // headers: { "Content-Type": "x-www-form-urlencoded" },
    data: orderNo
  });
}

// 收费
export function payCharge(params) {
  return request({
    url: "charge/pay",
    method: "post",
    data: params
  });
}

// 已收费订单查询
export function getQueryCompleted(params) {
  return request({
    url: "charge/query/completed",
    method: "post",
    data: params
  });
}

// 已收费订单基础信息查询
export function getPaidBaseInfo(orderNo, patientId) {
  return request({
    url: "charge/paid/base/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      orderNo: orderNo,
      patientId: patientId
    }
  });
}

// 已收费订单项目信息查询
export function getPaidItemInfo(orderNo) {
  return request({
    url: "charge/paid/item/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      orderNo: orderNo
    }
  });
}

// 退费确认信息
export function refundInfoConfirm(params) {
  return request({
    url: "charge/refund/confirm",
    method: "post",
    data: params
  });
}

// 订单退款
export function refundOrder(params) {
  return request({
    url: "charge/order/refund",
    method: "post",
    data: params
  });
}

// 已退款订单查询
export function getQueryRefund(params) {
  return request({
    url: "charge/query/refund",
    method: "post",
    data: params
  });
}

// 已退款订单项目信息查询
export function getRefundItemInfo(orderNo) {
  return request({
    url: "charge/refund/item/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      orderNo: orderNo
    }
  });
}

// export function closeDrug(id) {
//   return request({
//     url: "manage/drug/close/{id}",
//     method: "get",
//     headers: { "Content-Type": "x-www-form-urlencoded" },
//     params: {
//       id: id
//     }
//   });
// }
