/**
 * Mock 一键叫车派单结果
 * 司机张师傅、车牌京A12345、5 分钟到达
 */

export interface TaxiOrder {
  /** 订单号 */
  orderId: string
  /** 起点地址 */
  from: string
  /** 目的地 */
  to: string
  /** 司机姓名 */
  driverName: string
  /** 车牌号 */
  plateNumber: string
  /** 车型 */
  carModel: string
  /** 司机评分 */
  rating: number
  /** 预计到达分钟 */
  etaMinutes: number
  /** 司机电话 */
  driverPhone: string
  /** 司机头像 emoji */
  avatar: string
}

/** 常用地址列表 */
export interface FavoriteAddress {
  id: string
  label: string
  address: string
  icon: string
}

export const mockFavoriteAddresses: FavoriteAddress[] = [
  { id: 'addr-home', label: '回家', address: '北京市朝阳区幸福里小区 3 号楼', icon: '🏠' },
  { id: 'addr-hospital', label: '去医院', address: '北京协和医院(东院区)', icon: '🏥' },
  { id: 'addr-market', label: '去超市', address: '物美超市(幸福里店)', icon: '🛒' }
]

/** 根据目的地生成派单结果 */
export function generateTaxiOrder(to: string, toIcon: string): TaxiOrder {
  return {
    orderId: 'TX' + Date.now(),
    from: '北京市朝阳区幸福里小区 3 号楼',
    to,
    driverName: '张师傅',
    plateNumber: '京A12345',
    carModel: '蓝色 · 舒适型',
    rating: 4.9,
    etaMinutes: 5,
    driverPhone: '138-0000-1234',
    avatar: toIcon
  }
}
