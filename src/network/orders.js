import {request} from "./request";

//获取订单数据列表的方法，其中query和elseInfo都可以为空
export function getOrdersData(queryInfo,elseInfo) {
  return request({
    url: `/orders`,
    params: Object.assign(queryInfo,elseInfo)
  })
}
//根据快递单号获取物流信息的方法
export function getLogisticsInfo(expressId) {
  return request({
    url: `/kuaidi/${expressId}`,
  })
}
