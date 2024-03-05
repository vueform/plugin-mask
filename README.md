<a href="https://vueform.com?cid=plugin-mask">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/vueform/plugin-mask/raw/main/.github/assets/logo-dark.svg">
    <img alt="Vueform Logo" src="https://github.com/vueform/plugin-mask/raw/main/.github/assets/logo.svg">
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

#### [Pattern](https://vueform.com/docs/input-mask#pattern)

```vue
<TextElement
  name="text"
  mask="{+1} (000)-000-0000"
/>
```

#### [Number](https://vueform.com/docs/input-mask#number)

```vue
<TextElement
  name="text"
  :mask="{
    mask: 'number',
    min: -10000,
    max: 10000
  }"
/>
```

#### [Range](https://vueform.com/docs/input-mask#range)

```vue
<TextElement
  name="text"
  :mask="{
    mask: 'range',
    from: 1,
    to: 90
  }"
/>
```

#### [Enum](https://vueform.com/docs/input-mask#enum)

```vue
<TextElement
  name="text"
  :mask="{
    mask: 'enum',
    enum: [              
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  }"
/>
```

#### [Repeat](https://vueform.com/docs/input-mask#repeat-pattern)

```vue
<TextElement
  name="text"
  :mask="{
    mask: 'VFr',
    blocks: {
      r: {
        repeat: Infinity, // number of times to repeat: Infinity | number | [min, max]
        mask: '-000',
      }
    },
  }"
/>
```

#### [Regex](https://vueform.com/docs/input-mask#regex)

```vue
<TextElement
  name="text"
  :mask="/^[a-fA-F0-9]{0,6}$/"
/>
```

#### [Date](https://vueform.com/docs/input-mask#date)

```vue
<TextElement
  name="text"
  :mask="{
    mask: 'date',
    pattern: 'd.`m.`Y',
  }"
/>
```

#### [Dynamic](https://vueform.com/docs/input-mask#dynamic)

```vue
<TextElement
  name="text"
  :mask="[
    {
      mask: 'rgb(RGB,RGB,RGB)',
      eager: true,
      blocks: {
        RGB: {
          mask: 'range',
          from: 0,
          to: 255
        }
      }
    },
    {
      mask: /^#[0-9a-f]{0,6}$/i
    }
  ]"
/>
```

[More info and examples](https://vueform.com/reference/text-element#option-mask) can be found at the official documentation.

## License

[MIT](https://opensource.org/licenses/MIT)