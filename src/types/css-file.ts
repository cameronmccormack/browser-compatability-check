export interface CssPath {
  path: string;
  type: 'css' | 'sass' | 'less';
}

export interface CssFile extends CssPath {
  contents: string;
}
