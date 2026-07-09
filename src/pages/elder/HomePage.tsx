import { useNavigate } from 'react-router-dom'
import { mockWeather } from '../../data/mockWeather'

/**
 * 老人端首页(/elder)
 * 顶部"王奶奶,下午好"+日期天气卡片
 * 中部五大入口大按钮纵向排列(拍照识药/和小助聊聊/我要出门/今日天气/SOS)
 * SOS 红色独立样式,每按钮 ≥ 56px 高
 */
export default function ElderHomePage() {
  const navigate = useNavigate()
  const today = mockWeather.today

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 6) return '凌晨好'
    if (h < 11) return '早上好'
    if (h < 13) return '中午好'
    if (h < 18) return '下午好'
    return '晚上好'
  }

  const todayDate = new Date()
  const dateStr = `${todayDate.getMonth() + 1}月${todayDate.getDate()}日 ${
    ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][todayDate.getDay()]
  }`

  const entries: {
    icon: string
    title: string
    sub: string
    to: string
    isSos?: boolean
  }[] = [
    {
      icon: '💊',
      title: '拍照识药',
      sub: '拍药盒,小助帮您认',
      to: '/elder/medicine/scan'
    },
    {
      icon: '💬',
      title: '和小助聊聊',
      sub: '陪您说话,啥都能聊',
      to: '/elder/companion/chat'
    },
    {
      icon: '🚗',
      title: '我要出门',
      sub: '一键叫车,送您到地儿',
      to: '/elder/life/taxi'
    },
    {
      icon: '☀️',
      title: '今日天气',
      sub: '今天出门穿啥',
      to: '/elder/life/weather'
    },
    {
      icon: '🆘',
      title: 'SOS 紧急求助',
      sub: '遇到危险,按这里',
      to: '/elder/sos',
      isSos: true
    }
  ]

  return (
    <div>
      <div className="elder-topbar">
        <div className="greeting-block">
          <div className="greeting-text">王奶奶,{getGreeting()}</div>
          <div className="greeting-sub">{dateStr}</div>
        </div>
      </div>

      <div className="home-weather-card" onClick={() => navigate('/elder/life/weather')}>
        <div className="weather-icon" aria-hidden="true">
          {today.icon}
        </div>
        <div className="weather-info">
          <div className="weather-temp">
            {today.temp}° {today.text}
          </div>
          <div className="weather-meta">
            {today.wind} · 湿度 {today.humidity}
          </div>
        </div>
        <div className="weather-date">{mockWeather.city}</div>
      </div>

      <nav className="elder-entry-list" aria-label="老人端主功能入口">
        {entries.map((e) => (
          <button
            key={e.to}
            type="button"
            className={`elder-entry-btn ${e.isSos ? 'is-sos' : ''}`}
            onClick={() => navigate(e.to)}
            aria-label={e.title}
          >
            <span className="entry-icon" aria-hidden="true">
              {e.icon}
            </span>
            <span className="entry-text">
              <span className="entry-title-text">{e.title}</span>
              <span className="entry-sub">{e.sub}</span>
            </span>
            <span className="entry-arrow" aria-hidden="true">
              ›
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}
