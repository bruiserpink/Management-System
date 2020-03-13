import {request} from "./request";

//获取商品列表的方法
export function getGoodsListData(queryInfo) {
  return request({
    url: '/goods',
    params: queryInfo
  })
}
//删除商品的方法
export function deleteGoods(goodsId) {
  return request({
    url: `/goods/${goodsId}`,
    method: 'delete',
  })
}
//同步商品属性的方法
export function putGoodsAttr(goodsId) {
  return request({
    url: `goods/${goodsId}/attributes`,
    method: 'put',
  })
}
//提交编辑后的商品数据的方法
export function putEditGoodsInfo(goodsInfo) {
  return request({
    url: `goods/${goodsInfo.goods_id}`,
    method: 'put',
    data: {
      goods_name: goodsInfo.goods_name,
      goods_price: goodsInfo.goods_price,
      goods_number: goodsInfo.goods_number,
      goods_weight: goodsInfo.goods_weight,
      goods_cat: goodsInfo.cat_id
    }
  })
}
