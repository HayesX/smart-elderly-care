import { ReactNode } from 'react'
import './elder.css'

export interface ElderCardProps {
  title?: ReactNode
  content?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  accentLeft?: boolean
  className?: string
}

/**
 * 适老化卡片组件
 * 内边距 ≥ 16px,标题 ≥ 20px,正文 ≥ 18px,圆角 12px
 * 白底 + 1px 浅灰边框 + 轻微阴影
 */
export default function ElderCard({
  title,
  content,
  footer,
  children,
  accentLeft = false,
  className = ''
}: ElderCardProps) {
  const classes = ['elder-card', accentLeft ? 'accent-left' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {title && <div className="elder-card-title">{title}</div>}
      {content && <div className="elder-card-content">{content}</div>}
      {children}
      {footer && <div className="elder-card-footer">{footer}</div>}
    </div>
  )
}

/**
 * 字段行:用于在卡片内呈现「标签:值」结构
 */
export function FieldRow({
  label,
  value,
  large = false
}: {
  label: string
  value: ReactNode
  large?: boolean
}) {
  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <span className={`field-value ${large ? 'large' : ''}`}>{value}</span>
    </div>
  )
}
