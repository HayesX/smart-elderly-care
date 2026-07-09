/**
 * Mock 今日用药提醒计划
 * 预置今日 3 条用药提醒(早晨降压药、中午降糖药、晚上钙片)
 */

export type MedicineStatus = 'pending' | 'taken' | 'missed'

export interface MedicinePlanItem {
  id: string
  /** 药品名 */
  medicineName: string
  /** 类别 */
  category: string
  /** 提醒时间 HH:mm */
  time: string
  /** 剂量 */
  dosage: string
  /** 用药时机 */
  timing: string
  /** 当前状态 */
  status: MedicineStatus
  /** 图标 */
  icon: string
}

export const mockMedicinePlan: MedicinePlanItem[] = [
  {
    id: 'plan-001',
    medicineName: '硝苯地平缓释片',
    category: '降压药',
    time: '08:00',
    dosage: '1 片(10mg)',
    timing: '饭后服用',
    status: 'taken',
    icon: '💊'
  },
  {
    id: 'plan-002',
    medicineName: '二甲双胍片',
    category: '降糖药',
    time: '12:30',
    dosage: '1 片(0.5g)',
    timing: '饭中服用',
    status: 'taken',
    icon: '💊'
  },
  {
    id: 'plan-003',
    medicineName: '碳酸钙 D3 片',
    category: '钙片',
    time: '19:00',
    dosage: '1 片(600mg)',
    timing: '饭后服用',
    status: 'pending',
    icon: '💊'
  }
]
