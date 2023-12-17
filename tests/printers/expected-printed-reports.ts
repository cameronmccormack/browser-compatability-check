import chalk, { Chalk } from 'chalk';

const applyStyles = (
  unstyledText: string,
  styleConfig: {
    substringToStyle: string;
    regexToFind?: RegExp;
    style: Chalk;
  }[],
): string => {
  let styledText = unstyledText;
  styleConfig.forEach(({ substringToStyle, regexToFind, style }) => {
    styledText = styledText.replaceAll(
      regexToFind ?? substringToStyle,
      style(substringToStyle),
    );
  });
  return styledText;
};

const unstyledOneCompatibleFilePrintedReport = `
|----------------------------------------------------------------------------------------------------------------------|
|                                         ▄ •▄       • ▌ ▄ ·.  ▄▄▄· ▄▄▄· ▄▄▄▄▄                                         |
|                                         █▌▄▌▪▪     ·██ ▐███▪▐█ ▄█▐█ ▀█ •██                                           |
|                                         ▐▀▀▄· ▄█▀▄ ▐█ ▌▐▌▐█· ██▀·▄█▀▀█  ▐█.▪                                         |
|                                         ▐█.█▌▐█▌.▐▌██ ██▌▐█▌▐█▪·•▐█ ▪▐▌ ▐█▌·                                         |
|                                         ·▀  ▀ ▀█▄▀▪▀▀  █▪▀▀▀.▀    ▀  ▀  ▀▀▀                                          |
|                                                                                                                      |
|                                         Copyright (c) 2023 Cameron McCormack                                         |
|----------------------------------------------------------------------------------------------------------------------|


Overall Summary: PASS
 - PASS: example/filepath/eg-file.css


Summary of all stylesheets:
########################################################################################################################
#                                                                                                                      #
#                                          PASS: example/filepath/eg-file.css                                          #
#                                                                                                                      #
########################################################################################################################
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                                  High-level Summary                                                  |
|                                                                                                                      |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| Index                                              | compatible | partial-support | flagged | incompatible | unknown |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| chrome                                             |      4     |        0        |    0    |       0      |    0    |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
|                                                                                                                      |
| Unknown features: None                                                                                               |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|


Overall Summary: PASS
 - PASS: example/filepath/eg-file.css
`.trim();

export const oneCompatibleFilePrintedReport = applyStyles(
  unstyledOneCompatibleFilePrintedReport,
  [
    {
      substringToStyle: '0',
      regexToFind: /(?<=\s)0(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '4',
      regexToFind: /(?<=\s)4(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: 'PASS',
      regexToFind: /(PASS(?=\n))|((?<=- )PASS(?=:))/g,
      style: chalk.bgGreen.bold,
    },
    {
      substringToStyle: 'PASS: example/filepath/eg-file.css',
      regexToFind: /(PASS: example\/filepath\/eg-file.css)(?!$)/g,
      style: chalk.green,
    },
    {
      substringToStyle: 'Unknown features: None',
      style: chalk.green,
    },
  ],
);

const unstyledOneFileWithUnknownFeaturePrintedReport = `
|----------------------------------------------------------------------------------------------------------------------|
|                                         ▄ •▄       • ▌ ▄ ·.  ▄▄▄· ▄▄▄· ▄▄▄▄▄                                         |
|                                         █▌▄▌▪▪     ·██ ▐███▪▐█ ▄█▐█ ▀█ •██                                           |
|                                         ▐▀▀▄· ▄█▀▄ ▐█ ▌▐▌▐█· ██▀·▄█▀▀█  ▐█.▪                                         |
|                                         ▐█.█▌▐█▌.▐▌██ ██▌▐█▌▐█▪·•▐█ ▪▐▌ ▐█▌·                                         |
|                                         ·▀  ▀ ▀█▄▀▪▀▀  █▪▀▀▀.▀    ▀  ▀  ▀▀▀                                          |
|                                                                                                                      |
|                                         Copyright (c) 2023 Cameron McCormack                                         |
|----------------------------------------------------------------------------------------------------------------------|


Overall Summary: FAIL
 - FAIL: example/filepath/eg-file.css


Summary of all stylesheets:
########################################################################################################################
#                                                                                                                      #
#                                          FAIL: example/filepath/eg-file.css                                          #
#                                                                                                                      #
########################################################################################################################
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                                  High-level Summary                                                  |
|                                                                                                                      |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| Index                                              | compatible | partial-support | flagged | incompatible | unknown |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| chrome                                             |      4     |        0        |    0    |       0      |    0    |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
|                                                                                                                      |
| Unknown features:                                                                                                    |
| - property:not-a-real-feature:20px                                                                                   |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|


|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                             Per-feature Summary (chrome)                                             |
|                                                                                                                      |
|---------------------------------------------------------------------------------------------------------|------------|
| Index                                                                                                   |   chrome   |
|---------------------------------------------------------------------------------------------------------|------------|
| at-rule:charset                                                                                         | compatible |
| function:calc                                                                                           | compatible |
| property:color:red                                                                                      | compatible |
| selector:last-child                                                                                     | compatible |
|---------------------------------------------------------------------------------------------------------|------------|


Overall Summary: FAIL
 - FAIL: example/filepath/eg-file.css
`.trim();

export const oneFileWithUnknownFeaturePrintedReport = applyStyles(
  unstyledOneFileWithUnknownFeaturePrintedReport,
  [
    {
      substringToStyle: '0',
      regexToFind: /(?<=\s)0(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '4',
      regexToFind: /(?<=\s)4(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: 'FAIL',
      regexToFind: /(FAIL(?=\n))|((?<=- )FAIL(?=:))/g,
      style: chalk.bgRed.bold,
    },
    {
      substringToStyle: 'FAIL: example/filepath/eg-file.css',
      regexToFind: /(FAIL: example\/filepath\/eg-file.css)(?!$)/g,
      style: chalk.bgRed.bold,
    },
    {
      substringToStyle: 'Unknown features:',
      style: chalk.red,
    },
    {
      substringToStyle: '- property:not-a-real-feature:20px',
      style: chalk.red,
    },
    {
      substringToStyle: 'compatible',
      // matches 'compatible' unless it appears in the same line as 'Index' (i.e. a header row)
      regexToFind: /(?<=\n(?!.*Index.*).*)compatible(?=.*\n)/g,
      style: chalk.green,
    },
  ],
);

const unstyledMultipleFilesPrintedReport = `
|----------------------------------------------------------------------------------------------------------------------|
|                                         ▄ •▄       • ▌ ▄ ·.  ▄▄▄· ▄▄▄· ▄▄▄▄▄                                         |
|                                         █▌▄▌▪▪     ·██ ▐███▪▐█ ▄█▐█ ▀█ •██                                           |
|                                         ▐▀▀▄· ▄█▀▄ ▐█ ▌▐▌▐█· ██▀·▄█▀▀█  ▐█.▪                                         |
|                                         ▐█.█▌▐█▌.▐▌██ ██▌▐█▌▐█▪·•▐█ ▪▐▌ ▐█▌·                                         |
|                                         ·▀  ▀ ▀█▄▀▪▀▀  █▪▀▀▀.▀    ▀  ▀  ▀▀▀                                          |
|                                                                                                                      |
|                                         Copyright (c) 2023 Cameron McCormack                                         |
|----------------------------------------------------------------------------------------------------------------------|


Overall Summary: WARN
 - WARN: example/filepath/eg-file.css
 - PASS: example/filepath/eg-file.css
 - WARN: example/filepath/eg-file.css


Summary of all stylesheets:
########################################################################################################################
#                                                                                                                      #
#                                          WARN: example/filepath/eg-file.css                                          #
#                                                                                                                      #
########################################################################################################################
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                                  High-level Summary                                                  |
|                                                                                                                      |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| Index                                              | compatible | partial-support | flagged | incompatible | unknown |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| chrome                                             |      3     |        0        |    1    |       0      |    0    |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
|                                                                                                                      |
| Unknown features: None                                                                                               |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|


|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                             Per-feature Summary (chrome)                                             |
|                                                                                                                      |
|---------------------------------------------------------------------------------------------------------|------------|
| Index                                                                                                   |   chrome   |
|---------------------------------------------------------------------------------------------------------|------------|
| at-rule:charset                                                                                         | compatible |
| function:calc                                                                                           | compatible |
| property:color:red                                                                                      |   flagged  |
| selector:last-child                                                                                     | compatible |
|---------------------------------------------------------------------------------------------------------|------------|


########################################################################################################################
#                                                                                                                      #
#                                          PASS: example/filepath/eg-file.css                                          #
#                                                                                                                      #
########################################################################################################################
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                                  High-level Summary                                                  |
|                                                                                                                      |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| Index                                              | compatible | partial-support | flagged | incompatible | unknown |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| chrome                                             |      4     |        0        |    0    |       0      |    0    |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
|                                                                                                                      |
| Unknown features: None                                                                                               |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|


########################################################################################################################
#                                                                                                                      #
#                                          WARN: example/filepath/eg-file.css                                          #
#                                                                                                                      #
########################################################################################################################
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                                  High-level Summary                                                  |
|                                                                                                                      |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| Index                                              | compatible | partial-support | flagged | incompatible | unknown |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| chrome                                             |      3     |        1        |    0    |       0      |    0    |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
|                                                                                                                      |
| Unknown features: None                                                                                               |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|


|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                             Per-feature Summary (chrome)                                             |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------|-----------------|
| Index                                                                                              |      chrome     |
|----------------------------------------------------------------------------------------------------|-----------------|
| at-rule:charset                                                                                    |    compatible   |
| function:calc                                                                                      |    compatible   |
| property:color:red                                                                                 | partial-support |
| selector:last-child                                                                                |    compatible   |
|----------------------------------------------------------------------------------------------------|-----------------|


Overall Summary: WARN
 - WARN: example/filepath/eg-file.css
 - PASS: example/filepath/eg-file.css
 - WARN: example/filepath/eg-file.css
`.trim();

export const multipleFilesPrintedReport = applyStyles(
  unstyledMultipleFilesPrintedReport,
  [
    {
      substringToStyle: '0',
      regexToFind: /(?<=\s)0(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '3',
      regexToFind: /(?<=\s)3(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '4',
      regexToFind: /(?<=\s)4(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '1',
      regexToFind: /(?<=\s)1(?=\s)/g,
      style: chalk.yellow,
    },
    {
      substringToStyle: 'WARN',
      regexToFind: /(WARN(?=\n))|((?<=- )WARN(?=:))/g,
      style: chalk.bgYellow.bold,
    },
    {
      substringToStyle: 'PASS',
      regexToFind: /(PASS(?=\n))|((?<=- )PASS(?=:))/g,
      style: chalk.bgGreen.bold,
    },
    {
      substringToStyle: 'WARN: example/filepath/eg-file.css',
      regexToFind: /(WARN: example\/filepath\/eg-file.css)(?!$)/g,
      style: chalk.bgYellow.bold,
    },
    {
      substringToStyle: 'PASS: example/filepath/eg-file.css',
      regexToFind: /(PASS: example\/filepath\/eg-file.css)(?!$)/g,
      style: chalk.green,
    },
    {
      substringToStyle: 'Unknown features: None',
      style: chalk.green,
    },
    {
      substringToStyle: 'compatible',
      // matches 'compatible' unless it appears in the same line as 'Index' (i.e. a header row)
      regexToFind: /(?<=\n(?!.*Index.*).*)compatible(?=.*\n)/g,
      style: chalk.green,
    },
    {
      substringToStyle: 'flagged',
      // matches 'flagged' unless it appears in the same line as 'Index' (i.e. a header row)
      regexToFind: /(?<=\n(?!.*Index.*).*)flagged(?=.*\n)/g,
      style: chalk.yellow,
    },
    {
      substringToStyle: 'partial-support',
      // matches 'partial-support' unless it appears in the same line as 'Index' (i.e. a header row)
      regexToFind: /(?<=\n(?!.*Index.*).*)partial-support(?=.*\n)/g,
      style: chalk.yellow,
    },
  ],
);

const unstyledManyBrowsersPrintedReport = `
|----------------------------------------------------------------------------------------------------------------------|
|                                         ▄ •▄       • ▌ ▄ ·.  ▄▄▄· ▄▄▄· ▄▄▄▄▄                                         |
|                                         █▌▄▌▪▪     ·██ ▐███▪▐█ ▄█▐█ ▀█ •██                                           |
|                                         ▐▀▀▄· ▄█▀▄ ▐█ ▌▐▌▐█· ██▀·▄█▀▀█  ▐█.▪                                         |
|                                         ▐█.█▌▐█▌.▐▌██ ██▌▐█▌▐█▪·•▐█ ▪▐▌ ▐█▌·                                         |
|                                         ·▀  ▀ ▀█▄▀▪▀▀  █▪▀▀▀.▀    ▀  ▀  ▀▀▀                                          |
|                                                                                                                      |
|                                         Copyright (c) 2023 Cameron McCormack                                         |
|----------------------------------------------------------------------------------------------------------------------|


Overall Summary: WARN
 - WARN: example/filepath/eg-file.css


Summary of all stylesheets:
########################################################################################################################
#                                                                                                                      #
#                                          WARN: example/filepath/eg-file.css                                          #
#                                                                                                                      #
########################################################################################################################
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                                  High-level Summary                                                  |
|                                                                                                                      |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| Index                                              | compatible | partial-support | flagged | incompatible | unknown |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| chrome                                             |      3     |        0        |    1    |       0      |    0    |
| firefox                                            |      4     |        0        |    0    |       0      |    0    |
| samsunginternet_android                            |      4     |        0        |    0    |       0      |    0    |
| safari                                             |      4     |        0        |    0    |       0      |    0    |
| edge                                               |      4     |        0        |    0    |       0      |    0    |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
|                                                                                                                      |
| Unknown features: None                                                                                               |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|


|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                            Per-feature Summary (chrome, firefox, samsunginternet_android)                            |
|                                                                                                                      |
|------------------------------------------------------------------|------------|------------|-------------------------|
| Index                                                            |   chrome   |   firefox  | samsunginternet_android |
|------------------------------------------------------------------|------------|------------|-------------------------|
| at-rule:charset                                                  | compatible | compatible |        compatible       |
| function:calc                                                    | compatible | compatible |        compatible       |
| property:color:red                                               |   flagged  | compatible |        compatible       |
| selector:last-child                                              | compatible | compatible |        compatible       |
|------------------------------------------------------------------|------------|------------|-------------------------|


|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                          Per-feature Summary (safari, edge)                                          |
|                                                                                                                      |
|--------------------------------------------------------------------------------------------|------------|------------|
| Index                                                                                      |   safari   |    edge    |
|--------------------------------------------------------------------------------------------|------------|------------|
| at-rule:charset                                                                            | compatible | compatible |
| function:calc                                                                              | compatible | compatible |
| property:color:red                                                                         | compatible | compatible |
| selector:last-child                                                                        | compatible | compatible |
|--------------------------------------------------------------------------------------------|------------|------------|


Overall Summary: WARN
 - WARN: example/filepath/eg-file.css
`.trim();

export const manyBrowsersPrintedReport = applyStyles(
  unstyledManyBrowsersPrintedReport,
  [
    {
      substringToStyle: '0',
      regexToFind: /(?<=\s)0(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '3',
      regexToFind: /(?<=\s)3(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '4',
      regexToFind: /(?<=\s)4(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '1',
      regexToFind: /(?<=\s)1(?=\s)/g,
      style: chalk.yellow,
    },
    {
      substringToStyle: 'WARN',
      regexToFind: /(WARN(?=\n))|((?<=- )WARN(?=:))/g,
      style: chalk.bgYellow.bold,
    },
    {
      substringToStyle: 'WARN: example/filepath/eg-file.css',
      regexToFind: /(WARN: example\/filepath\/eg-file.css)(?!$)/g,
      style: chalk.bgYellow.bold,
    },
    {
      substringToStyle: 'Unknown features: None',
      style: chalk.green,
    },
    {
      substringToStyle: 'compatible',
      // matches 'compatible' unless it appears in the same line as 'Index' (i.e. a header row)
      regexToFind: /(?<=\n(?!.*Index.*).*)compatible(?=.*\n)/g,
      style: chalk.green,
    },
    {
      substringToStyle: 'flagged',
      // matches 'flagged' unless it appears in the same line as 'Index' (i.e. a header row)
      regexToFind: /(?<=\n(?!.*Index.*).*)flagged(?=.*\n)/g,
      style: chalk.yellow,
    },
  ],
);

const unstyledLongFeatureIdPrintedReport = `
|----------------------------------------------------------------------------------------------------------------------|
|                                         ▄ •▄       • ▌ ▄ ·.  ▄▄▄· ▄▄▄· ▄▄▄▄▄                                         |
|                                         █▌▄▌▪▪     ·██ ▐███▪▐█ ▄█▐█ ▀█ •██                                           |
|                                         ▐▀▀▄· ▄█▀▄ ▐█ ▌▐▌▐█· ██▀·▄█▀▀█  ▐█.▪                                         |
|                                         ▐█.█▌▐█▌.▐▌██ ██▌▐█▌▐█▪·•▐█ ▪▐▌ ▐█▌·                                         |
|                                         ·▀  ▀ ▀█▄▀▪▀▀  █▪▀▀▀.▀    ▀  ▀  ▀▀▀                                          |
|                                                                                                                      |
|                                         Copyright (c) 2023 Cameron McCormack                                         |
|----------------------------------------------------------------------------------------------------------------------|


Overall Summary: WARN
 - WARN: example/filepath/eg-file.css


Summary of all stylesheets:
########################################################################################################################
#                                                                                                                      #
#                                          WARN: example/filepath/eg-file.css                                          #
#                                                                                                                      #
########################################################################################################################
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                                  High-level Summary                                                  |
|                                                                                                                      |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| Index                                              | compatible | partial-support | flagged | incompatible | unknown |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| chrome                                             |      4     |        0        |    1    |       0      |    0    |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
|                                                                                                                      |
| Unknown features: None                                                                                               |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|


|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                             Per-feature Summary (chrome)                                             |
|                                                                                                                      |
|---------------------------------------------------------------------------------------------------------|------------|
| Index                                                                                                   |   chrome   |
|---------------------------------------------------------------------------------------------------------|------------|
| at-rule:charset                                                                                         | compatible |
| function:calc                                                                                           | compatible |
| property:color:red                                                                                      |   flagged  |
| ...ying value that will certainly be truncated as it's so extremely, extraordinarily, phenomenally long | compatible |
| selector:last-child                                                                                     | compatible |
|---------------------------------------------------------------------------------------------------------|------------|


Overall Summary: WARN
 - WARN: example/filepath/eg-file.css
 `.trim();

export const longFeatureIdPrintedReport = applyStyles(
  unstyledLongFeatureIdPrintedReport,
  [
    {
      substringToStyle: '0',
      regexToFind: /(?<=\s)0(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '4',
      regexToFind: /(?<=\s)4(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '1',
      regexToFind: /(?<=\s)1(?=\s)/g,
      style: chalk.yellow,
    },
    {
      substringToStyle: 'WARN',
      regexToFind: /(WARN(?=\n))|((?<=- )WARN(?=:))/g,
      style: chalk.bgYellow.bold,
    },
    {
      substringToStyle: 'WARN: example/filepath/eg-file.css',
      regexToFind: /(WARN: example\/filepath\/eg-file.css)(?!$)/g,
      style: chalk.bgYellow.bold,
    },
    {
      substringToStyle: 'Unknown features: None',
      style: chalk.green,
    },
    {
      substringToStyle: 'compatible',
      // matches 'compatible' unless it appears in the same line as 'Index' (i.e. a header row)
      regexToFind: /(?<=\n(?!.*Index.*).*)compatible(?=.*\n)/g,
      style: chalk.green,
    },
    {
      substringToStyle: 'flagged',
      // matches 'flagged' unless it appears in the same line as 'Index' (i.e. a header row)
      regexToFind: /(?<=\n(?!.*Index.*).*)flagged(?=.*\n)/g,
      style: chalk.yellow,
    },
  ],
);

const unstyledEmptyPrintedReport = `
|----------------------------------------------------------------------------------------------------------------------|
|                                         ▄ •▄       • ▌ ▄ ·.  ▄▄▄· ▄▄▄· ▄▄▄▄▄                                         |
|                                         █▌▄▌▪▪     ·██ ▐███▪▐█ ▄█▐█ ▀█ •██                                           |
|                                         ▐▀▀▄· ▄█▀▄ ▐█ ▌▐▌▐█· ██▀·▄█▀▀█  ▐█.▪                                         |
|                                         ▐█.█▌▐█▌.▐▌██ ██▌▐█▌▐█▪·•▐█ ▪▐▌ ▐█▌·                                         |
|                                         ·▀  ▀ ▀█▄▀▪▀▀  █▪▀▀▀.▀    ▀  ▀  ▀▀▀                                          |
|                                                                                                                      |
|                                         Copyright (c) 2023 Cameron McCormack                                         |
|----------------------------------------------------------------------------------------------------------------------|


Overall Summary: PASS
 - PASS: example/filepath/eg-file.css


Summary of all stylesheets:
########################################################################################################################
#                                                                                                                      #
#                                          PASS: example/filepath/eg-file.css                                          #
#                                                                                                                      #
########################################################################################################################
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                                  High-level Summary                                                  |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|
| Index                                                                                                                |
|----------------------------------------------------------------------------------------------------------------------|
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
| Unknown features: None                                                                                               |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|


Overall Summary: PASS
 - PASS: example/filepath/eg-file.css
`.trim();

export const emptyPrintedReport = applyStyles(unstyledEmptyPrintedReport, [
  {
    substringToStyle: 'PASS',
    regexToFind: /(PASS(?=\n))|((?<=- )PASS(?=:))/g,
    style: chalk.bgGreen.bold,
  },
  {
    substringToStyle: 'PASS: example/filepath/eg-file.css',
    regexToFind: /(PASS: example\/filepath\/eg-file.css)(?!$)/g,
    style: chalk.green,
  },
  {
    substringToStyle: 'Unknown features: None',
    style: chalk.green,
  },
]);

const unstyledNonDefaultRulesPrintedReport = `
|----------------------------------------------------------------------------------------------------------------------|
|                                         ▄ •▄       • ▌ ▄ ·.  ▄▄▄· ▄▄▄· ▄▄▄▄▄                                         |
|                                         █▌▄▌▪▪     ·██ ▐███▪▐█ ▄█▐█ ▀█ •██                                           |
|                                         ▐▀▀▄· ▄█▀▄ ▐█ ▌▐▌▐█· ██▀·▄█▀▀█  ▐█.▪                                         |
|                                         ▐█.█▌▐█▌.▐▌██ ██▌▐█▌▐█▪·•▐█ ▪▐▌ ▐█▌·                                         |
|                                         ·▀  ▀ ▀█▄▀▪▀▀  █▪▀▀▀.▀    ▀  ▀  ▀▀▀                                          |
|                                                                                                                      |
|                                         Copyright (c) 2023 Cameron McCormack                                         |
|----------------------------------------------------------------------------------------------------------------------|


Overall Summary: FAIL
 - WARN: example/filepath/eg-file.css
 - FAIL: example/filepath/eg-file.css
 - FAIL: example/filepath/eg-file.css


Summary of all stylesheets:
########################################################################################################################
#                                                                                                                      #
#                                          WARN: example/filepath/eg-file.css                                          #
#                                                                                                                      #
########################################################################################################################
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                                  High-level Summary                                                  |
|                                                                                                                      |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| Index                                              | compatible | partial-support | flagged | incompatible | unknown |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| chrome                                             |      3     |        0        |    1    |       0      |    0    |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
|                                                                                                                      |
| Unknown features: None                                                                                               |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|


|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                             Per-feature Summary (chrome)                                             |
|                                                                                                                      |
|---------------------------------------------------------------------------------------------------------|------------|
| Index                                                                                                   |   chrome   |
|---------------------------------------------------------------------------------------------------------|------------|
| at-rule:charset                                                                                         | compatible |
| function:calc                                                                                           | compatible |
| property:color:red                                                                                      |   flagged  |
| selector:last-child                                                                                     | compatible |
|---------------------------------------------------------------------------------------------------------|------------|


########################################################################################################################
#                                                                                                                      #
#                                          FAIL: example/filepath/eg-file.css                                          #
#                                                                                                                      #
########################################################################################################################
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                                  High-level Summary                                                  |
|                                                                                                                      |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| Index                                              | compatible | partial-support | flagged | incompatible | unknown |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| chrome                                             |      3     |        0        |    0    |       1      |    0    |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
|                                                                                                                      |
| Unknown features: None                                                                                               |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|


|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                             Per-feature Summary (chrome)                                             |
|                                                                                                                      |
|-------------------------------------------------------------------------------------------------------|--------------|
| Index                                                                                                 |    chrome    |
|-------------------------------------------------------------------------------------------------------|--------------|
| at-rule:charset                                                                                       |  compatible  |
| function:calc                                                                                         |  compatible  |
| property:color:red                                                                                    | incompatible |
| selector:last-child                                                                                   |  compatible  |
|-------------------------------------------------------------------------------------------------------|--------------|


########################################################################################################################
#                                                                                                                      #
#                                          FAIL: example/filepath/eg-file.css                                          #
#                                                                                                                      #
########################################################################################################################
|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                                  High-level Summary                                                  |
|                                                                                                                      |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| Index                                              | compatible | partial-support | flagged | incompatible | unknown |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
| chrome                                             |      4     |        0        |    0    |       0      |    0    |
|----------------------------------------------------|------------|-----------------|---------|--------------|---------|
|                                                                                                                      |
| Unknown features:                                                                                                    |
| - property:not-a-real-feature:20px                                                                                   |
|                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|


|----------------------------------------------------------------------------------------------------------------------|
|                                                                                                                      |
|                                             Per-feature Summary (chrome)                                             |
|                                                                                                                      |
|---------------------------------------------------------------------------------------------------------|------------|
| Index                                                                                                   |   chrome   |
|---------------------------------------------------------------------------------------------------------|------------|
| at-rule:charset                                                                                         | compatible |
| function:calc                                                                                           | compatible |
| property:color:red                                                                                      | compatible |
| selector:last-child                                                                                     | compatible |
|---------------------------------------------------------------------------------------------------------|------------|


Overall Summary: FAIL
 - WARN: example/filepath/eg-file.css
 - FAIL: example/filepath/eg-file.css
 - FAIL: example/filepath/eg-file.css
 `.trim();

export const nonDefaultRulesPrintedReport = applyStyles(
  unstyledNonDefaultRulesPrintedReport,
  [
    {
      substringToStyle: '0',
      regexToFind: /(?<=\s)0(?=\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '4',
      regexToFind: /(?<=\s)4(?=\s)/g,
      style: chalk.red,
    },
    {
      substringToStyle: '3',
      regexToFind: /(?<=\s)3(?=\s)/g,
      style: chalk.red,
    },
    {
      substringToStyle: '1',
      regexToFind: /(?<=\s)1(?=\s)/g,
      style: chalk.yellow,
    },
    {
      substringToStyle: 'FAIL',
      regexToFind: /(FAIL(?=\n))|((?<=- )FAIL(?=:))/g,
      style: chalk.bgRed.bold,
    },
    {
      substringToStyle: 'FAIL: example/filepath/eg-file.css',
      regexToFind: /(FAIL: example\/filepath\/eg-file.css)(?!$)/g,
      style: chalk.bgRed.bold,
    },
    {
      substringToStyle: 'WARN',
      regexToFind: /(WARN(?=\n))|((?<=- )WARN(?=:))/g,
      style: chalk.bgYellow.bold,
    },
    {
      substringToStyle: 'WARN: example/filepath/eg-file.css',
      regexToFind: /(WARN: example\/filepath\/eg-file.css)(?!$)/g,
      style: chalk.bgYellow.bold,
    },
    {
      substringToStyle: 'Unknown features: None',
      style: chalk.green,
    },
    {
      substringToStyle: 'Unknown features:',
      regexToFind: /Unknown features:(?=\s\s)/g,
      style: chalk.green,
    },
    {
      substringToStyle: '- property:not-a-real-feature:20px',
      style: chalk.green,
    },
    {
      substringToStyle: 'compatible',
      // matches 'compatible' unless it appears in the same line as 'Index' (i.e. a header row)
      regexToFind: /(?<=\n(?!.*Index.*).*\s)compatible(?=.*\n)/g,
      style: chalk.red,
    },
    {
      substringToStyle: 'flagged',
      // matches 'flagged' unless it appears in the same line as 'Index' (i.e. a header row)
      regexToFind: /(?<=\n(?!.*Index.*).*)flagged(?=.*\n)/g,
      style: chalk.yellow,
    },
    {
      substringToStyle: 'incompatible',
      // matches 'flagged' unless it appears in the same line as 'Index' (i.e. a header row)
      regexToFind: /(?<=\n(?!.*Index.*).*)incompatible(?=.*\n)/g,
      style: chalk.yellow,
    },
  ],
);
