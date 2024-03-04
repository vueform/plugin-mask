import type IMask, { type FactoryOpts } from 'imask';

export interface VueformPluginMask {
  mask?: string | FactoryOpts & { mask: any } | RegExp | ((IMask: IMask) => string | FactoryOpts | RegExp);
  unmask?: boolean;
  allowIncomplete?: boolean;
}

declare module '@vueform/vueform' {
  interface TextElementProps extends VueformPluginMask {}
  interface TextElement extends VueformPluginMask {}
}