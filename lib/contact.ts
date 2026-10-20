export const CONTACT_TOPICS = [
  { value: 'transfer', label: 'Airport transfer' },
  { value: 'tour', label: 'Day tour' },
  { value: 'price', label: 'Price question' },
  { value: 'other', label: 'Something else' },
] as const

export function topicLabel(value: string) {
  return CONTACT_TOPICS.find(t => t.value === value)?.label ?? value
}
