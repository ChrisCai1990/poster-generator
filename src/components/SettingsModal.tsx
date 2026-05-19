import { useState } from 'react'
import { X, Settings2 } from 'lucide-react'

export const AVAILABLE_MODELS = [
  { id: 'gemini-1.5-flash',   label: 'Gemini 1.5 Flash', note: '免费·快速' },
  { id: 'gemini-1.5-pro',     label: 'Gemini 1.5 Pro',   note: '免费·推荐' },
  { id: 'gemini-2.0-flash',   label: 'Gemini 2.0 Flash', note: '最新' },
]

interface Props {
  onClose: () => void
  onSave: (model: string) => void
  currentModel: string
}

export default function SettingsModal({ onClose, onSave, currentModel }: Props) {
  const [model, setModel] = useState(currentModel || AVAILABLE_MODELS[1].id)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings2 size={18} /> 模型设置
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {AVAILABLE_MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                model === m.id
                  ? 'border-violet-500 bg-violet-500/10 text-white'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="font-medium">{m.label}</span>
              <span className={`text-xs ${model === m.id ? 'text-violet-400' : 'text-zinc-600'}`}>{m.note}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400 transition-colors text-sm"
          >
            取消
          </button>
          <button
            onClick={() => { onSave(model); onClose() }}
            className="flex-1 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors text-sm"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
