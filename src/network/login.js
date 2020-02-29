import {request} from "./request";

export function getLoginData(quary) {
  return request({
    type: "post",
    url: '/login',
    params: quary
  })
}
