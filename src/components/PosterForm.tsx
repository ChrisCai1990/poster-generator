import { POSTER_TYPES, STYLE_OPTIONS } from '../types'
import type { PosterForm as PosterFormType } from '../types'
import { Sparkles, Loader2 } from 'lucide-react'
import ImageUpload from './ImageUpload'

interface Props {
  form: PosterFormType
  onChange: (form: PosterFormType) => void
  onGenerate: () => void
  loading: boolean
  hasApiKey: boolean
}

export default function PosterForm({ form, onChange, onGenerate, loading, hasApiKey }: Props) {
  const set = (field: keyof PosterFormType, value: string) =>
    onChange({ ...form, [field]: value })

  return (
    <div className="space-y-5">
      {/* Poster type */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">海报类型</label>
        <div className="grid grid-cols-4 gap-2">
          {POSTER_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => set('type', t.id === 'custom' ? '' : t.label)}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs transition-all ${
                (t.id !== 'custom' && form.type === t.label) || (t.id === 'custom' && !POSTER_TYPES.slice(0, -1).some(x => x.label === form.type))
                  ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        {/* Custom type input */}
        {!POSTER_TYPES.slice(0, -1).some(t => t.label === form.type) && (
          <input
            type="text"
            value={form.type}
            onChange={e => set('type', e.target.value)}
            placeholder="输入自定义海报类型..."
            className="mt-2 w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-sm"
          />
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          主题 / 标题 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="例：双十一大促销、张三生日快乐、公司周年庆..."
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">描述信息</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="补充细节，如时间、地点、折扣力度、主要内容等..."
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-sm resize-none"
        />
      </div>

      {/* Style */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">视觉风格</label>
        <div className="grid grid-cols-3 gap-2">
          {STYLE_OPTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => set('style', s.id)}
              className={`py-2 rounded-lg border text-sm transition-all ${
                form.style === s.id
                  ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template image upload */}
      <ImageUpload
        value={form.templateImage}
        onChange={v => set('templateImage', v)}
      />

      {/* Extra info */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          补充要求 <span className="text-zinc-500 font-normal">（选填）</span>
        </label>
        <input
          type="text"
          value={form.extraInfo}
          onChange={e => set('extraInfo', e.target.value)}
          placeholder="如：突出红色、加入二维码占位、繁体中文..."
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-sm"
        />
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={loading || !form.title.trim() || !hasApiKey}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2 text-sm"
      >
        {loading ? (
          <><Loader2 size={18} className="animate-spin" /> AI 生成中...</>
        ) : (
          <><Sparkles size={18} /> 一键生成海报</>
        )}
      </button>

      {!hasApiKey && (
        <p className="text-center text-xs text-amber-400">请先在右上角设置 Gemini API Key</p>
      )}
    </div>
  )
}
