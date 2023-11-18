export type CssFeature = {
  identifier: string;
  value: string;
  context?: CssContext;
  type: CssType;
};

type CssContext = 'flex_context' | 'grid_context' | 'multicol_context';

type CssType = 'property' | 'selector';
