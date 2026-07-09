import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import ElderButton from '../../components/elder/ElderButton'
import { FieldRow } from '../../components/elder/ElderCard'
import { getNextMockMedicine, type Medicine } from '../../data/mockMedicines'
import { speak } from '../../utils/speech'

/**
 * 拍照识药页(/elder/medicine/scan)
 * 大图上传区 → 识别中动画(1.5-2s)→ Mock 药品识别结果卡片 → 加入用药计划按钮
 */
export default function MedicineScanPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [result, setResult] = useState<Medicine | null>(null)
  const [added, setAdded] = useState(false)

  const handleUpload = () => {
    setStatus('loading')
    setAdded(false)
    // 模拟识别过程 1.5-2 秒
    setTimeout(() => {
      const med = getNextMockMedicine()
      setResult(med)
      setStatus('done')
      // 语音播报识别结果
      speak(
        `识别成功。这是${med.category}${med.name}。${med.frequency},${med.timing}。${med.dosage}。`
      )
    }, 1800)
  }

  const handleAddPlan = () => {
    setAdded(true)
    speak('好的,已经帮您加入用药计划,到点小助会提醒您。')
  }

  return (
    <div className="page-container">
      <PageHeader title="拍照识药" backTo="/elder" />

      <div className="scan-page">
        {status === 'idle' && (
          <div
            className="upload-area"
            onClick={handleUpload}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleUpload()
            }}
            aria-label="点击上传示例药盒图"
          >
            <div className="upload-icon" aria-hidden="true">
              📷
            </div>
            <div className="upload-hint">点击上传示例药盒图</div>
            <div className="upload-sub">
              小助帮您识别药品名、剂量、用法
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div className="scan-loading" aria-live="polite">
            <div className="loading-dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="scan-loading-text">识别中...</div>
            <div className="scan-loading-sub">小助正在帮您认药,稍等一下</div>
          </div>
        )}

        {status === 'done' && result && (
          <>
            <div className="tip-banner">
              <span aria-hidden="true">✅</span>
              识别成功,请核对一下信息
            </div>

            <div className="elder-card result-card">
              <div className="med-name">{result.name}</div>
              <span className="med-category">{result.category}</span>

              <div className="field-list">
                <FieldRow label="药品名" value={result.name} large />
                <FieldRow label="剂量" value={result.dosage} />
                <FieldRow label="服用频次" value={result.frequency} />
                <FieldRow label="用药时机" value={result.timing} />
                <FieldRow label="注意事项" value={result.precaution} />
                <FieldRow label="有效期" value={result.expireDate} />
              </div>
            </div>

            {added ? (
              <div className="tip-banner" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                <span aria-hidden="true">✅</span>
                已加入用药计划,到点小助会提醒您
              </div>
            ) : (
              <ElderButton
                size="xl"
                full
                variant="primary"
                onClick={handleAddPlan}
                style={{ marginTop: 16 }}
              >
                加入用药计划
              </ElderButton>
            )}

            <div className="action-row">
              <ElderButton
                size="lg"
                variant="secondary"
                onClick={handleUpload}
              >
                再拍一张
              </ElderButton>
              <ElderButton
                size="lg"
                variant="ghost"
                onClick={() => navigate('/elder/medicine/plan')}
              >
                查看用药计划
              </ElderButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
