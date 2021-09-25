export type TabStore<K extends string> = {
  active: K
  tabs: Record<K, string>
  register(key: K, title?: string): boolean
}

function titlize(s: string) {
  if (!s) {
    return s
  }

  return `${s[0].toUpperCase()}${s.slice(1)}`
}

export function tabStore<K extends string>(active: K): TabStore<K> {
  const tabs = {} as Record<K, string>

  return {
    active,
    tabs,
    register(key: K, title?: string) {
      tabs[key] = title || titlize(key)
      return key === active
    },
  }
}
