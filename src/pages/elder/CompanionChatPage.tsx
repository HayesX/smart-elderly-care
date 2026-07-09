import { useEffect, useRef, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { WELCOME_REPLY, type ChatMode } from '../../data/chatScript'
import { getResponse } from '../../utils/chatEngine'
import {
  speak,
  startListening,
  stopListening,
  isASRSupported,
  isTTSSupported,
  stopSpeaking
} from '../../utils/speech'

interface ChatMessage {
  id: string
  from: 'bot' | 'user'
  text: string
  alert?: boolean
}

let msgId = 0
const newId = () => `m-${Date.now()}-${msgId++}`

/**
 * 小助对话页(/elder/companion/chat)
 * 小助头像+名称+在线状态,对话气泡区(小助左橙色/老人右灰色)
 * 底部语音输入大按钮 + 文字输入切换
 * 初始小助欢迎语"王奶奶,小助在呢,您想聊点什么?"
 */
export default function CompanionChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: newId(), from: 'bot', text: WELCOME_REPLY }
  ])
  const [mode, setMode] = useState<ChatMode>('companion')
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice')
  const [textValue, setTextValue] = useState('')
  const [listening, setListening] = useState(false)
  const [familyAlert, setFamilyAlert] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  const asrSupported = isASRSupported()
  const ttsSupported = isTTSSupported()
  // 默认走语音;若 ASR 不支持,自动降级为文字输入
  useEffect(() => {
    if (!asrSupported) {
      setInputMode('text')
    }
  }, [asrSupported])

  // 自动滚到底部
  useEffect(() => {
    const el = bodyRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages])

  // 组件卸载时停止语音
  useEffect(() => {
    return () => {
      stopSpeaking()
      stopListening()
    }
  }, [])

  const appendUser = (text: string) => {
    setMessages((prev) => [...prev, { id: newId(), from: 'user', text }])
  }

  const appendBot = (text: string, alert = false) => {
    setMessages((prev) => [...prev, { id: newId(), from: 'bot', text, alert }])
  }

  const handleUserInput = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    appendUser(trimmed)

    const resp = getResponse(trimmed, mode)
    setMode(resp.mode)

    if (resp.alertFamily) {
      setFamilyAlert(true)
    }

    // 模拟小助"思考"延迟,使对话更自然
    setTimeout(() => {
      appendBot(resp.reply, resp.isEmotionAlert)
      if (ttsSupported) {
        speak(resp.reply)
      }
    }, 500)
  }

  const handleVoiceClick = () => {
    if (listening) {
      stopListening()
      setListening(false)
      return
    }
    setListening(true)
    stopSpeaking()
    const ok = startListening({
      onResult: (text) => {
        setListening(false)
        handleUserInput(text)
      },
      onEnd: () => {
        setListening(false)
      },
      onError: () => {
        setListening(false)
      }
    })
    if (!ok) {
      setListening(false)
      // 不支持 ASR,自动切换文字输入
      setInputMode('text')
    }
  }

  const handleSendText = () => {
    if (!textValue.trim()) return
    handleUserInput(textValue)
    setTextValue('')
  }

  const quickPrompts = [
    '孙子什么时候回来?',
    '今天天气怎么样?',
    '帮我查明天天气',
    '我有点想孙子',
    '今天该吃啥药?',
    '给我讲个故事'
  ]

  return (
    <div className="chat-page">
      <PageHeader
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            和小助聊聊
            <span className={`mode-tag ${mode === 'errand' ? 'errand' : ''}`}>
              {mode === 'errand' ? '代办模式' : '陪伴模式'}
            </span>
          </span>
        }
        backTo="/elder"
      />

      <div className="chat-header">
        <div className="chat-avatar" aria-hidden="true">
          🌸
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">
            小助
            <span className="online-dot" aria-hidden="true"></span>
          </div>
          <div className="chat-header-status">在线 · 随时陪您说话</div>
        </div>
      </div>

      {familyAlert && (
        <div className="alert-banner-chat" role="alert">
          <span aria-hidden="true">⚠️</span>
          已检测到情绪信号,正在通知您儿子...
        </div>
      )}

      <div className="chat-body" ref={bodyRef}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`bubble-row from-${m.from === 'bot' ? 'bot' : 'user'}`}
          >
            {m.from === 'bot' && (
              <div className="bubble-avatar" aria-hidden="true">
                🌸
              </div>
            )}
            <div
              className={`bubble from-${m.from === 'bot' ? 'bot' : 'user'} ${m.alert ? 'alert' : ''}`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-footer">
        {/* 快捷问句 */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 10,
            marginBottom: 4
          }}
        >
          {quickPrompts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleUserInput(q)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid var(--color-border)',
                background: '#fff',
                color: 'var(--color-text-secondary)',
                fontSize: 14,
                minHeight: 36
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {inputMode === 'voice' ? (
          <>
            <button
              type="button"
              className={`voice-big-btn ${listening ? 'listening' : ''}`}
              onClick={handleVoiceClick}
              aria-label={listening ? '正在听,点击停止' : '点击说话'}
            >
              <span className="mic-icon" aria-hidden="true">
                {listening ? '■' : '🎤'}
              </span>
              {listening ? '正在听您说,说完点这里' : '点这里说话'}
            </button>
            <div className="input-toggle-row" style={{ marginTop: 8 }}>
              <button
                type="button"
                className="input-toggle-btn"
                onClick={() => setInputMode('text')}
                aria-label="切换到文字输入"
                style={{ flex: 1, minHeight: 44 }}
              >
                ⌨️ 切换文字输入
              </button>
            </div>
            <div className="chat-tip">
              {asrSupported
                ? '可以说"孙子""天气""吃药"等,小助都听着呢'
                : '当前浏览器不支持语音识别,请使用文字输入'}
            </div>
          </>
        ) : (
          <>
            <div className="input-toggle-row">
              <input
                className="elder-input"
                value={textValue}
                placeholder="跟小助说点什么..."
                onChange={(e) => setTextValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendText()
                }}
              />
              <button
                type="button"
                className="send-btn"
                onClick={handleSendText}
                disabled={!textValue.trim()}
              >
                发送
              </button>
            </div>
            {asrSupported && (
              <div className="input-toggle-row" style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="input-toggle-btn"
                  onClick={() => setInputMode('voice')}
                  aria-label="切换回语音输入"
                  style={{ flex: 1, minHeight: 44 }}
                >
                  🎤 切换语音输入
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
