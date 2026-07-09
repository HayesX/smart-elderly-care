import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import ElderButton from '../../components/elder/ElderButton'
import {
  mockMoodWeek,
  mockMoodKeywords,
  mockMoodSummary,
  moodLevelEmoji,
  moodLevelText
} from '../../data/mockMood'

/**
 * 爸妈心情页(/family/mood)
 * 本周情绪曲线(用 SVG 画简单折线图,7 天数据)
 * + 关键词标签 + 聊天情绪摘要导出按钮
 */
export default function MoodPage() {
  const navigate = useNavigate()

  // SVG 折线图参数
  const W = 320
  const H = 200
  const padX = 28
  const padTop = 24
  const padBottom = 36
  const innerW = W - padX * 2
  const innerH = H - padTop - padBottom
  const maxScore = 5
  const minScore = 1

  const xOf = (i: number) => padX + (innerW / (mockMoodWeek.length - 1)) * i
  const yOf = (score: number) =>
    padTop + innerH - ((score - minScore) / (maxScore - minScore)) * innerH

  const points = mockMoodWeek.map((d, i) => ({ x: xOf(i), y: yOf(d.score), day: d }))
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ')

  const handleExport = () => {
    // 导出脱敏情绪摘要为文本文件
    const text = `智慧助老平台 · 本周聊天情绪摘要(脱敏)
====================================
老人:王奶奶
周期:${mockMoodWeek[0].date} ~ ${mockMoodWeek[mockMoodWeek.length - 1].date}
生成时间:${new Date().toLocaleString('zh-CN')}

【情绪曲线】
${mockMoodWeek
  .map((d) => `${d.weekday}  ${moodLevelText[d.level]}(${d.score}/5)  ${d.summary}`)
  .join('\n')}

【本周高频关键词】
${mockMoodKeywords.map((k) => `- ${k.word} (${k.count} 次)`).join('\n')}

【情绪摘要】
${mockMoodSummary}

注:本报告已对住址、身份证等敏感信息脱敏处理。
`
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '爸妈本周情绪摘要.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="no-print">
        <PageHeader title="爸妈心情" backTo="/family" />
      </div>

      <div style={{ padding: '0 4px 48px' }}>
        {/* 情绪曲线 */}
        <div className="section-title">本周情绪曲线</div>
        <div className="mood-chart-wrap">
          <svg
            className="mood-chart-svg"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            aria-label="本周情绪曲线折线图"
          >
            {/* Y 轴刻度 */}
            {[5, 4, 3, 2, 1].map((s) => (
              <g key={s}>
                <line
                  x1={padX}
                  y1={yOf(s)}
                  x2={W - padX}
                  y2={yOf(s)}
                  stroke="var(--color-divider)"
                  strokeDasharray="3,3"
                />
                <text
                  x={padX - 8}
                  y={yOf(s) + 4}
                  textAnchor="end"
                  className="mood-axis-label"
                >
                  {s}
                </text>
              </g>
            ))}

            {/* 折线 */}
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* 折线下方填充 */}
            <polygon
              points={`${padX},${padTop + innerH} ${polylinePoints} ${W - padX},${padTop + innerH}`}
              fill="var(--color-primary)"
              opacity="0.08"
            />

            {/* 数据点 */}
            {points.map((p, i) => {
              const color =
                p.day.level === 'happy'
                  ? '#2e7d32'
                  : p.day.level === 'calm'
                  ? '#1976d2'
                  : p.day.level === 'low'
                  ? '#f9a825'
                  : '#d93025'
              return (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#fff"
                    stroke={color}
                    strokeWidth="3"
                  />
                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    fontSize="14"
                  >
                    {moodLevelEmoji[p.day.level]}
                  </text>
                  <text
                    x={p.x}
                    y={H - 18}
                    textAnchor="middle"
                    className="mood-day-label"
                  >
                    {p.day.weekday}
                  </text>
                  <text
                    x={p.x}
                    y={H - 4}
                    textAnchor="middle"
                    className="mood-axis-label"
                  >
                    {p.day.date.slice(5)}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* 情绪图例 */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            marginBottom: 8
          }}
        >
          <span><span aria-hidden="true">😊</span> 开心</span>
          <span><span aria-hidden="true">😌</span> 平静</span>
          <span><span aria-hidden="true">😔</span> 低落</span>
          <span><span aria-hidden="true">😢</span> 悲伤</span>
        </div>

        {/* 关键词云 */}
        <div className="section-title">本周高频关键词</div>
        <div className="mood-keywords">
          {mockMoodKeywords.map((kw) => (
            <span key={kw.word} className="mood-keyword">
              {kw.word}
              <span className="kw-count">×{kw.count}</span>
            </span>
          ))}
        </div>

        {/* 每日明细 */}
        <div className="section-title">每日情绪明细</div>
        {mockMoodWeek.map((d) => (
          <div
            key={d.date}
            className="alert-card"
            style={{
              marginBottom: 8,
              borderLeft: `4px solid ${
                d.level === 'happy'
                  ? 'var(--color-success)'
                  : d.level === 'calm'
                  ? '#1976d2'
                  : d.level === 'low'
                  ? 'var(--color-warning)'
                  : 'var(--color-danger)'
              }`
            }}
          >
            <div className="alert-type">
              <span aria-hidden="true">{moodLevelEmoji[d.level]}</span>
              {d.weekday} · {moodLevelText[d.level]}
              <span style={{ marginLeft: 'auto', color: 'var(--color-text-light)', fontSize: 13 }}>
                {d.date}
              </span>
            </div>
            <div className="alert-desc">{d.summary}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {d.keywords.map((k) => (
                <span
                  key={k}
                  style={{
                    fontSize: 12,
                    padding: '2px 8px',
                    background: 'var(--color-bg-soft)',
                    borderRadius: 999,
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  #{k}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* 情绪摘要 */}
        <div className="section-title">本周情绪摘要</div>
        <div className="mood-summary">{mockMoodSummary}</div>

        <div className="bottom-actions no-print">
          <ElderButton
            size="lg"
            full
            variant="primary"
            icon={<span aria-hidden="true">📄</span>}
            onClick={handleExport}
          >
            导出脱敏情绪摘要
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
