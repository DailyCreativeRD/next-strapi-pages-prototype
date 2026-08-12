import { getPublishedContent } from '../lib/strapi-client';

export const dynamic = 'force-static';

export default async function HomePage() {
  const content = await getPublishedContent();
  const deploymentLabel = process.env.DEPLOYMENT_LABEL ?? 'local';

  return (
    <main>
      <header className="hero">
        <p className="eyebrow">Static export prototype · {deploymentLabel}</p>
        <h1>{content.homePage.title || 'Phihong Technology'}</h1>
        <p>{content.homePage.content || 'Published Strapi content is available.'}</p>
      </header>

      <section className="status" aria-label="Build information">
        <div>
          <span>Content source</span>
          <strong>Strapi published API</strong>
        </div>
        <div>
          <span>Generated</span>
          <strong>{content.generatedAt}</strong>
        </div>
        <div>
          <span>Products</span>
          <strong>{content.products.length}</strong>
        </div>
      </section>

      <section>
        <h2>{content.homePage.subtitle01 || 'Product categories'}</h2>
        <p>{content.homePage.subcontent01}</p>
        <div className="grid">
          {content.productTypes.map((item) => (
            <article key={item.documentId}>
              <p className="tag">Product type</p>
              <h3>{item.name}</h3>
              <p>/{item.slug}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>{content.homePage.subtitle02 || 'Applications'}</h2>
        <p>{content.homePage.subcontent02}</p>
        <div className="grid">
          {content.applications.map((item) => (
            <article key={item.documentId}>
              <p className="tag">Application</p>
              <h3>{item.name}</h3>
              <p>/{item.slug}</p>
            </article>
          ))}
        </div>
      </section>

      {content.products.length === 0 ? (
        <p className="empty">No published products exist yet. This is a valid empty state.</p>
      ) : null}
    </main>
  );
}

