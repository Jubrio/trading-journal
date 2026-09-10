import { api } from '../lib/api'

export interface Screenshot {
  id: number
  analysis_id: number
  trade_id: number | null
  image_url: string
  type: 'before_entry' | 'at_entry' | 'after_close' | 'position'
  description: string | null
  created_at: string
}

export async function uploadScreenshot(
  analysisId: number,
  file: File,
  type: Screenshot['type'],
  description?: string
) {
  const form = new FormData()
  form.append('image', file)
  form.append('type', type)
  if (description) form.append('description', description)

  const { data } = await api.post<Screenshot>(
    `/analyses/${analysisId}/screenshots`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data
}

export async function deleteScreenshot(id: number) {
  await api.delete(`/screenshots/${id}`)
}