<a href="https://vueform.com?cid=plugin-mask" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/vueform/plugin-mask/raw/main/assets/logo-dark.svg">
    <img alt="Vueform Logo" src="https://github.com/vueform/plugin-mask/raw/main/assets/logo.svg">
  </picture>
</a>

<br>


# Official Input Mask plugin for [Vueform](https://github.com/vueform/vueform)

Plugin for [Vueform](https://github.com/vueform/vueform) to add [input mask](https://vueform.com/reference/text-element#option-mask) to text elements.

## Prerequisites

- [Vueform 1.8.1+](https://github.com/vueform/vueform)

## Installation

1. Install the plugin

```bash
npm install @vueform/plugin-mask
```

2. Add the plugin in `vueform.config.js`

```js
// vueform.config.js

import MaskPlugin from '@vueform/plugin-mask'

export default {
  // ...
  plugins: [
    MaskPlugin,
  ]
}

```

## Usage

```vue
<template>
  <Vueform>
    <TextElement
      name="text"
      mask="{+1} (000)-000-0000"
    />
  </Vueform>
</template>
```

More info and examples can be found on our [official documentation](https://vueform.com/reference/text-element#option-mask).

## License

[MIT](https://opensource.org/licenses/MIT)