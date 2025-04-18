<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">AI Anti-Leak</h3>

  <p align="center">
    Web extension to prevent leaking informations throw large language model
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
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
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

AI Anti-Leak is a privacy-focused browser extension designed to protect users from accidentally submitting sensitive or restricted information throw their prompts to large language models (LLMs) like ChatGPT, Claude, or Gemini.

By allowing users to define a custom list of forbidden words, the extension actively monitors the input fields of LLM interfaces. If a prompt contains any of the specified keywords, the extension prevents it from being sent by disabling the submit button in real-time.

This project was created to bring more user control, data awareness, and safety into everyday AI usage.

You can install the AI Anti-Leak by clicking on this link

- Firefox : URL TO FIREFOX
- Chrome : URL TO CHROME

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Browser Compatibility

| Browser | Supported | Status     | Version |
| ------- | --------- | ---------- | ------- |
| Firefox | ✅        | Supported  | 137.0.2 |
| Chrome  | ⚠️        | Not Tested |         |
| Edge    | ⚠️        | Not Tested |         |
| Safari  | ⚠️        | Not Tested |         |

## Getting Started

Follow these steps for building the web extension on your computer

### Prerequisites

- npm v10.9.0 or higher
  ```sh
  npm install npm@latest -g
  ```
- rollup v4.36.0 or higher
  ```sh
  npm install rollup -g
  ```

### Installation

1.  Clone the repo
    ```sh
    git@github.com:z0057393/AI-anti-leak.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Bundle files
    ```sh
    rollup -c
    ```
4.  Package in zip file

    ```sh
    cd dist
    zip -r -FS ../releases/AIAL-[VERSION_NUMBER].zip *
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Deploy

Firefox : go to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)

And load the extension.
