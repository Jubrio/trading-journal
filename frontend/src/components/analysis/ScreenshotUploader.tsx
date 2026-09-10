import { useRef, useState } from 'react'
import { uploadScreenshot, deleteScreenshot, type Screenshot } from '../../api/screenshots'

const TYPES = [
  { value: 'before_entry', label: 'Avant entrée' },
  { value: 'at_entry', label: "À l'entrée" },
  { value: 'after_close', label: 'Après clôture' },
  { value: 'position', label: 'Position' },
] as const

export default function ScreenshotUploader({
  analysisId,
  initial,
}: {
  analysisId: number
  initial: Screenshot[]
}) {
  const [shots, setShots] = useState<Screenshot[]>(initial)
  const [type, setType] = useState<(typeof TYPES)[number]['value']>('before_entry')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setBusy(true)
    try {
      const shot = await uploadScreenshot(analysisId, file, type, description)
      setShots((s) => [...s, shot])
      setDescription('')
      if (inputRef.current) inputRef.current.value = ''
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id: number) {
    await deleteScreenshot(id)
    setShots((s) => s.filter((x) => x.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="input"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            placeholder="Ex : retest OB M15"
          />
        </label>
        <label className="cursor-pointer rounded bg-ink px-4 py-2.5 text-center text-sm font-medium text-white">
          {busy ? 'Envoi…' : 'Choisir une image'}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
        </label>
      </div>

      {shots.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shots.map((s) => (
            <div key={s.id} className="group relative border border-line bg-white">
              <img src={s.image_url} alt={s.description ?? ''} className="h-32 w-full object-cover" />
              <div className="p-2 text-xs">
                <span className="font-mono text-ink/60">{s.type}</span>
                {s.description && <p className="truncate">{s.description}</p>}
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="absolute right-1 top-1 hidden rounded bg-loss px-2 py-1 text-xs text-white group-hover:block"
              >
                Suppr.
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}