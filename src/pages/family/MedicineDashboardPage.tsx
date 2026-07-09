import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import ElderButton from '../../components/elder/ElderButton'
import { mockMedicineHistory } from '../../data/mockMedicineHistory'
import { mockMedicinePlan, type MedicineStatus } from '../../data/mockMedicinePlan'

/**
 * 用药看板页(/family/medicine)
 * 本月用药日历网格(7天示例,已服✓/漏服✕状态色)
 * + 今日用药列表(已服✓/漏服✕高亮红色)
 * + 导出 PDF 按钮(window.print())
 */
export default function MedicineDashboardPage() {
  const navigate = useNavigate()

  const handleExport = () => {
    window.print()
  }

  const totalTaken = mockMedicineHistory.reduce((s, d) => s + d.taken, 0)
  const totalMissed = mockMedicineHistory.reduce((s, d) => s + d.missed, 0)
  const adherence = Math.round(
    (totalTaken / (totalTaken + totalMissed)) * 100
  )

  return (
    <div>
      <div className="no-print">
        <PageHeader title="用药看板" backTo="/family" />
      </div>

      <div style={{ padding: '0 4px 48px' }}>
        {/* 概览统计 */}
        <div className="section-title">近 7 天用药概览</div>
        <div className="parent-status-card" style={{ marginBottom: 16 }}>
          <div className="status-grid-3">
            <div className="status-cell">
              <div className="sc-icon" aria-hidden="true">✓</div>
              <div className="sc-label">已按时</div>
              <div className="sc-value">{totalTaken} 次</div>
            </div>
            <div className="status-cell bad">
              <div className="sc-icon" aria-hidden="true">✕</div>
              <div className="sc-label">漏服</div>
              <div className="sc-value">{totalMissed} 次</div>
            </div>
            <div className="status-cell">
              <div className="sc-icon" aria-hidden="true">📊</div>
              <div className="sc-label">依从率</div>
              <div className="sc-value">{adherence}%</div>
            </div>
          </div>
        </div>

        {/* 用药日历 */}
        <div className="section-title">用药日历(近 7 天)</div>
        <div className="medicine-calendar">
          <div className="calendar-grid">
            {mockMedicineHistory.map((day) => {
              const cls =
                day.status === 'taken'
                  ? 'taken'
                  : day.status === 'missed'
                  ? 'missed'
                  : day.status === 'partial'
                  ? 'partial'
                  : ''
              const mark =
                day.status === 'taken' ? '✓' : day.status === 'missed' ? '✕' : day.status === 'partial' ? '◐' : '·'
              const isToday = day.weekday === '今日'
              return (
                <div key={day.date} className={`cal-cell ${cls} ${isToday ? 'today' : ''}`}>
                  <div className="cal-weekday">{day.weekday}</div>
                  <div className="cal-date">{day.date.slice(8, 10)}</div>
                  <div className="cal-mark">{mark}</div>
                </div>
              )
            })}
          </div>
          <div className="calendar-legend">
            <span><span className="legend-dot" style={{ background: 'var(--color-success)' }}></span>已按时</span>
            <span><span className="legend-dot" style={{ background: 'var(--color-warning)' }}></span>部分漏服</span>
            <span><span className="legend-dot" style={{ background: 'var(--color-danger)' }}></span>明显漏服</span>
          </div>
        </div>

        {/* 今日用药列表 */}
        <div className="section-title">今日用药详情</div>
        <div className="today-med-list">
          {mockMedicinePlan.map((item) => {
            const statusCls: Record<MedicineStatus, string> = {
              taken: 'taken',
              pending: 'pending',
              missed: 'missed'
            }
            const statusText: Record<MedicineStatus, string> = {
              taken: '已服用 ✓',
              pending: '待服用 ⏳',
              missed: '已漏服 ✕'
            }
            return (
              <div key={item.id} className={`today-med-item ${statusCls[item.status]}`}>
                <div className="tm-time">{item.time}</div>
                <div className="tm-name">
                  {item.medicineName}
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    {item.dosage} · {item.timing}
                  </div>
                </div>
                <div className="tm-status">{statusText[item.status]}</div>
              </div>
            )
          })}
        </div>

        {mockMedicineHistory.some((d) => d.missedMeds && d.missedMeds.length > 0) && (
          <>
            <div className="section-title">漏服详情</div>
            <div className="alert-card unresolved">
              <div className="alert-type">
                <span aria-hidden="true">⚠️</span> 6 月 22 日漏服 2 次
              </div>
              <div className="alert-time">2026-06-22</div>
              <div className="alert-desc">
                当日漏服药品:二甲双胍片、碳酸钙 D3 片。建议电话提醒按时服药。
              </div>
              <button
                type="button"
                className="call-back-btn"
                onClick={() => navigate('/family/safety')}
              >
                📞 电话确认
              </button>
            </div>
          </>
        )}

        <div className="bottom-actions no-print">
          <ElderButton
            size="lg"
            full
            variant="primary"
            icon={<span aria-hidden="true">📄</span>}
            onClick={handleExport}
          >
            导出 PDF 用药报告
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
