const KEY = 'chatkit_thread_id'

export function getThreadId() {
  return sessionStorage.getItem(KEY)
}

export function setThreadId(id: string | null) {
  // Create a new one if missing
  if (id) {
    sessionStorage.setItem(KEY, id)
  }
}
