import { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import ElderButton from '../../components/elder/ElderButton'
import { mockFavoriteAddresses, generateTaxiOrder, type TaxiOrder } from '../../data/mockTaxi'
import { speak, isTTSSupported } from '../../utils/speech'

/**
 * 一键叫车页(/elder/life/taxi)
 * 常用地址大按钮(家/医院/超市)→ 点击"去医院"→ 语音确认"您要去医院对吗?"
 * → 模拟派单展示(司机张师傅 5 分钟到达,车牌京A12345)
 */
export default function TaxiPage() {
  const [confirmTarget, setConfirmTarget] = useState<{
    label: string
    address: string
    icon: string
  } | null>(null)
  const [order, setOrder] = useState<TaxiOrder | null>(null)
  const [calling, setCalling] = useState(false)

  const handleSelectAddr = (addr: {
    id: string
    label: string
    address: string
    icon: string
  }) => {
    setConfirmTarget(addr)
    setOrder(null)
    // 语音确认
    if (isTTSSupported()) {
      speak(`您要去${addr.label.replace('去', '')}对吗?`)
    }
  }

  const handleConfirm = () => {
    if (!confirmTarget) return
    setConfirmTarget(null)
    setCalling(true)
    if (isTTSSupported()) {
      speak('好的,小助这就帮您叫车,稍等一下。')
    }
    // 模拟派单等待
    setTimeout(() => {
      const o = generateTaxiOrder(confirmTarget.address, confirmTarget.icon)
      setOrder(o)
      setCalling(false)
      if (isTTSSupported()) {
        speak(`车叫好啦。${o.driverName}师傅,车牌${o.plateNumber},${o.etaMinutes}分钟到。您慢慢下楼,不用急。`)
      }
    }, 2000)
  }

  const handleCancel = () => {
    setConfirmTarget(null)
    setOrder(null)
    setCalling(false)
  }

  return (
    <div className="page-container">
      <PageHeader title="我要出门" backTo="/elder" />

      <div className="taxi-page">
        <div className="tip-banner">
          <span aria-hidden="true">🚗</span>
          选要去的地方,小助帮您叫车
        </div>

        {/* 常用地址列表 */}
        {!confirmTarget && !order && !calling && (
          <div className="addr-list">
            {mockFavoriteAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                className="addr-btn"
                onClick={() => handleSelectAddr(addr)}
              >
                <span className="addr-icon" aria-hidden="true">
                  {addr.icon}
                </span>
                <span className="addr-text">
                  <div className="addr-label">{addr.label}</div>
                  <div className="addr-detail">{addr.address}</div>
                </span>
                <span className="entry-arrow" aria-hidden="true">
                  ›
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 确认弹层 */}
        {confirmTarget && (
          <>
            <div className="confirm-banner">
              <div className="confirm-q">您要{confirmTarget.label}对吗?</div>
              <div className="confirm-sub">{confirmTarget.address}</div>
            </div>
            <div className="action-row">
              <ElderButton
                size="xl"
                variant="secondary"
                onClick={handleCancel}
              >
                取消
              </ElderButton>
              <ElderButton
                size="xl"
                variant="primary"
                onClick={handleConfirm}
              >
                对,叫车
              </ElderButton>
            </div>
          </>
        )}

        {/* 派单中 */}
        {calling && (
          <div className="scan-loading" style={{ minHeight: 180 }}>
            <div className="loading-dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="scan-loading-text">正在为您叫车...</div>
            <div className="scan-loading-sub">小助联系附近司机</div>
          </div>
        )}

        {/* 派单结果 */}
        {order && (
          <>
            <div className="tip-banner" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              <span aria-hidden="true">✅</span>
              车叫好啦,师傅马上到
            </div>
            <div className="order-card">
              <div className="order-top">
                <div className="driver-avatar" aria-hidden="true">
                  {order.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="driver-name">{order.driverName}</div>
                  <div className="driver-rating">★ {order.rating} · {order.carModel}</div>
                  <div className="plate">{order.plateNumber}</div>
                </div>
              </div>
              <div className="eta-block">
                <div className="eta-val">{order.etaMinutes} 分钟</div>
                <div className="eta-text">预计到达时间</div>
              </div>
            </div>

            <ElderButton
              size="lg"
              full
              variant="secondary"
              onClick={() => {
                if (isTTSSupported()) {
                  speak(`正在拨打${order.driverName}师傅电话,${order.driverPhone}`)
                }
              }}
            >
              📞 联系司机师傅
            </ElderButton>

            <div className="action-row" style={{ marginTop: 12 }}>
              <ElderButton
                size="lg"
                variant="ghost"
                onClick={handleCancel}
              >
                重新叫车
              </ElderButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
