<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/cameronmccormack/kompat">
    <img src="images/logo.png" alt="Logo" width="200" height="200">
  </a>

<h3 align="center">Kompat</h3>

  <p align="center">
    A utility for checking CSS browser compatibility.
    <br />
    <a href="https://github.com/cameronmccormack/kompat"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/cameronmccormack/kompat/issues">Report Bug</a>
    ·
    <a href="https://github.com/cameronmccormack/kompat/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#whats-included">What's Included?</a></li>
        <li><a href="#future-development">Future Development</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

:warning: **Note: this project is currently in its pre-Alpha phase, so should be used with care - particularly in CI pipelines.**

Kompat is a static analysis tool to validate the compatibility of a web project's CSS styles against a configurable list of supported browsers and version numbers.

It offers out-of-the-box compatibility with vanilla CSS, SASS/SCSS and LESS, and can run against your repository's unprocessed code.

Support for other methods of CSS generation will be supported natively in future - for now, Kompat can be used in these cases by running it on the transpiled/preprocessed output CSS directory rather than the unprocessed source code.

Kompat is configured using a `.kompatrc.yml` file, which requires a list of required browsers and earliest version numbers for the codebase to be checked against. Optionally, this config file can be used to override Kompat's default pass/warn/fail logic, ignore certain CSS features, generate output report files, [and much more](#configuration)!

:warning: Kompat isn't perfect (see [future development](#future-development)). In general, to maximise robustness in a CI environment, Kompat is "over-lenient". That's to say:

> **_If Kompat indicates that your code isn't compatible, it's probably not. If Kompat indicates that your code is compatible, it doesn't guarantee that it is._**

The point being: Kompat doesn't (yet) serve to replace manual browser compatibility testing processes, but it should help catch some compatibility issues earlier and provide an extra layer of protection against issues.

The aim - by providing extra context and logic to the validation processes - is for Kompat's lenience to decrease over time.

### What's Included?

- Parsing of CSS, SASS, SCSS and LESS.
- Analysis against compatibility data for all versions of all major browsers.
- Limited contextual understanding of CSS usage (e.g. whether a property is being used on a flexbox or grid).
- Command line output tables and semantic exit codes to allow use in the command line or as a CI pipeline step.
- Output report files in HTML and JSON formats.

### Future Development

Kompat is still in its MVP phase, but there are many more planned features for future, post-MVP versions. These are grouped as follows:

Improving existing functionality:
- Support for more CSS techniques, including:
  - Tailwind CSS
  - Support for CSS-in-JS (e.g. Emotion/Styled Components) [note: perhaps will instead be solved with a chainable Kompat API for Puppeteer]
- Detailing the compatibility of HTML and/or JavaScript features as well as CSS features
- Improved contextual understanding of CSS usage (e.g. whether an attribute is being applied to the child of a flex/grid/other layout element)
- Support for legacy, vendor-prefixed names for features (e.g. `-webkit-box-sizing:border-box` as well as `box-sizing:border-box`)
  - **Note: Features with vendor-prefixed identifiers are currently ignored in Kompat**
- Exposing the "notes" field from the MDN data to the user when present

Entirely new functionality:
- Inspecting a codebase and returning the oldest version of each browser with which it is fully compatible
- Creating a browser extension to run a similar check against the CSS in a webpage as well as in a codebase
- A chainable API for Puppeteer to allow tests to be run against rendered pages in a CI pipeline

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

```bash
npm install --save-dev kompat
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

First, a `.kompatrc.yml` file must be created within the package root directory (see below for details). Then:

```bash
# To only check files in a specific directory (and its children)
kompat -- path/to/directory

# To search for CSS/SASS/SCSS/LESS files in the entire package
kompat
```

For cases where SASS/LESS files are importing from an installed package, it's important that `kompat` is executed from the root level of the package (i.e. from within parent directory of `node_modules`).

### Configuration

Kompat is configured with a `.kompatrc.yml` file at the root of your repository.

A minimal config file to get started is:


```yaml
# .kompatrc.yml
browsers:
  - identifier: chrome
    version: 100
```

This file must contain:

- `browsers`: an array of browser identifiers and versions
  - The acceptable browser slugs are defined [here](src/run-commands/schema-validation/browsers.ts#L6)
  - The browser version must be a number
  - Duplicate browser slugs are not allowed

And may contain:

- `ruleOverrides`: to change the default overall pass/warn/fail thresholds
  - Acceptable rules config is defined [here](src/run-commands/schema-validation/rule-overrides.ts#L6)
  - e.g. for failing a pipeline if a partially compatible feature is identified
- `featureIgnores`: to ignore specific rules from overall status and reporting
  - These ignores should be configured as part of, or all of, a feature ID (as defined [here](src/run-commands/schema-validation/feature-ignores.ts#L20))
  - Any features with an ID that is matched by the ignore (regardless of higher level of detail) will be excluded from the compatibility report
    - e.g. if the ignore is "property:color" the features "property:color:red" and "property:color:orange:flex_context" will be ignored, and if the ignore is "at-rule", all at-rules will be ignored.
- `parserOptions`: to configure the settings for parsing codebase content
  - The correct format for these options is defined[here](src/run-commands/schema-validation/parser-options.ts#L7)
- `reportOptions`: to configure the logged report and create output log files
  - The correct format for these options is defined [here](src/run-commands/schema-validation/report-options.ts#L6)
  - The per-browser summary can be suppressed in the console logs, and HTML and/or JSON file output reports may be configured.
- `fileExtensionOverrides`: to ignore a specific extension of CSS or unprocessed CSS file
  - This array may only contain "css", "sass", "scss" or "less"

An example `.kompatrc.yml` file (named `.kompatrc.example.yml`) is given [here](.kompatrc.example.yml) for reference.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

[Cameron McCormack](https://github.com/cameronmccormack)

Project Link: [https://github.com/cameronmccormack/kompat](https://github.com/cameronmccormack/kompat)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/cameronmccormack/kompat.svg?style=for-the-badge
[contributors-url]: https://github.com/cameronmccormack/kompat/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/cameronmccormack/kompat.svg?style=for-the-badge
[forks-url]: https://github.com/cameronmccormack/kompat/network/members
[stars-shield]: https://img.shields.io/github/stars/cameronmccormack/kompat.svg?style=for-the-badge
[stars-url]: https://github.com/cameronmccormack/kompat/stargazers
[issues-shield]: https://img.shields.io/github/issues/cameronmccormack/kompat.svg?style=for-the-badge
[issues-url]: https://github.com/cameronmccormack/kompat/issues
[license-shield]: https://img.shields.io/github/license/cameronmccormack/kompat.svg?style=for-the-badge
[license-url]: https://github.com/cameronmccormack/kompat/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/cameron-mccormack
