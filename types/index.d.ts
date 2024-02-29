import type IMask, { type FactoryOpts } from 'imask';

export interface VueformPluginMask {
  mask?: string | number | FactoryOpts | ((IMask: IMask) => string | number | FactoryOpts);
  unmask?: boolean;
  allowIncomplete?: boolean;
}

declare module '@vueform/vueform' {
  interface TextElementProps extends VueformPluginMask {}
  interface TextElement extends VueformPluginMask {}
}