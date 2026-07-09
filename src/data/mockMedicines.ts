/**
 * Mock 药品识别结果数据
 * 包含 3 种常见药品:降压药 / 降糖药 / 钙片
 * Demo 阶段不接入真实 OCR,上传图片后随机/顺序返回一条
 */

export interface Medicine {
  id: string
  /** 药品名 */
  name: string
  /** 类别(降压药/降糖药/钙片) */
  category: string
  /** 剂量 */
  dosage: string
  /** 服用频次 */
  frequency: string
  /** 用药时机(饭前/饭后/饭中) */
  timing: string
  /** 注意事项 */
  precaution: string
  /** 有效期 */
  expireDate: string
  /** 图标 emoji */
  icon: string
  /** 标签颜色 */
  color: string
}

export const mockMedicines: Medicine[] = [
  {
    id: 'med-001',
    name: '硝苯地平缓释片',
    category: '降压药',
    dosage: '每次 1 片(10mg)',
    frequency: '一日一次',
    timing: '饭后服用',
    precaution: '不可掰开或嚼碎,需整片吞服;服药期间避免食用葡萄柚或饮用葡萄柚汁。',
    expireDate: '2027-08-31',
    icon: '💊',
    color: '#e8734a'
  },
  {
    id: 'med-002',
    name: '二甲双胍片',
    category: '降糖药',
    dosage: '每次 1 片(0.5g)',
    frequency: '一日两次',
    timing: '饭中服用',
    precaution: '随餐服用可减少胃肠不适;用药期间忌饮酒;如出现恶心腹泻请告知医生。',
    expireDate: '2027-05-15',
    icon: '💊',
    color: '#2e7d32'
  },
  {
    id: 'med-003',
    name: '碳酸钙 D3 片',
    category: '钙片',
    dosage: '每次 1 片(600mg)',
    frequency: '一日一次',
    timing: '饭后服用',
    precaution: '建议晚饭后服用,有助于吸收;避免与浓茶、咖啡同服;多晒太阳效果更好。',
    expireDate: '2028-01-20',
    icon: '💊',
    color: '#1976d2'
  }
]

/** 顺序返回下一条药品(用于"上传示例图"模拟识别) */
let cursor = 0
export function getNextMockMedicine(): Medicine {
  const med = mockMedicines[cursor % mockMedicines.length]
  cursor += 1
  return med
}

/** 随机返回一条药品 */
export function getRandomMockMedicine(): Medicine {
  return mockMedicines[Math.floor(Math.random() * mockMedicines.length)]
}
