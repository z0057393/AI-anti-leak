<br />
<div align="center">
  <a href="https://github.com/z0057393/AI-anti-leak">
    <img src="images/base-icon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">AI Anti-Leak</h3>

  <p align="center">
    Web extension to prevent leaking information through large language models.
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
     <li>
      <a href="#browser-compatibility">Browser Compatibility</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#deploy">Deploy</a></li>
      </ul>
    </li>
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

| Browser | Supported | Status     | Version       |
| ------- | --------- | ---------- | ------------- |
| Firefox | ✅        | Supported  | 137.0.2       |
| Chrome  | ✅        | Supported  | 135.0.7049.96 |
| Edge    | ⚠️        | Not Tested |               |
| Safari  | ⚠️        | Not Tested |               |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## LLMs Compatibility

| Browser   | Supported | Status      |
| --------- | --------- | ----------- |
| ChatGPT   | ✅        | Supported   |
| MistralAI | ❌        | Coming soon |
| Deapseek  | ❌        | Coming soon |
| Claude    | ❌        | Coming soon |
| Gemini    | ❌        | Coming soon |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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

### Deploy

Firefox : go to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)

And load the extension.

Chrome : go to [chrome://extensions](chrome://extensions)

toggle dev mode

And load the extension

<p align="right">(<a href="#readme-top">back to top</a>)</p>
