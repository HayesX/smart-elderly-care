/**
 * Mock 安全预警记录
 * 预置 1 条"长时间未活动"模拟预警(今日 14:30,建议处置:电话确认)
 */

export type AlertLevel = 'info' | 'warning' | 'danger'
export type AlertStatus = 'resolved' | 'unresolved'

export interface SafetyAlert {
  id: string
  /** 预警类型 */
  type: string
  /** 预警级别 */
  level: AlertLevel
  /** 触发时间 YYYY-MM-DD HH:mm */
  time: string
  /** 详细描述 */
  description: string
  /** 建议处置 */
  suggestion: string
  /** 是否已处置 */
  status: AlertStatus
  /** 图标 */
  icon: string
}

export const mockSafetyAlerts: SafetyAlert[] = [
  {
    id: 'alert-001',
    type: '长时间未活动',
    level: 'warning',
    time: '2026-06-25 14:30',
    description: '检测到老人自 12:35 起客厅及卧室传感器无活动信号,持续约 2 小时。',
    suggestion: '建议立即电话确认老人状况;若连续 3 次未接通,联系社区上门查看。',
    status: 'unresolved',
    icon: '🛡️'
  }
]
