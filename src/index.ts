import { isFeatureCompatible } from './compatability/is-feature-compatible';
import browserConfig from './config/browser-config.json';

const main = (): void => {
  console.log(isFeatureCompatible('gap', browserConfig));
};

main();
