const DEFAULT_SECOND_BRAIN_API_URL = 'https://rag.haseebzaheer.dev/api/chat'
const MAX_MESSAGE_LENGTH = 4000
const MAX_HISTORY_MESSAGES = 8

function sendJson(response, status, data) {
  response.status(status).json(data)
}

function getBackendSecret() {
  return process.env.SECOND_BRAIN_BACKEND_SECRET?.trim() || process.env.BACKEND_API_SECRET?.trim()
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return []

  return history
    .filter((message) => message && typeof message === 'object')
    .map((message) => {
      if ((message.role !== 'user' && message.role !== 'assistant') || typeof message.content !== 'string') {
        return null
      }

      const content = message.content.trim()
      if (!content) return null

      return {
        role: message.role,
        content: content.slice(0, MAX_MESSAGE_LENGTH),
      }
    })
    .filter(Boolean)
    .slice(-MAX_HISTORY_MESSAGES)
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.', code: 'method_not_allowed' })
  }

  const backendSecret = getBackendSecret()

  if (!backendSecret) {
    return sendJson(response, 500, {
      error: 'The second brain chat is not configured yet.',
      code: 'backend_secret_missing',
    })
  }

  const body = request.body && typeof request.body === 'object' ? request.body : {}
  const message = body.message

  if (typeof message !== 'string') {
    return sendJson(response, 400, { error: 'Message must be a string.', code: 'invalid_message' })
  }

  const trimmedMessage = message.trim()

  if (!trimmedMessage) {
    return sendJson(response, 400, { error: 'Message cannot be empty.', code: 'empty_message' })
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return sendJson(response, 400, {
      error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      code: 'message_too_long',
    })
  }

  const backendUrl = process.env.SECOND_BRAIN_API_URL?.trim() || DEFAULT_SECOND_BRAIN_API_URL

  try {
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-backend-api-secret': backendSecret,
      },
      body: JSON.stringify({
        message: trimmedMessage,
        history: normalizeHistory(body.history),
      }),
    })
    const payload = await backendResponse.json().catch(() => ({
      error: 'The second brain returned an unreadable response.',
      code: 'invalid_backend_response',
    }))
    const backendRequestId = backendResponse.headers.get('x-request-id')

    if (backendRequestId) {
      response.setHeader('x-request-id', backendRequestId)
    }

    return sendJson(response, backendResponse.status, payload)
  } catch {
    return sendJson(response, 502, {
      error: 'The second brain service could not be reached.',
      code: 'backend_unreachable',
    })
  }
}
