import { isFeatureCompatible } from './compatability/is-feature-compatible';
import browserConfig from './config/browser-config.json';

const main = (): void => {
  console.log(isFeatureCompatible({ identifier: 'gap' }, browserConfig));
  console.log(
    isFeatureCompatible(
      { identifier: 'gap', context: 'flex_context' },
      browserConfig,
    ),
  );
  console.log(
    isFeatureCompatible(
      { identifier: 'gap', context: 'grid_context' },
      browserConfig,
    ),
  );
  console.log(
    isFeatureCompatible(
      { identifier: 'aspect-ratio', context: 'grid_context' },
      browserConfig,
    ),
  );
};

main();
