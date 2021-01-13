import request from "@/utils/request";

export function getDrugList(params) {
  return request({
    url: "manage/drug/list",
    method: "post",
    data: params
  });
}

export function closeDrug(id) {
  return request({
    url: "manage/drug/close/{id}",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      id: id
    }
  });
}

export function syncDrugs() {
  return request({
    url: "manage/drug/sync",
    method: "get",
    // headers: { "Content-Type": "x-www-form-urlencoded" },
  });
}

export function importDrugs() {
  return request({
    url: "manage/drug/import",
    method: "get",
    // headers: { "Content-Type": "x-www-form-urlencoded" },
  });
}