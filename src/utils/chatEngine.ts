/**
 * 小助对话引擎
 * - 关键词匹配 matchKeyword
 * - 话术库查询 getResponse
 * - 双模式切换(陪伴/代办,"帮我查"触发代办)
 * - 情绪关键词检测(命中"不想活""没意思""唉"返回关怀话术)
 */

import {
  chatScripts,
  getFallbackReply,
  type ChatScript,
  type ChatMode
} from '../data/chatScript'

export interface ChatResponse {
  /** 小助回复文本 */
  reply: string
  /** 命中的脚本(可空,空表示兜底) */
  script: ChatScript | null
  /** 当前应切换到的模式 */
  mode: ChatMode
  /** 是否需要提示子女端 */
  alertFamily: boolean
  /** 是否命中负面情绪 */
  isEmotionAlert: boolean
}

/** 情绪关键词(负面) */
const NEGATIVE_EMOTION_KEYWORDS = [
  '不想活',
  '没意思',
  '唉',
  '孤单',
  '活够',
  '想死',
  '不想过',
  '没盼头',
  '无聊',
  '没劲'
]

/** 代办模式触发关键词 */
const ERRAND_TRIGGER_KEYWORDS = ['帮我查', '查一下', '帮我看看', '帮我办', '帮我做']

/**
 * 关键词匹配:在话术库中找到第一个命中的脚本
 * @param text 老人输入文本
 * @returns 命中的 ChatScript,未命中返回 null
 */
export function matchKeyword(text: string): ChatScript | null {
  if (!text || !text.trim()) return null
  const normalized = text.trim()

  // 遍历话术库,返回第一个关键词命中的脚本
  for (const script of chatScripts) {
    for (const kw of script.keywords) {
      if (normalized.includes(kw)) {
        return script
      }
    }
  }
  return null
}

/**
 * 检测是否命中负面情绪关键词
 */
export function detectNegativeEmotion(text: string): boolean {
  if (!text) return false
  return NEGATIVE_EMOTION_KEYWORDS.some((kw) => text.includes(kw))
}

/**
 * 检测是否需要切换到代办模式
 */
export function shouldSwitchToErrand(text: string): boolean {
  if (!text) return false
  return ERRAND_TRIGGER_KEYWORDS.some((kw) => text.includes(kw))
}

/**
 * 话术库查询:根据老人输入返回小助回复
 * @param text 老人输入文本
 * @param currentMode 当前对话模式
 */
export function getResponse(
  text: string,
  currentMode: ChatMode = 'companion'
): ChatResponse {
  const script = matchKeyword(text)

  // 命中脚本
  if (script) {
    const nextMode: ChatMode = script.switchToErrand
      ? 'errand'
      : script.category === 'errand'
      ? 'errand'
      : 'companion'

    return {
      reply: script.reply,
      script,
      mode: nextMode,
      alertFamily: Boolean(script.alertFamily),
      isEmotionAlert: script.category === 'emotion' && Boolean(script.alertFamily)
    }
  }

  // 未命中脚本,但检测到负面情绪关键词 → 返回关怀兜底
  if (detectNegativeEmotion(text)) {
    return {
      reply:
        '奶奶,小助听出您心里不好受。您不是一个人,小助一直在呢。要不您跟小助多说点?或者小助这就给您儿子打个电话,让他陪您说说话?',
      script: null,
      mode: currentMode,
      alertFamily: true,
      isEmotionAlert: true
    }
  }

  // 代办模式触发但未命中具体脚本
  if (shouldSwitchToErrand(text)) {
    return {
      reply:
        '好嘞奶奶,小助这就办。您要查什么?查天气、查日历、讲故事,跟小助说一声就行。',
      script: null,
      mode: 'errand',
      alertFamily: false,
      isEmotionAlert: false
    }
  }

  // 兜底话术
  return {
    reply: getFallbackReply(),
    script: null,
    mode: currentMode,
    alertFamily: false,
    isEmotionAlert: false
  }
}
