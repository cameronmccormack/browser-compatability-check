export type ParsedCss = {
  children: {
    [key: string]: ParsedCss;
  };
  attributes: Attributes;
};

type Attributes = {
  [key: string]: string;
};
