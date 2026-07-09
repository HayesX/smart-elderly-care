import { ButtonHTMLAttributes, ReactNode } from 'react'
import './elder.css'

export type ElderButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ElderButtonSize = 'md' | 'lg' | 'xl'

export interface ElderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ElderButtonVariant
  size?: ElderButtonSize
  full?: boolean
  icon?: ReactNode
  children?: ReactNode
}

/**
 * 适老化大按钮组件
 * 默认尺寸 ≥ 48px,字号 ≥ 18px,圆角 8px,主色 #e8734a
 * 老人端主操作建议使用 size="xl"
 */
export default function ElderButton({
  variant = 'primary',
  size = 'lg',
  full = false,
  icon,
  children,
  className = '',
  type = 'button',
  ...rest
}: ElderButtonProps) {
  const classes = [
    'elder-btn',
    `variant-${variant}`,
    `size-${size}`,
    full ? 'is-full' : '',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {icon && <span className="elder-btn-icon" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}
