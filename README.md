# Input Mask plugin for [Vueform](https://github.com/vueform/vueform)

Plugin for [Vueform](https://github.com/vueform/vueform) to add 

## Prerequisites

- [Vueform 1.5.4+](https://github.com/vueform/vueform)

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
      mask="+{1}(000)000-00-00"
    />
  </Vueform>
</template>
```

## License

[MIT](https://opensource.org/licenses/MIT)