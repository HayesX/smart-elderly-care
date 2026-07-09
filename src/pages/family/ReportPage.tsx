import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import ElderButton from '../../components/elder/ElderButton'
import { mockMedicineHistory } from '../../data/mockMedicineHistory'
import { mockSafetyAlerts } from '../../data/mockSafetyAlerts'
import { mockMoodWeek, mockMoodSummary } from '../../data/mockMood'

/**
 * 报告导出页(/family/report)
 * 报告预览(用药/安全/心情汇总)
 * + 导出 PDF 按钮(window.print())
 */
export default function ReportPage() {
  const navigate = useNavigate()

  const totalTaken = mockMedicineHistory.reduce((s, d) => s + d.taken, 0)
  const totalMissed = mockMedicineHistory.reduce((s, d) => s + d.missed, 0)
  const adherence = Math.round(
    (totalTaken / (totalTaken + totalMissed)) * 100
  )
  const happyDays = mockMoodWeek.filter((d) => d.level === 'happy').length
  const lowDays = mockMoodWeek.filter((d) => d.level === 'low' || d.level === 'sad').length

  const handleExportPdf = () => {
    window.print()
  }

  return (
    <div>
      <div className="no-print">
        <PageHeader title="报告导出" backTo="/family" />
      </div>

      <div style={{ padding: '0 4px 48px' }}>
        {/* 报告标题 */}
        <div
          style={{
            textAlign: 'center',
            padding: '20px 0 16px',
            borderBottom: '2px solid var(--color-primary)',
            marginBottom: 16
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)' }}>
            智慧助老平台 · 健康看护报告
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            被看护人:王秀英(母亲) · 看护人:王明(儿子)
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-light)', marginTop: 2 }}>
            报告周期:2026-06-19 ~ 2026-06-25 · 生成于 {new Date().toLocaleDateString('zh-CN')}
          </div>
        </div>

        {/* 用药汇总 */}
        <div className="report-section">
          <h3>
            <span aria-hidden="true">💊</span> 用药情况汇总
          </h3>
          <p>近 7 天共应服药 {totalTaken + totalMissed} 次,实际按时服用 {totalTaken} 次,漏服 {totalMissed} 次,用药依从率 {adherence}%。</p>
          <div className="report-stats">
            <div className="report-stat">
              <div className="rs-num">{totalTaken}</div>
              <div className="rs-label">已按时(次)</div>
            </div>
            <div className="report-stat">
              <div className="rs-num">{totalMissed}</div>
              <div className="rs-label">漏服(次)</div>
            </div>
            <div className="report-stat">
              <div className="rs-num">{adherence}%</div>
              <div className="rs-label">依从率</div>
            </div>
          </div>
          {totalMissed > 0 && (
            <p style={{ marginTop: 12, color: 'var(--color-danger-dark)' }}>
              ⚠ 6 月 22 日出现明显漏服(2 次),建议加强提醒或电话督促。
            </p>
          )}
        </div>

        {/* 安全汇总 */}
        <div className="report-section">
          <h3>
            <span aria-hidden="true">🛡️</span> 居家安全汇总
          </h3>
          <p>近 7 天共触发预警 {mockSafetyAlerts.length} 条,其中 {mockSafetyAlerts.filter(a => a.status === 'unresolved').length} 条待处置。</p>
          {mockSafetyAlerts.map((a) => (
            <div key={a.id} style={{ marginTop: 8, padding: 12, background: 'var(--color-bg-soft)', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                {a.icon} {a.type} · {a.time}
              </div>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                {a.description}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                处置状态:{a.status === 'resolved' ? '✓ 已处置' : '⚠ 待处置'}
              </div>
            </div>
          ))}
        </div>

        {/* 心情汇总 */}
        <div className="report-section">
          <h3>
            <span aria-hidden="true">😊</span> 心理健康汇总
          </h3>
          <p>本周开心 {happyDays} 天,情绪低落 {lowDays} 天。整体情绪平稳,周末因家人陪伴表现最佳。</p>
          <div className="report-stats">
            <div className="report-stat">
              <div className="rs-num">{happyDays}</div>
              <div className="rs-label">开心天数</div>
            </div>
            <div className="report-stat">
              <div className="rs-num">{lowDays}</div>
              <div className="rs-label">低落天数</div>
            </div>
            <div className="report-stat">
              <div className="rs-num">{mockMoodWeek.length}</div>
              <div className="rs-label">统计天数</div>
            </div>
          </div>
          <p style={{ marginTop: 12, fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            {mockMoodSummary}
          </p>
        </div>

        {/* 建议 */}
        <div className="report-section" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <h3>
            <span aria-hidden="true">📋</span> 看护建议
          </h3>
          <p>
            1. 用药方面:依从率 {adherence}%,建议保留定时提醒,重点关注漏服药品。
            <br />
            2. 安全方面:本周触发 1 次长时间未活动预警,建议确认母亲日常作息,必要时增加传感器覆盖。
            <br />
            3. 心理方面:周末情绪最佳,建议保持每周固定家庭陪伴或视频通话,关注"孤单""没意思"等关键词。
          </p>
        </div>

        {/* 底部签章 */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--color-text-light)',
            padding: 16,
            borderTop: '1px solid var(--color-divider)',
            marginTop: 16
          }}
        >
          本报告由智慧助老综合平台自动生成 · 仅供家庭看护参考
          <br />
          如有健康异常请及时联系医生 · 智慧助老平台 © 2026
        </div>

        <div className="bottom-actions no-print">
          <ElderButton
            size="xl"
            full
            variant="primary"
            icon={<span aria-hidden="true">📄</span>}
            onClick={handleExportPdf}
          >
            导出 PDF 报告
          </ElderButton>
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
