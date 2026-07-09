import { useNavigate } from 'react-router-dom'

/**
 * 顶部右上角常驻"切换视角"小按钮
 * 进入 /elder 或 /family 后显示,点击回根路径 /
 */
export default function ViewSwitcher() {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      className="view-switcher no-print"
      onClick={() => navigate('/')}
      aria-label="切换视角,返回选择页"
    >
      <span className="view-switcher-icon" aria-hidden="true">
        ⇄
      </span>
      切换视角
    </button>
  )
}
