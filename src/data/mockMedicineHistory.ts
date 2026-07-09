/**
 * Mock 近 7 天用药历史(已服/漏服状态)
 * 用于子女端用药看板展示
 */

import type { MedicineStatus } from './mockMedicinePlan'

export interface MedicineHistoryDay {
  /** 日期 YYYY-MM-DD */
  date: string
  /** 周几 */
  weekday: string
  /** 当日应服次数 */
  total: number
  /** 当日已服次数 */
  taken: number
  /** 当日漏服次数 */
  missed: number
  /** 整体状态(用于日历格点颜色) */
  status: MedicineStatus | 'partial'
  /** 漏服药品(可空) */
  missedMeds?: string[]
}

export const mockMedicineHistory: MedicineHistoryDay[] = [
  { date: '2026-06-19', weekday: '周四', total: 3, taken: 3, missed: 0, status: 'taken' },
  { date: '2026-06-20', weekday: '周五', total: 3, taken: 2, missed: 1, status: 'partial', missedMeds: ['碳酸钙 D3 片'] },
  { date: '2026-06-21', weekday: '周六', total: 3, taken: 3, missed: 0, status: 'taken' },
  { date: '2026-06-22', weekday: '周日', total: 3, taken: 1, missed: 2, status: 'missed', missedMeds: ['二甲双胍片', '碳酸钙 D3 片'] },
  { date: '2026-06-23', weekday: '周一', total: 3, taken: 3, missed: 0, status: 'taken' },
  { date: '2026-06-24', weekday: '周二', total: 3, taken: 3, missed: 0, status: 'taken' },
  { date: '2026-06-25', weekday: '今日', total: 3, taken: 2, missed: 0, status: 'partial' }
]
