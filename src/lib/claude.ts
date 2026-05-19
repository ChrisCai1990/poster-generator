import type { PosterData, PosterForm } from '../types'

const STYLE_PALETTES: Record<string, string> = {
  modern: '简洁白色/浅灰背景，深色文字，单一高亮色',
  vibrant: '鲜艳渐变色，高饱和度，充满活力',
  elegant: '黑金或深色背景，金色/白色文字，奢华感',
  retro: '暖棕/米黄色调，复古字体感，怀旧氛围',
  dark: '深黑背景，霓虹或高亮色，赛博朋克风',
  warm: '米白/暖橙背景，柔和色彩，自然温馨',
}

export async function generatePoster(form: PosterForm, model: string): Promise<PosterData> {
  const styleHint = STYLE_PALETTES[form.style] || '现代简约风格'

  const prompt = `你是一个专业的海报设计师。请根据以下信息生成海报设计方案，必须返回严格的 JSON 格式，不要添加任何其他文字、不要用 markdown 代码块包裹。

海报类型：${form.type}
主题/标题：${form.title}
描述：${form.description}
风格要求：${form.style}（${styleHint}）
补充信息：${form.extraInfo || '无'}

返回以下 JSON 结构（颜色必须是十六进制格式如 #FF5733）：
{
  "title": "主标题文字（简短有力，最多15字）",
  "subtitle": "副标题（补充说明，最多20字）",
  "body": "正文内容（核心信息，最多50字）",
  "tagline": "口号/标语（最多10字，可为空字符串）",
  "colors": {
    "background": "#颜色",
    "primary": "#颜色",
    "secondary": "#颜色",
    "text": "#颜色",
    "accent": "#颜色"
  },
  "layout": "centered或split或minimal或bold之一",
  "decorations": ["描述装饰元素1", "描述装饰元素2"]
}`

  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error || `HTTP ${res.status}`
    if (res.status === 429) throw new Error('请求太频繁，请稍后再试')
    throw new Error(msg)
  }

  const json = await res.json()
  const text: string = json.content?.[0]?.text ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI 返回格式异常，请重试')

  return JSON.parse(jsonMatch[0]) as PosterData
}
