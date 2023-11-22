export type CssFeature = CssProperty | CssSelector | CssAtRule | CssFunction;

export type FormattedCss = {
  properties: CssProperty[];
  selectors: CssSelector[];
  atRules: CssAtRule[];
  functions: CssFunction[];
};

export type CssFunction = {
  identifier: string;
  type: 'function';
};

export type CssAtRule = {
  identifier: string;
  type: 'at-rule';
};

export type CssSelector = {
  identifier: string;
  type: 'selector';
};

export type CssProperty = {
  identifier: string;
  value: string;
  context?: CssContext;
  type: 'property';
};

type CssContext = 'flex_context' | 'grid_context' | 'multicol_context';
