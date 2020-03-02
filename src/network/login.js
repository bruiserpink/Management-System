import {request} from "./request";

export function getLoginData(quary) {
  return request({
    method: "post",
    url: '/login',
    params: quary
  })
}
