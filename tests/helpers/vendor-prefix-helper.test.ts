import { hasVendorPrefix } from '../../src/helpers/vendor-prefix-helper';

const hasVendorPrefixTestCases: {
  featureIdentifier: string;
  expectedResult: boolean;
}[] = [
  {
    featureIdentifier: 'margin',
    expectedResult: false,
  },
  {
    featureIdentifier: '-moz-margin',
    expectedResult: true,
  },
  {
    featureIdentifier: '-o-margin',
    expectedResult: true,
  },
  {
    featureIdentifier: '-ms-margin',
    expectedResult: true,
  },
  {
    featureIdentifier: '-webkit-margin',
    expectedResult: true,
  },
];

test.each(hasVendorPrefixTestCases)(
  'returns expected vendor prefix status for feature: $featureIdentifier',
  ({ featureIdentifier, expectedResult }) => {
    expect(hasVendorPrefix(featureIdentifier)).toBe(expectedResult);
  },
);
