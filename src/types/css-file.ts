export interface CssPath {
  path: string;
  type: 'css' | 'sass' | 'scss' | 'less';
}

export interface CssFile extends CssPath {
  contents: string;
}
