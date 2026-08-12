export interface HomePageContent {
  readonly title: string;
  readonly content: string;
  readonly subtitle01: string;
  readonly subcontent01: string;
  readonly subtitle02: string;
  readonly subcontent02: string;
}

export interface TaxonomyItem {
  readonly documentId: string;
  readonly name: string;
  readonly slug: string;
}

export interface ProductItem {
  readonly documentId: string;
  readonly model_name: string;
  readonly slug: string;
}

export interface PublishedContent {
  readonly homePage: HomePageContent;
  readonly productTypes: readonly TaxonomyItem[];
  readonly applications: readonly TaxonomyItem[];
  readonly products: readonly ProductItem[];
  readonly generatedAt: string;
}

