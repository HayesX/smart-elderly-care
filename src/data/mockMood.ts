/**
 * Mock 本周情绪曲线(7 天数据)
 * 用于子女端爸妈心情看板
 */

export type MoodLevel = 'happy' | 'calm' | 'low' | 'sad'

export interface MoodDay {
  /** 日期 */
  date: string
  /** 星期 */
  weekday: string
  /** 情绪等级 */
  level: MoodLevel
  /** 数值 1-5(用于折线图) */
  score: number
  /** 当日聊天关键词 */
  keywords: string[]
  /** 摘要 */
  summary: string
}

export const moodLevelText: Record<MoodLevel, string> = {
  happy: '开心',
  calm: '平静',
  low: '低落',
  sad: '悲伤'
}

export const moodLevelEmoji: Record<MoodLevel, string> = {
  happy: '😊',
  calm: '😌',
  low: '😔',
  sad: '😢'
}

export const mockMoodWeek: MoodDay[] = [
  {
    date: '2026-06-19',
    weekday: '周四',
    level: 'happy',
    score: 5,
    keywords: ['孙子', '回家', '高兴'],
    summary: '提到孙子周末要回来,情绪明显开心。'
  },
  {
    date: '2026-06-20',
    weekday: '周五',
    level: 'calm',
    score: 4,
    keywords: ['天气', '散步'],
    summary: '聊到下午出去散步,情绪平稳。'
  },
  {
    date: '2026-06-21',
    weekday: '周六',
    level: 'happy',
    score: 5,
    keywords: ['孙子', '吃饭', '热闹'],
    summary: '孙子到家吃饭,情绪非常好。'
  },
  {
    date: '2026-06-22',
    weekday: '周日',
    level: 'low',
    score: 2,
    keywords: ['孙子', '走', '想'],
    summary: '孙子离开后有些失落,说"家里又静了"。'
  },
  {
    date: '2026-06-23',
    weekday: '周一',
    level: 'calm',
    score: 3,
    keywords: ['药', '医院'],
    summary: '询问用药情况,情绪平稳。'
  },
  {
    date: '2026-06-24',
    weekday: '周二',
    level: 'low',
    score: 2,
    keywords: ['唉', '孤单'],
    summary: '多次叹气,提到"一个人待着没意思"。已触发关怀。'
  },
  {
    date: '2026-06-25',
    weekday: '今日',
    level: 'calm',
    score: 4,
    keywords: ['天气', '散步', '小助'],
    summary: '与小助聊天后情绪改善,主动询问明天天气。'
  }
]

/** 本周情绪关键词汇总(用于词云展示) */
export const mockMoodKeywords: { word: string; count: number }[] = [
  { word: '孙子', count: 8 },
  { word: '天气', count: 5 },
  { word: '散步', count: 4 },
  { word: '药', count: 3 },
  { word: '想', count: 3 },
  { word: '孤单', count: 2 },
  { word: '唉', count: 2 },
  { word: '吃饭', count: 2 },
  { word: '小助', count: 2 }
]

/** 本周情绪摘要(用于报告导出) */
export const mockMoodSummary: string =
  '本周奶奶情绪总体平稳,周六因孙子回家最为开心;周日孙子离开后出现短暂低落;周二出现"孤单""没意思"等负面情绪信号,平台已触发关怀话术并推送子女端。建议本周末多安排家人陪伴或视频通话。'
