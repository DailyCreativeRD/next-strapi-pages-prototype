import { describe, expect, it } from 'vitest';
import { parseHomePage, parseProducts, parseTaxonomyItems } from './strapi-client';

describe('Strapi response parsing', () => {
  it('parses a valid home page', () => {
    expect(parseHomePage({ title: 'Home', content: 'Content' })).toMatchObject({
      title: 'Home',
      content: 'Content',
      subtitle01: '',
    });
  });

  it('rejects malformed taxonomy data', () => {
    expect(() => parseTaxonomyItems([{ documentId: '', name: 'Missing ID' }])).toThrow(
      /missing documentId or name/,
    );
  });

  it('accepts an empty product collection', () => {
    expect(parseProducts([])).toEqual([]);
  });
});

