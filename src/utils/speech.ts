/**
 * Web Speech API 封装
 * - speak(text):TTS 播报,lang='zh-CN',rate=0.9
 * - startListening(onResult):ASR 识别
 * - isSpeechSupported():检测支持性
 * - 不支持时降级为文字输入(由调用方处理 UI)
 */

/** 是否支持 TTS(语音合成) */
export function isTTSSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.speechSynthesis.speak === 'function'
  )
}

/** 是否支持 ASR(语音识别) */
export function isASRSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  )
}

/** 综合判断是否支持 Web Speech API */
export function isSpeechSupported(): boolean {
  return isTTSSupported() || isASRSupported()
}

/** 获取 SpeechRecognition 构造器(兼容 webkit 前缀) */
function getRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

/**
 * TTS 文字转语音播报
 * @param text 要播报的文本
 * @param onEnd 播报结束回调(可选)
 */
export function speak(text: string, onEnd?: () => void): void {
  if (!isTTSSupported()) {
    // 不支持 TTS,直接回调
    onEnd?.()
    return
  }

  // 取消上一次未完成的播报,避免叠音
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.9 // 语速稍慢,适合老人收听
  utterance.pitch = 1
  utterance.volume = 1

  if (onEnd) {
    utterance.onend = () => onEnd()
    utterance.onerror = () => onEnd()
  }

  window.speechSynthesis.speak(utterance)
}

/** 停止当前 TTS 播报 */
export function stopSpeaking(): void {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel()
  }
}

/** 当前是否正在播报 */
export function isSpeaking(): boolean {
  return isTTSSupported() && window.speechSynthesis.speaking
}

let currentRecognition: SpeechRecognition | null = null

export interface ListenHandlers {
  /** 识别到结果(最终结果) */
  onResult: (text: string) => void
  /** 开始识别 */
  onStart?: () => void
  /** 结束识别 */
  onEnd?: () => void
  /** 识别出错 */
  onError?: (error: string) => void
}

/**
 * 启动 ASR 语音识别
 * @param handlers 回调
 * @returns 是否成功启动
 */
export function startListening(handlers: ListenHandlers): boolean {
  const Ctor = getRecognitionCtor()
  if (!Ctor) {
    return false
  }

  // 停止上一次识别
  stopListening()

  const recognition = new Ctor()
  recognition.lang = 'zh-CN'
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onstart = () => {
    handlers.onStart?.()
  }

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const results = event.results
    if (results && results.length > 0) {
      const first = results[0]
      if (first && first.length > 0) {
        const transcript = first[0].transcript || ''
        handlers.onResult(transcript.trim())
      }
    }
  }

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    handlers.onError?.(event.error || 'unknown')
  }

  recognition.onend = () => {
    handlers.onEnd?.()
  }

  currentRecognition = recognition

  try {
    recognition.start()
    return true
  } catch (e) {
    // start 在已运行状态下会抛错,忽略
    currentRecognition = null
    return false
  }
}

/** 停止 ASR 识别 */
export function stopListening(): void {
  if (currentRecognition) {
    try {
      currentRecognition.stop()
    } catch (e) {
      // 忽略
    }
    currentRecognition = null
  }
}

/** 当前是否正在识别 */
export function isListening(): boolean {
  return currentRecognition !== null
}
