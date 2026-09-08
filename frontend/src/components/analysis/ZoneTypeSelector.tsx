interface Option {
  id: number
  code: string
  label: string
}

export default function ZoneTypeSelector({
  options,
  selected,
  onChange,
}: {
  options: Option[]
  selected: number[]
  onChange: (ids: number[]) => void
}) {
  function toggle(id: number) {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.id)
        return (
          <button
            type="button"
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              active
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-line bg-white text-ink/70 hover:border-ink/30'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
