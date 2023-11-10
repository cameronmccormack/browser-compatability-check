export type CssFeature = {
  identifier: string;
  context?: CssContext;
};

export type CssContext = 'flex_context' | 'grid_context' | 'multicol_context';
