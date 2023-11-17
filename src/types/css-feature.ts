export type CssFeature = {
  identifier: string;
  value: string;
  context?: CssContext;
};

type CssContext = 'flex_context' | 'grid_context' | 'multicol_context';
