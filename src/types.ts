export interface PosterData {
  title: string
  subtitle: string
  body: string
  tagline: string
  colors: {
    background: string
    primary: string
    secondary: string
    text: string
    accent: string
  }
  layout: 'centered' | 'split' | 'minimal' | 'bold'
  decorations: string[]
}

export interface PosterForm {
  type: string
  title: string
  description: string
  style: string
  extraInfo: string
  templateImage: string
}

export const POSTER_TYPES = [
  { id: 'event', label: '活动宣传', icon: '🎉' },
  { id: 'holiday', label: '节日祝福', icon: '🎊' },
  { id: 'product', label: '商品促销', icon: '🛍️' },
  { id: 'brand', label: '品牌推广', icon: '✨' },
  { id: 'job', label: '招聘海报', icon: '💼' },
  { id: 'education', label: '教育培训', icon: '📚' },
  { id: 'food', label: '餐饮美食', icon: '🍜' },
  { id: 'custom', label: '自定义', icon: '🎨' },
]

export const STYLE_OPTIONS = [
  { id: 'modern', label: '现代简约' },
  { id: 'vibrant', label: '活力鲜艳' },
  { id: 'elegant', label: '高端典雅' },
  { id: 'retro', label: '复古怀旧' },
  { id: 'dark', label: '暗黑酷炫' },
  { id: 'warm', label: '温馨自然' },
]
