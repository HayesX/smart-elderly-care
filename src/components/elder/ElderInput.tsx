import { InputHTMLAttributes } from 'react'
import './elder.css'

export interface ElderInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  value: string
  onChange: (value: string) => void
  onVoiceClick?: () => void
  voiceSupported?: boolean
  voiceListening?: boolean
}

/**
 * 适老化输入组件
 * 高度 ≥ 48px,字号 ≥ 18px
 * 右侧带语音输入按钮(不支持语音时隐藏,自动降级为纯文字输入)
 */
export default function ElderInput({
  label,
  value,
  onChange,
  onVoiceClick,
  voiceSupported = false,
  voiceListening = false,
  placeholder,
  ...rest
}: ElderInputProps) {
  return (
    <div>
      {label && (
        <label className="elder-input-label" htmlFor={rest.id}>
          {label}
        </label>
      )}
      <div className="elder-input-wrap">
        <input
          {...rest}
          className="elder-input"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {voiceSupported && (
          <button
            type="button"
            className={`voice-btn ${voiceListening ? 'listening' : ''}`}
            onClick={onVoiceClick}
            aria-label={voiceListening ? '正在听,点击停止' : '点击语音输入'}
            aria-pressed={voiceListening}
          >
            {voiceListening ? '■' : '🎤'}
          </button>
        )}
      </div>
    </div>
  )
}
