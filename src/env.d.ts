/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.tsx' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// D3 module declaration
declare module 'd3' {
  export * from 'd3';
}

// Vue JSX namespace - fixes JSX element errors
declare global {
  namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

export {};