import { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import ElderButton from '../../components/elder/ElderButton'
import { mockMedicinePlan, type MedicinePlanItem, type MedicineStatus } from '../../data/mockMedicinePlan'
import { speak } from '../../utils/speech'

/**
 * 用药计划页(/elder/medicine/plan)
 * 今日 3 条提醒列表,每条含药品名+时间+状态,"我吃过了"确认按钮
 */
export default function MedicinePlanPage() {
  const [plan, setPlan] = useState<MedicinePlanItem[]>(mockMedicinePlan)

  const handleTaken = (id: string) => {
    setPlan((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'taken' as MedicineStatus } : p
      )
    )
    const item = plan.find((p) => p.id === id)
    if (item) {
      speak(`好的,已经记下您吃了${item.medicineName}。奶奶真棒,记得按时吃药。`)
    }
  }

  const statusText: Record<MedicineStatus, string> = {
    taken: '已服用 ✓',
    pending: '待服用',
    missed: '已漏服'
  }

  const statusClass: Record<MedicineStatus, string> = {
    taken: 'taken',
    pending: 'pending',
    missed: 'missed'
  }

  return (
    <div className="page-container">
      <PageHeader title="今日用药计划" backTo="/elder" />

      <div className="plan-page">
        <div className="tip-banner">
          <span aria-hidden="true">⏰</span>
          今日 3 条提醒,已按时 2 条,还有 1 条待服用
        </div>

        <div className="plan-list">
          {plan.map((item) => (
            <div key={item.id} className={`plan-item ${statusClass[item.status]}`}>
              <div className="plan-icon" aria-hidden="true">
                {item.icon}
              </div>
              <div className="plan-info">
                <div className="plan-name">{item.medicineName}</div>
                <div className="plan-meta">
                  {item.dosage} · {item.timing} · {item.category}
                </div>
                <div className="plan-action">
                  <span className={`status-tag ${item.status === 'taken' ? 'ok' : item.status === 'missed' ? 'bad' : 'warn'}`}>
                    {statusText[item.status]}
                  </span>
                </div>
              </div>
              <div className="plan-time">
                <div className="plan-time-val">{item.time}</div>
                {item.status !== 'taken' && (
                  <ElderButton
                    size="md"
                    variant="primary"
                    onClick={() => handleTaken(item.id)}
                    style={{ marginTop: 8, fontSize: 15 }}
                  >
                    我吃过了
                  </ElderButton>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-actions">
          <ElderButton
            size="lg"
            full
            variant="secondary"
            onClick={() => {
              speak('您的用药情况已经同步给儿子,他看得见,放心吧。')
            }}
          >
            同步给儿子查看
          </ElderButton>
        </div>
      </div>
    </div>
  )
}
