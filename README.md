# Language Model Coding Assistant (LMCA)

> **CAUTION**: This tool is currently in its alpha version. It may contain bugs and its functionality may change significantly in future releases. Use with caution in production environments.

## Overview

Language Model Coding Assistant (LMCA) is a command-line tool designed to accelerate coding by leveraging the power of Large Language Models (LLMs). It helps developers by providing commands to generate test code, replace content in source files, and fill in code within specified tags.

## Features

- **Generate Test Code:** Automatically generate test code based on the provided source code.
- **Replace Code:** Replace content in the specified source file based on a given description.
- **Fill Code:** Replace content within `<fill></fill>` tags in the specified source file based on a given description.

## Installation

To install the LMCA tool, first clone this repository and then install it globally using npm:

````sh
git clone https://github.com/tei6/lmca.git
cd lmca
npm install .

## Usage

### General Command Structure

```sh
lmca [command] [options]
````

### Commands

#### `gen-test`

Generate test code based on the provided source code.

**Options:**

- `-s, --src-path <path>`: Specify the path to the source code file or directory to be analyzed.
- `-t, --test-path <path>`: Specify the path where the generated test code should be saved.
- `-d, --description <description>`: Provide a description or context for the test code generation process.

**Example:**

```sh
lmca gen-test -s src/app.js -t tests/app.test.js -d "Unit tests for app.js"
```

#### `rewrite`

Replace content in the specified source file.

**Options:**

- `-s, --src-path <path>`: Specify the path to the source code file where content will be replaced.
- `-d, --description <description>`: Provide a description or context for the content replacement process.

**Example:**

```sh
lmca rewrite -s src/app.js -d "Refactor function to use async/await"
```

#### `fill`

Replace content within `<fill></fill>` tags in the specified source file.

**Options:**

- `-s, --src-path <path>`: Specify the path to the source code file where content will be replaced.
- `-d, --description <description>`: Provide a description or context for the content replacement process.

**Example:**

```sh
lmca fill -s src/app.js -d "Implement the missing functionality"
```

## License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details.
