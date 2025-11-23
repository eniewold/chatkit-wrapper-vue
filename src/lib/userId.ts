const KEY = 'chatkit_user_id'

export function checkUserId(): string {
  let userId = getUserId()
  if (!userId) {
    userId = generateUserId()
    storeUserId(userId)
  }
  return userId
}

export function getUserId() {
  return sessionStorage.getItem(KEY)
}
export function generateUserId() {
  return crypto.randomUUID()
}

export function storeUserId(id: string) {
  // Create a new one if missing
  if (id) {
    sessionStorage.setItem(KEY, id)
  }
}
