const DEFAULT_SECOND_BRAIN_API_URL = 'https://rag.haseebzaheer.dev/api/chat'
const MAX_MESSAGE_LENGTH = 4000
const MAX_HISTORY_MESSAGES = 8
const DEFAULT_TIMEOUT_MS = 55_000
const DEFAULT_RATE_LIMIT_PER_MINUTE = 5
const DEFAULT_RATE_LIMIT_PER_DAY = 25
const minuteBuckets = new Map()
const dayBuckets = new Map()

export const config = {
  maxDuration: 60,
}

function sendJson(response, status, data) {
  response.status(status).json(data)
}

function getBackendSecret() {
  return process.env.SECOND_BRAIN_BACKEND_SECRET?.trim() || process.env.BACKEND_API_SECRET?.trim()
}

function positiveIntegerFromEnv(name, fallback) {
  const rawValue = process.env[name]?.trim()
  const value = Number.parseInt(rawValue || String(fallback), 10)

  return Number.isInteger(value) && value > 0 ? value : fallback
}

function headerValue(request, name) {
  const value = request.headers[name.toLowerCase()]

  if (Array.isArray(value)) {
    return value.find(Boolean)
  }

  return typeof value === 'string' && value.trim() ? value : undefined
}

function firstForwardedIp(value) {
  return value
    ?.split(',')
    .map((part) => part.trim())
    .find(Boolean)
}

function clientIpFromRequest(request) {
  return (
    firstForwardedIp(headerValue(request, 'x-forwarded-for')) ||
    headerValue(request, 'x-real-ip') ||
    headerValue(request, 'cf-connecting-ip') ||
    headerValue(request, 'x-vercel-forwarded-for') ||
    request.socket?.remoteAddress ||
    'unknown'
  )
}

function pruneBuckets(buckets, now) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key)
    }
  }
}

function checkBucket(buckets, key, limit, windowMs, now) {
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return { allowed: true, retryAfterSeconds: Math.ceil((resetAt - now) / 1000) }
  }

  if (current.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) }
  }

  current.count += 1
  return { allowed: true, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) }
}

function checkRateLimit(clientIp) {
  const now = Date.now()
  const minuteLimit = positiveIntegerFromEnv('SECOND_BRAIN_RATE_LIMIT_PER_MINUTE', DEFAULT_RATE_LIMIT_PER_MINUTE)
  const dayLimit = positiveIntegerFromEnv('SECOND_BRAIN_RATE_LIMIT_PER_DAY', DEFAULT_RATE_LIMIT_PER_DAY)

  pruneBuckets(minuteBuckets, now)
  pruneBuckets(dayBuckets, now)

  const minuteResult = checkBucket(minuteBuckets, clientIp, minuteLimit, 60_000, now)

  if (!minuteResult.allowed) {
    return {
      allowed: false,
      code: 'rate_limited',
      message: 'Too many chat requests. Please try again shortly.',
      retryAfterSeconds: minuteResult.retryAfterSeconds,
    }
  }

  const dayResult = checkBucket(dayBuckets, clientIp, dayLimit, 24 * 60 * 60 * 1000, now)

  if (!dayResult.allowed) {
    return {
      allowed: false,
      code: 'daily_quota_exceeded',
      message: 'The daily chat limit has been reached. Please try again tomorrow.',
      retryAfterSeconds: dayResult.retryAfterSeconds,
    }
  }

  return { allowed: true }
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

  const clientIp = clientIpFromRequest(request)
  const rateLimit = checkRateLimit(clientIp)

  if (!rateLimit.allowed) {
    response.setHeader('Retry-After', String(rateLimit.retryAfterSeconds))
    return sendJson(response, 429, {
      error: rateLimit.message,
      code: rateLimit.code,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    })
  }

  const backendUrl = process.env.SECOND_BRAIN_API_URL?.trim() || DEFAULT_SECOND_BRAIN_API_URL
  const timeoutMs = positiveIntegerFromEnv('SECOND_BRAIN_REQUEST_TIMEOUT_MS', DEFAULT_TIMEOUT_MS)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-backend-api-secret': backendSecret,
        'x-forwarded-for': clientIp,
        'x-real-ip': clientIp,
      },
      signal: controller.signal,
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
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return sendJson(response, 504, {
        error: 'The second brain service took too long to respond.',
        code: 'backend_timeout',
      })
    }

    return sendJson(response, 502, {
      error: 'The second brain service could not be reached.',
      code: 'backend_unreachable',
    })
  } finally {
    clearTimeout(timeout)
  }
}
