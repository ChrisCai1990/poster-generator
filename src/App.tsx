import { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import PosterForm from './components/PosterForm'
import PosterCanvas from './components/PosterCanvas'
import SettingsModal, { AVAILABLE_MODELS } from './components/SettingsModal'
import { generatePoster } from './lib/claude'
import type { PosterData, PosterForm as PosterFormType } from './types'

const DEFAULT_FORM: PosterFormType = {
  type: '活动宣传',
  title: '',
  description: '',
  style: 'modern',
  extraInfo: '',
  templateImage: '',
}

export default function App() {
  const [form, setForm] = useState<PosterFormType>(DEFAULT_FORM)
  const [posterData, setPosterData] = useState<PosterData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [model, setModel] = useState(() => localStorage.getItem('claude_model') || AVAILABLE_MODELS[1].id)

  useEffect(() => {
    localStorage.setItem('claude_model', model)
  }, [model])

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await generatePoster(form, model)
      setPosterData(data)
    } catch (e: unknown) {
      setError(`生成失败：${e instanceof Error ? e.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  const currentModelLabel = AVAILABLE_MODELS.find(m => m.id === model)?.label ?? model

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">✦ 海报生成器</h1>
          <p className="text-xs text-zinc-500 mt-0.5">AI 驱动，一键生成精美海报</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 text-sm transition-all"
        >
          <Settings size={15} />
          {currentModelLabel}
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-5">填写信息</h2>
            <PosterForm
              form={form}
              onChange={setForm}
              onGenerate={handleGenerate}
              loading={loading}
              hasApiKey={true}
            />
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-5">海报预览</h2>
            {posterData ? (
              <PosterCanvas data={posterData} templateImage={form.templateImage || undefined} />
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-zinc-600 gap-3">
                <div className="text-5xl">🖼️</div>
                <p className="text-sm">填写信息后点击「一键生成海报」</p>
                <p className="text-xs">AI 将为您设计配色和排版</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={setModel}
          currentModel={model}
        />
      )}
    </div>
  )
}
