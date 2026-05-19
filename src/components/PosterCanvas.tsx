import { useRef } from 'react'
import { toPng } from 'html-to-image'
import { Download } from 'lucide-react'
import type { PosterData } from '../types'

interface Props {
  data: PosterData
  templateImage?: string
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

export default function PosterCanvas({ data, templateImage }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const light = isLight(data.colors.background)

  const handleDownload = async () => {
    if (!ref.current) return
    const dataUrl = await toPng(ref.current, { pixelRatio: 2 })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `poster-${Date.now()}.png`
    a.click()
  }

  const bg = data.colors.background
  const primary = data.colors.primary
  const secondary = data.colors.secondary
  const textColor = data.colors.text
  const accent = data.colors.accent

  // When template image is provided, render text overlay on top of it
  const renderTemplateOverlay = () => (
    <div className="h-full relative overflow-hidden flex flex-col items-center justify-center p-8 text-center gap-4">
      {/* Background image */}
      <img
        src={templateImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        crossOrigin="anonymous"
      />
      {/* Scrim for text readability */}
      <div
        className="absolute inset-0"
        style={{ background: hexToRgba(data.colors.background, 0.45) }}
      />
      {/* Text content */}
      <div className="relative z-10 space-y-4">
        {data.subtitle && (
          <p className="text-sm tracking-widest uppercase" style={{ color: data.colors.accent }}>
            {data.subtitle}
          </p>
        )}
        <h1
          className="text-4xl font-black leading-tight drop-shadow-lg"
          style={{ color: data.colors.text }}
        >
          {data.title}
        </h1>
        <div className="w-16 h-1 mx-auto rounded" style={{ background: accent }} />
        {data.body && (
          <p
            className="text-sm leading-relaxed max-w-xs drop-shadow"
            style={{ color: data.colors.text, opacity: 0.9 }}
          >
            {data.body}
          </p>
        )}
        {data.tagline && (
          <div
            className="inline-block px-5 py-2 rounded-full text-sm font-bold mt-2 backdrop-blur-sm"
            style={{ background: hexToRgba(primary, 0.85), color: isLight(primary) ? '#111' : '#fff' }}
          >
            {data.tagline}
          </div>
        )}
      </div>
    </div>
  )

  const renderLayout = () => {
    if (templateImage) return renderTemplateOverlay()

    switch (data.layout) {
      case 'split':
        return (
          <div className="flex h-full">
            <div className="w-2/5 flex items-center justify-center" style={{ background: primary }}>
              <div className="p-6 text-center">
                <div className="text-5xl font-black leading-tight" style={{ color: isLight(primary) ? '#111' : '#fff' }}>
                  {data.title.split('').map((c, i) => (
                    <div key={i}>{c}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center p-8 gap-4" style={{ color: textColor }}>
              {data.subtitle && <p className="text-lg font-semibold opacity-80">{data.subtitle}</p>}
              {data.body && <p className="text-sm leading-relaxed opacity-70">{data.body}</p>}
              {data.tagline && (
                <div className="inline-block mt-2 px-4 py-2 rounded-full text-xs font-bold" style={{ background: accent, color: isLight(accent) ? '#111' : '#fff' }}>
                  {data.tagline}
                </div>
              )}
            </div>
          </div>
        )

      case 'minimal':
        return (
          <div className="h-full flex flex-col justify-between p-10">
            <div className="w-12 h-1 rounded" style={{ background: accent }} />
            <div className="space-y-4" style={{ color: textColor }}>
              {data.subtitle && <p className="text-sm tracking-widest uppercase opacity-60">{data.subtitle}</p>}
              <h1 className="text-4xl font-light leading-tight">{data.title}</h1>
              {data.body && <p className="text-sm leading-relaxed opacity-70 max-w-xs">{data.body}</p>}
            </div>
            <div className="flex items-center justify-between">
              {data.tagline && <span className="text-xs opacity-50" style={{ color: textColor }}>{data.tagline}</span>}
              <div className="w-8 h-8 rounded-full" style={{ background: primary }} />
            </div>
          </div>
        )

      case 'bold':
        return (
          <div className="h-full relative overflow-hidden flex flex-col justify-end p-8">
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)` }} />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/3 translate-x-1/3 opacity-20" style={{ background: accent }} />
            <div className="relative z-10 space-y-3">
              {data.tagline && (
                <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: hexToRgba('#fff', 0.2), color: '#fff' }}>
                  {data.tagline}
                </span>
              )}
              <h1 className="text-4xl font-black leading-none text-white">{data.title}</h1>
              {data.subtitle && <p className="text-base font-medium text-white/80">{data.subtitle}</p>}
              {data.body && <p className="text-xs text-white/60 leading-relaxed">{data.body}</p>}
            </div>
          </div>
        )

      default:
        return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-4 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-24 h-24 rounded-full opacity-10" style={{ background: primary }} />
            <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full opacity-10" style={{ background: secondary }} />
            <div className="relative z-10 space-y-4" style={{ color: textColor }}>
              {data.subtitle && (
                <p className="text-sm tracking-widest uppercase opacity-60">{data.subtitle}</p>
              )}
              <h1 className="text-4xl font-black leading-tight">{data.title}</h1>
              <div className="w-16 h-1 mx-auto rounded" style={{ background: accent }} />
              {data.body && <p className="text-sm leading-relaxed opacity-75 max-w-xs">{data.body}</p>}
              {data.tagline && (
                <div className="inline-block px-5 py-2 rounded-full text-sm font-bold mt-2" style={{ background: primary, color: isLight(primary) ? '#111' : '#fff' }}>
                  {data.tagline}
                </div>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div
        ref={ref}
        style={{
          background: templateImage ? undefined : bg,
          width: '100%',
          aspectRatio: '3/4',
          borderRadius: '16px',
          overflow: 'hidden',
          fontFamily: `'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif`,
        }}
      >
        {renderLayout()}
      </div>

      <button
        onClick={handleDownload}
        className="w-full py-3 rounded-xl border border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-400 transition-all flex items-center justify-center gap-2 text-sm"
      >
        <Download size={16} /> 下载海报 PNG
      </button>

      <div className="flex gap-2 justify-center">
        {Object.entries(data.colors).map(([key, color]) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-full border border-zinc-600" style={{ background: color }} title={`${key}: ${color}`} />
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-zinc-500">
        {templateImage ? '模板底图模式' : `布局：${data.layout} · ${light ? '浅色' : '深色'}主题`}
      </p>
    </div>
  )
}
