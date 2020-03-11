import {request} from "./request";

export function getReportsData() {
  return request({
    url: 'reports/type/1'
  })
}
