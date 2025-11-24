const KEY = 'chatkit_thread_id'

export function getThreadId() {
  return sessionStorage.getItem(KEY)
}

export function setThreadId(id: string | null) {
  if (id) {
    sessionStorage.setItem(KEY, id)
  }
}
