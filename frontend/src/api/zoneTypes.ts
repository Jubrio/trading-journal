import { api } from '../lib/api'
import type { ZoneType } from '../types'

export async function fetchZoneTypes() {
  const { data } = await api.get<ZoneType[]>('/zone-types')
  return data
}
