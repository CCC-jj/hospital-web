import request from "@/utils/request";

// 非订单获取医生userSig
export function getUserSig() {
  return request({
    url: "doctor/im/query/sign",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
  });
}

// 获取userSig
export function getUserSigbyOrder(orderNo) {
  return request({
    url: "doctor/im/userSig",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      orderNo: orderNo
    }
  });
}

// 获取接诊信息
export function getOrderInfo(accountNo) {
  return request({
    url: "doctor/im/order",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      accountNo: accountNo
    }
  });
}
