import type {
  HomePageContent,
  ProductItem,
  PublishedContent,
  TaxonomyItem,
} from './content-model';

interface StrapiSingleResponse {
  readonly data: unknown;
}

interface StrapiCollectionResponse {
  readonly data: unknown;
}

export class StrapiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StrapiConfigurationError';
  }
}

export class StrapiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'StrapiRequestError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

export function parseHomePage(value: unknown): HomePageContent {
  if (!isRecord(value)) {
    throw new TypeError('Strapi home page data must be an object.');
  }

  return {
    title: readString(value, 'title'),
    content: readString(value, 'content'),
    subtitle01: readString(value, 'subtitle01'),
    subcontent01: readString(value, 'subcontent01'),
    subtitle02: readString(value, 'subtitle02'),
    subcontent02: readString(value, 'subcontent02'),
  };
}

export function parseTaxonomyItems(value: unknown): readonly TaxonomyItem[] {
  if (!Array.isArray(value)) {
    throw new TypeError('Strapi taxonomy data must be an array.');
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new TypeError(`Strapi taxonomy item ${index} must be an object.`);
    }

    const documentId = readString(item, 'documentId');
    const name = readString(item, 'name');
    if (!documentId || !name) {
      throw new TypeError(`Strapi taxonomy item ${index} is missing documentId or name.`);
    }

    return { documentId, name, slug: readString(item, 'slug') };
  });
}

export function parseProducts(value: unknown): readonly ProductItem[] {
  if (!Array.isArray(value)) {
    throw new TypeError('Strapi product data must be an array.');
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new TypeError(`Strapi product item ${index} must be an object.`);
    }

    const documentId = readString(item, 'documentId');
    if (!documentId) {
      throw new TypeError(`Strapi product item ${index} is missing documentId.`);
    }

    return {
      documentId,
      model_name: readString(item, 'model_name'),
      slug: readString(item, 'slug'),
    };
  });
}

async function request<TResponse>(path: string): Promise<TResponse> {
  const apiUrl = process.env.STRAPI_API_URL?.replace(/\/$/, '');
  const token = process.env.STRAPI_API_TOKEN;

  if (!apiUrl || !token) {
    throw new StrapiConfigurationError(
      'STRAPI_API_URL and STRAPI_API_TOKEN are required during the static build.',
    );
  }

  const response = await fetch(`${apiUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new StrapiRequestError(
      `Strapi request ${path} failed with HTTP ${response.status}.`,
      response.status,
    );
  }

  return (await response.json()) as TResponse;
}

export async function getPublishedContent(): Promise<PublishedContent> {
  const [homePage, productTypes, applications, products] = await Promise.all([
    request<StrapiSingleResponse>('/api/home-page?status=published'),
    request<StrapiCollectionResponse>('/api/product-types?status=published&sort=name:asc'),
    request<StrapiCollectionResponse>('/api/applications?status=published&sort=name:asc'),
    request<StrapiCollectionResponse>('/api/products?status=published'),
  ]);

  return {
    homePage: parseHomePage(homePage.data),
    productTypes: parseTaxonomyItems(productTypes.data),
    applications: parseTaxonomyItems(applications.data),
    products: parseProducts(products.data),
    generatedAt: new Date().toISOString(),
  };
}
