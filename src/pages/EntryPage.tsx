import { useNavigate } from 'react-router-dom'
import ElderButton from '../components/elder/ElderButton'

/**
 * 视角选择入口页(根路径 /)
 * 两个大按钮"我是老人"/"我是子女",按钮 ≥ 64px 高,字号 ≥ 24px
 */
export default function EntryPage() {
  const navigate = useNavigate()
  return (
    <div className="entry-page">
      <div className="entry-brand" aria-hidden="true">
        ❤
      </div>
      <h1 className="entry-title">智慧助老综合平台</h1>
      <p className="entry-slogan">
        用药安全 · 居家守护 · AI 陪伴 · 数字生活
        <br />
        让科技有温度,从照顾父母开始
      </p>

      <div className="entry-actions">
        <ElderButton
          size="xl"
          full
          variant="primary"
          onClick={() => navigate('/elder')}
          aria-label="我是老人,进入老人端"
        >
          我是老人
        </ElderButton>

        <div className="entry-divider">选择身份进入</div>

        <ElderButton
          size="xl"
          full
          variant="secondary"
          onClick={() => navigate('/family')}
          aria-label="我是子女,进入子女端"
        >
          我是子女
        </ElderButton>
      </div>

      <p className="entry-entry-tag">演示版 · 无需注册即可体验</p>
    </div>
  )
}
