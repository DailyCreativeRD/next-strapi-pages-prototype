// Image proxy: serves GCS bucket objects on this Worker's hostname.
// Cache-Control is aggressive because Strapi names files by content hash —
// a changed image is a new URL, so cached objects can never go stale.
export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const gcsUrl = `https://storage.googleapis.com/${env.GCS_BUCKET}${url.pathname}`;
    const response = await fetch(gcsUrl);
    if (!response.ok) {
      return new Response('Not found', { status: 404 });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  },
};
