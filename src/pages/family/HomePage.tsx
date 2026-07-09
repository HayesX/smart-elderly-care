import { useNavigate } from 'react-router-dom'
import ElderButton from '../../components/elder/ElderButton'

/**
 * 子女端首页(/family)
 * 父母状态总览卡片(用药✓已按时/安全✓正常/心情😊良好)
 * + 四宫格入口(用药看板/安全状态/爸妈心情/报告导出,每格 ≥ 96×96px)
 */
export default function FamilyHomePage() {
  const navigate = useNavigate()

  const entries = [
    {
      icon: '💊',
      title: '用药看板',
      sub: '本月服药情况',
      to: '/family/medicine',
      color: '#e8734a'
    },
    {
      icon: '🛡️',
      title: '安全状态',
      sub: '1 条待处置预警',
      to: '/family/safety',
      color: '#f9a825',
      badge: 1
    },
    {
      icon: '😊',
      title: '爸妈心情',
      sub: '本周情绪曲线',
      to: '/family/mood',
      color: '#2e7d32'
    },
    {
      icon: '📋',
      title: '报告导出',
      sub: '汇总健康报告',
      to: '/family/report',
      color: '#1976d2'
    }
  ]

  return (
    <div>
      <div className="family-topbar">
        <div>
          <div className="family-title">爸妈看护台</div>
          <div className="family-sub">王奶奶 · 北京市朝阳区幸福里小区</div>
        </div>
      </div>

      {/* 父母状态总览卡片 */}
      <div className="parent-status-card">
        <div className="parent-name">母亲 · 王秀英</div>
        <div className="parent-sub">最近更新:今天 14:35 · 数据每 5 分钟同步</div>

        <div className="status-grid-3">
          <div className="status-cell">
            <div className="sc-icon" aria-hidden="true">💊</div>
            <div className="sc-label">用药</div>
            <div className="sc-value">✓ 已按时</div>
          </div>
          <div className="status-cell warn">
            <div className="sc-icon" aria-hidden="true">🛡️</div>
            <div className="sc-label">安全</div>
            <div className="sc-value">⚠ 1 条预警</div>
          </div>
          <div className="status-cell">
            <div className="sc-icon" aria-hidden="true">😊</div>
            <div className="sc-label">心情</div>
            <div className="sc-value">良好</div>
          </div>
        </div>
      </div>

      {/* 四宫格入口 */}
      <div className="section-title">功能入口</div>
      <div className="family-grid">
        {entries.map((e) => (
          <button
            key={e.to}
            type="button"
            className="family-grid-cell"
            onClick={() => navigate(e.to)}
            aria-label={e.title}
          >
            <div className="fgc-icon" aria-hidden="true" style={{ background: `${e.color}22`, color: e.color }}>
              {e.icon}
            </div>
            <div className="fgc-title">{e.title}</div>
            <div className="fgc-sub">{e.sub}</div>
          </button>
        ))}
      </div>

      <div className="bottom-actions">
        <ElderButton
          size="lg"
          full
          variant="secondary"
          onClick={() => navigate('/family/safety')}
        >
          查看待处置预警 (1)
        </ElderButton>
      </div>
    </div>
  )
}
