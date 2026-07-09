/**
 * Mock 天气数据
 * 今日晴 22 度;明日多云 18-25 度 + 出行建议
 */

export interface WeatherDay {
  /** 日期标签(今日/明日) */
  label: string
  /** 星期 */
  weekday: string
  /** 天气描述 */
  text: string
  /** 图标 emoji */
  icon: string
  /** 当前温度 */
  temp: number
  /** 最低温度 */
  tempMin: number
  /** 最高温度 */
  tempMax: number
  /** 风向风力 */
  wind: string
  /** 湿度 */
  humidity: string
  /** 空气质量 */
  aqi: string
  /** 出行建议 */
  advice: string
}

export const mockWeather: {
  today: WeatherDay
  tomorrow: WeatherDay
  city: string
} = {
  city: '北京',
  today: {
    label: '今日',
    weekday: '6月25日 周四',
    text: '晴',
    icon: '☀️',
    temp: 22,
    tempMin: 16,
    tempMax: 24,
    wind: '北风 2 级',
    humidity: '45%',
    aqi: '良',
    advice: '今天阳光不错,温度适宜,适合到小区里散步晒太阳。出门记得戴帽子,多喝温水。'
  },
  tomorrow: {
    label: '明日',
    weekday: '6月26日 周五',
    text: '多云',
    icon: '⛅',
    temp: 21,
    tempMin: 18,
    tempMax: 25,
    wind: '东南风 3 级',
    humidity: '60%',
    aqi: '良',
    advice: '明天多云,早晚温差较大,记得加件外套。下午可能有零星小雨,出门带把伞更放心。'
  }
}
