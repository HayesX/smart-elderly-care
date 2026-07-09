import { useEffect, useRef, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import ElderButton from '../../components/elder/ElderButton'
import { speak, isTTSSupported } from '../../utils/speech'

/**
 * SOS 紧急求助页(/elder/sos)
 * 超大红色"长按 3 秒确认呼叫"按钮(≥64px)+ 取消按钮
 * + 演示态提示文字"演示模式,不会真实呼叫"
 */
const HOLD_SECONDS = 3

export default function SosPage() {
  const [pressing, setPressing] = useState(false)
  const [progress, setProgress] = useState(0) // 0 ~ 1
  const [called, setCalled] = useState(false)
  const timerRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const clearTimers = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  useEffect(() => {
    return clearTimers
  }, [])

  const startPress = () => {
    if (called) return
    setPressing(true)
    startTimeRef.current = Date.now()

    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const p = Math.min(elapsed / HOLD_SECONDS, 1)
      setProgress(p)
      if (p >= 1) {
        triggerCall()
        return
      }
      rafRef.current = window.requestAnimationFrame(tick)
    }
    rafRef.current = window.requestAnimationFrame(tick)
  }

  const endPress = () => {
    setPressing(false)
    clearTimers()
    if (!called) {
      setProgress(0)
    }
  }

  const triggerCall = () => {
    clearTimers()
    setPressing(false)
    setProgress(1)
    setCalled(true)
    if (isTTSSupported()) {
      speak('正在通知您的家人和紧急联系人。王奶奶别怕,小助一直陪着您。')
    }
  }

  const reset = () => {
    setCalled(false)
    setProgress(0)
    setPressing(false)
  }

  // 圆环进度参数
  const ringRadius = 110
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference * (1 - progress)

  return (
    <div className="page-container">
      <PageHeader title="SOS 紧急求助" backTo="/elder" />

      <div className="sos-page">
        <div className="sos-tip">
          ⚠️ 演示模式,不会真实呼叫。仅用于展示流程。
        </div>

        {!called ? (
          <>
            <button
              type="button"
              className={`sos-btn-big ${pressing ? 'pressing' : ''}`}
              onMouseDown={startPress}
              onMouseUp={endPress}
              onMouseLeave={endPress}
              onTouchStart={(e) => {
                e.preventDefault()
                startPress()
              }}
              onTouchEnd={endPress}
              aria-label="长按 3 秒确认呼叫"
            >
              <svg
                className="sos-progress-ring"
                viewBox="0 0 240 240"
                aria-hidden="true"
              >
                <circle
                  cx="120"
                  cy="120"
                  r={ringRadius}
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                />
              </svg>
              <span className="sos-icon" aria-hidden="true">
                🆘
              </span>
              <span>长按 {HOLD_SECONDS} 秒</span>
              <span style={{ fontSize: 18, fontWeight: 600, opacity: 0.9 }}>
                {pressing
                  ? `继续按住 ${Math.ceil(HOLD_SECONDS * (1 - progress))} 秒`
                  : '确认呼叫'}
              </span>
            </button>

            <div className={`sos-status ${pressing ? 'active' : ''}`}>
              {pressing
                ? '正在确认呼叫,请继续按住'
                : '遇到紧急情况,长按上方按钮 3 秒呼叫'}
            </div>

            <ElderButton
              size="lg"
              variant="ghost"
              className="sos-cancel"
              onClick={() => {
                setProgress(0)
                setPressing(false)
              }}
            >
              取消
            </ElderButton>
          </>
        ) : (
          <>
            <div className="sos-btn-big" style={{ background: 'var(--color-success)', boxShadow: '0 0 0 4px var(--color-success), 0 12px 32px rgba(46, 125, 50, 0.4)' }}>
              <span className="sos-icon" aria-hidden="true">
                ✓
              </span>
              <span>已发出求助</span>
            </div>

            <div className={`sos-status active`} style={{ color: 'var(--color-success)' }}>
              正在通知您的家人和紧急联系人
            </div>

            <div className="sos-called-banner">
              ✅ 求助信号已发送<br />
              · 已通知儿子(王明)138-0000-1234<br />
              · 已通知社区幸福里服务站<br />
              · 已拨打 120 急救中心(演示)<br />
              <br />
              王奶奶别怕,小助一直陪您,家人马上就到。
            </div>

            <ElderButton
              size="lg"
              variant="secondary"
              className="sos-cancel"
              onClick={reset}
            >
              我没事了,取消求助
            </ElderButton>
          </>
        )}
      </div>
    </div>
  )
}
