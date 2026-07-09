import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import ElderButton from '../../components/elder/ElderButton'
import { mockSafetyAlerts, type SafetyAlert } from '../../data/mockSafetyAlerts'

/**
 * 安全状态页(/family/safety)
 * 预警记录时间线列表(1 条长时间未活动预警)
 * + 一键回拨按钮
 */
export default function SafetyPage() {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState<SafetyAlert[]>(mockSafetyAlerts)
  const [called, setCalled] = useState(false)

  const handleCallBack = (id: string) => {
    setCalled(true)
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a))
    )
    // 演示:2 秒后"电话接通"
    setTimeout(() => {
      setCalled(false)
    }, 2000)
  }

  return (
    <div>
      <div className="no-print">
        <PageHeader title="安全状态" backTo="/family" />
      </div>

      <div style={{ padding: '0 4px 48px' }}>
        {/* 顶部状态卡 */}
        <div className="parent-status-card" style={{ marginBottom: 16 }}>
          <div className="parent-name">🛡️ 居家安全监测</div>
          <div className="parent-sub">行为模式 · 异常检测 · 紧急通知</div>
          <div className="status-grid-3" style={{ marginTop: 12 }}>
            <div className="status-cell">
              <div className="sc-icon" aria-hidden="true">📡</div>
              <div className="sc-label">传感器</div>
              <div className="sc-value">在线</div>
            </div>
            <div className="status-cell">
              <div className="sc-icon" aria-hidden="true">🚶</div>
              <div className="sc-label">最近活动</div>
              <div className="sc-value">14:35</div>
            </div>
            <div className="status-cell warn">
              <div className="sc-icon" aria-hidden="true">⚠️</div>
              <div className="sc-label">待处置</div>
              <div className="sc-value">{alerts.filter(a => a.status === 'unresolved').length} 条</div>
            </div>
          </div>
        </div>

        {/* 预警时间线 */}
        <div className="section-title">预警记录</div>
        {alerts.length === 0 ? (
          <div className="alert-card" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">✓</div>
            <div>暂无预警记录,一切正常</div>
          </div>
        ) : (
          <div className="timeline">
            {alerts.map((alert) => (
              <div key={alert.id} className={`timeline-item ${alert.level === 'danger' ? 'danger' : ''} ${alert.status === 'resolved' ? 'resolved' : ''}`}>
                <div className={`alert-card ${alert.status === 'unresolved' ? 'unresolved' : ''}`}>
                  <div className="alert-type">
                    <span aria-hidden="true">{alert.icon}</span>
                    {alert.type}
                    {alert.status === 'unresolved' ? (
                      <span className="status-tag warn" style={{ marginLeft: 'auto' }}>待处置</span>
                    ) : (
                      <span className="status-tag ok" style={{ marginLeft: 'auto' }}>已处置</span>
                    )}
                  </div>
                  <div className="alert-time">触发时间:{alert.time}</div>
                  <div className="alert-desc">{alert.description}</div>
                  <div className="alert-suggestion">
                    <strong>建议处置:</strong>{alert.suggestion}
                  </div>
                  {called ? (
                    <div className="tip-banner" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                      <span className="loading-dots" aria-hidden="true">
                        <span></span><span></span><span></span>
                      </span>
                      正在拨通母亲电话...
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="call-back-btn"
                      onClick={() => handleCallBack(alert.id)}
                    >
                      📞 一键回拨母亲电话
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bottom-actions no-print">
          <ElderButton
            size="lg"
            full
            variant="secondary"
            onClick={() => navigate('/family')}
          >
            返回看护台
          </ElderButton>
        </div>
      </div>
    </div>
  )
}
