import {request} from "./request";

export  function  putNewGoodsInfo(queryInfo) {
  return request({
    url: '/goods',
    method: 'post',
    data: queryInfo
  })
}
