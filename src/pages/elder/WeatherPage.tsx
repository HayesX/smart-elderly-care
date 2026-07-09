import PageHeader from '../../components/PageHeader'
import ElderButton from '../../components/elder/ElderButton'
import { mockWeather } from '../../data/mockWeather'
import { speak, isTTSSupported } from '../../utils/speech'

/**
 * 天气详情页(/elder/life/weather)
 * 今日/明日大字温度 + 图标 + 出行建议 + 语音播报按钮
 */
export default function WeatherPage() {
  const { today, tomorrow, city } = mockWeather

  const handleSpeak = () => {
    speak(
      `奶奶,今天${city}${today.text},${today.temp}度,${today.wind}。${today.advice}明天${tomorrow.text},${tomorrow.tempMin}到${tomorrow.tempMax}度。${tomorrow.advice}`
    )
  }

  return (
    <div className="page-container">
      <PageHeader title="今日天气" backTo="/elder" />

      <div className="weather-page">
        <div className="weather-big-card">
          <div className="wb-label">{today.weekday} · {city}</div>
          <div className="wb-icon" aria-hidden="true">{today.icon}</div>
          <div className="wb-temp">
            {today.temp}
            <span className="deg">°</span>
          </div>
          <div className="wb-desc">{today.text}</div>
          <div className="wb-meta">
            <span>{today.tempMin}° / {today.tempMax}°</span>
            <span>·</span>
            <span>{today.wind}</span>
            <span>·</span>
            <span>湿度 {today.humidity}</span>
          </div>
        </div>

        <div className="weather-tomorrow-card">
          <div className="wt-icon" aria-hidden="true">{tomorrow.icon}</div>
          <div className="wt-info">
            <div className="wt-label">明日 {tomorrow.weekday}</div>
            <div className="wt-temp">{tomorrow.text} {tomorrow.tempMin}°~{tomorrow.tempMax}°</div>
            <div className="wt-desc">{tomorrow.wind} · 空气{tomorrow.aqi}</div>
          </div>
        </div>

        <div className="advice-card">
          <div className="advice-title">📣 今日出行建议</div>
          <div className="advice-text">{today.advice}</div>
        </div>

        <div className="advice-card" style={{ background: '#e3f2fd', borderColor: '#1976d2' }}>
          <div className="advice-title" style={{ color: '#1565c0' }}>📢 明日提醒</div>
          <div className="advice-text">{tomorrow.advice}</div>
        </div>

        {isTTSSupported() && (
          <ElderButton
            size="xl"
            full
            variant="primary"
            icon={<span aria-hidden="true">🔊</span>}
            onClick={handleSpeak}
          >
            语音播报天气
          </ElderButton>
        )}
      </div>
    </div>
  )
}
