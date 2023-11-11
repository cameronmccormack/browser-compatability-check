import { isFeatureCompatible } from './browser-support/is-feature-compatible';
import browserConfig from './config/browser-config.json';
import { getFlattenedAttributes, getParsedCss } from './css-parser/css-parser';

const main = (): void => {
  const parsedCss = getParsedCss();
  const flattenedAttributes = getFlattenedAttributes(parsedCss);
  flattenedAttributes.forEach((attribute) =>
    console.log(
      isFeatureCompatible(
        { identifier: attribute.key, value: attribute.value },
        browserConfig,
      ),
    ),
  );

  console.log(
    isFeatureCompatible({ identifier: 'gap', value: '4px' }, browserConfig),
  );
  console.log(
    isFeatureCompatible(
      { identifier: 'gap', value: '4px', context: 'flex_context' },
      browserConfig,
    ),
  );
  console.log(
    isFeatureCompatible(
      { identifier: 'gap', value: '4px', context: 'grid_context' },
      browserConfig,
    ),
  );
  console.log(
    isFeatureCompatible(
      { identifier: 'aspect-ratio', value: '4', context: 'grid_context' },
      browserConfig,
    ),
  );

  console.log(
    isFeatureCompatible(
      { identifier: 'display', value: 'grid' },
      browserConfig,
    ),
  );
  console.log(
    isFeatureCompatible(
      { identifier: 'display', value: 'flex' },
      browserConfig,
    ),
  );
};

main();
