import {request} from "./request";

export function getGoodsListData(queryInfo) {
  return request({
    url: '/goods',
    params: queryInfo
  })
}
export function deleteGoods(goodsId) {
  return request({
    url: `/goods/${goodsId}`,
    method: 'delete',
  })
}
