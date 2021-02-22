import request from "@/utils/request";

// 获取userSig
export function getUserSig(orderNo) {
  return request({
    url: "doctor/im/userSig",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      orderNo: orderNo
    }
  });
}