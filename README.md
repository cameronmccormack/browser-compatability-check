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

qq

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

qq

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

qq

### Configuration

Kompat is configured with a `.kompatrc.yml` file at the root of your repository. This file must contain:

- `browsers`: an array of browser identifiers and versions
  - The acceptable browser slugs are defined [here](src/run-commands/schema-validation/browsers.ts#L6)
  - The browser version must be a number
  - Duplicate browser slugs are not allowed
- `ruleOverrides`: to change the default overall pass/warn/fail thresholds
  - Acceptable rules config is defined [here](src/run-commands/schema-validation/rule-overrides.ts#L6)
  - e.g. for failing a pipeline if a partially compatible feature is identified
- `featureIgnores`: to ignore specific rules from overall status and reporting
  - These ignores should be configured as part of, or all of, a feature ID (as defined [here](src/run-commands/schema-validation/feature-ignores.ts#L20))
  - Any features with an ID that is matched by the ignore (regardless of higher level of detail) will be excluded from the compatibility report
    - e.g. if the ignore is "property:color" the features "property:color:red" and "property:color:orange:flex_context" will be ignored, and if the ignore is "at-rule", all at-rules will be ignored.
- `reportOptions`: to configure the logged report and create output log files
  - The correct format for these options is defined [here](src/run-commands/schema-validation/report-options.ts#L6)
  - The per-browser summary can be suppressed in the console logs, and HTML and/or JSON file output reports may be configured.

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

## Acknowledgments

* []()
* []()
* []()

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
