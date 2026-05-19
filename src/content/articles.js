const articleModules = import.meta.glob('./articles/**/index.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const articleImageModules = import.meta.glob('./articles/**/images/*', {
  eager: true,
  import: 'default',
  query: '?url',
})

function toArticlePath(path) {
  return path.replace('./articles/', '').replace('/index.md', '')
}

function parseFrontmatterValue(value) {
  const trimmedValue = value.trim()

  if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
    return trimmedValue
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean)
  }

  return trimmedValue.replace(/^["']|["']$/g, '')
}

function parseArticleMarkdown(rawArticle) {
  if (!rawArticle.startsWith('---')) {
    return { content: rawArticle.trim(), data: {} }
  }

  const closingFenceIndex = rawArticle.indexOf('\n---', 3)
  if (closingFenceIndex === -1) {
    return { content: rawArticle.trim(), data: {} }
  }

  const frontmatter = rawArticle.slice(3, closingFenceIndex).trim()
  const content = rawArticle.slice(closingFenceIndex + 4).trim()
  const data = Object.fromEntries(
    frontmatter
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(':')
        if (separatorIndex === -1) return null

        const key = line.slice(0, separatorIndex).trim()
        const value = line.slice(separatorIndex + 1)
        return [key, parseFrontmatterValue(value)]
      })
      .filter(Boolean),
  )

  return { content, data }
}

function normalizeArticle(rawArticle, path) {
  const { content, data } = parseArticleMarkdown(rawArticle)
  const folderSlug = toArticlePath(path)
  const slug = data.slug || folderSlug

  return {
    content,
    date: data.date || '',
    description: data.description || '',
    readTime: data.readTime || '',
    slug,
    tags: Array.isArray(data.tags) ? data.tags : [],
    title: data.title || slug,
    type: data.type || 'Article',
  }
}

export const articles = Object.entries(articleModules)
  .map(([path, rawArticle]) => normalizeArticle(rawArticle, path))
  .sort((a, b) => b.date.localeCompare(a.date))

export function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug)
}

export function resolveArticleImage(articleSlug, src) {
  if (!src?.startsWith('./images/')) return src

  const imagePath = `./articles/${articleSlug}/${src.replace('./', '')}`
  return articleImageModules[imagePath] || src
}

export function getYouTubeVideoId(url) {
  try {
    const parsedUrl = new URL(url)

    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1) || null
    }

    if (parsedUrl.hostname.includes('youtube.com')) {
      if (parsedUrl.pathname === '/watch') return parsedUrl.searchParams.get('v')
      if (parsedUrl.pathname.startsWith('/embed/')) return parsedUrl.pathname.split('/')[2] || null
      if (parsedUrl.pathname.startsWith('/shorts/')) return parsedUrl.pathname.split('/')[2] || null
    }
  } catch {
    return null
  }

  return null
}
