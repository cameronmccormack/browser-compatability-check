import { isFeatureCompatible } from './browser-support/is-feature-compatible';
import browserConfig from './config/browser-config.json';
import { getFlattenedAttributes, getParsedCss } from './css-parser/css-parser';

const main = (): void => {
  const parsedCss = getParsedCss();
  const flattenedAttributes = getFlattenedAttributes(parsedCss);
  flattenedAttributes.forEach((attribute) =>
    console.log(
      isFeatureCompatible({ identifier: attribute.key }, browserConfig),
    ),
  );

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
