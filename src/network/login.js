import {request} from "./request";

export function getLoginData(quary) {
  return request({
    url: '/login',
    params: quary
  })
}
