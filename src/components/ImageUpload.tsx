import { useRef, useState } from 'react'
import { Upload, X, Image } from 'lucide-react'

interface Props {
  value: string
  onChange: (dataUrl: string) => void
}

export default function ImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => onChange(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        海报模板 <span className="text-zinc-500 font-normal">（选填，上传底图）</span>
      </label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-zinc-600">
          <img src={value} alt="模板预览" className="w-full h-32 object-cover" />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-2 left-2 text-xs text-white/70 bg-black/50 px-2 py-0.5 rounded-full">
            已上传模板
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-all ${
            dragging
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
            {dragging ? <Image size={18} className="text-violet-400" /> : <Upload size={18} className="text-zinc-400" />}
          </div>
          <p className="text-sm text-zinc-400">点击或拖拽上传底图</p>
          <p className="text-xs text-zinc-600">支持 JPG、PNG、WEBP</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
