import { useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'

/**
 * 通用页面顶部栏:返回按钮 + 标题
 * 适用于老人端二级页面
 */
export default function PageHeader({
  title,
  backTo = -1,
  right
}: {
  title: ReactNode
  /** 返回目标路径,默认 -1(浏览器历史回退) */
  backTo?: string | number
  /** 右侧自定义内容 */
  right?: ReactNode
}) {
  const navigate = useNavigate()
  const handleBack = () => {
    if (backTo === -1) {
      navigate(-1)
    } else {
      navigate(backTo as string)
    }
  }
  return (
    <div className="page-header no-print">
      <button
        type="button"
        className="back-btn"
        onClick={handleBack}
        aria-label="返回上一页"
      >
        ←
      </button>
      <h1 className="page-title">{title}</h1>
      {right}
    </div>
  )
}
