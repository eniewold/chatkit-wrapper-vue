# ChatKit Vue Component - OpenAI ChatKit

Easy to integrate OpenAI ChatKit component into Vue (and Nuxt) applications. 

A proxy is required to hide OpenAI secrets from the browser, see [ChatKit Nuxt Server](https://github.com/eniewold/chatkit-nuxt) to install such a proxy. 

## Features

- Easy integration of ChatKit Web Component in Vue 3 (and Nuxt) projects.
- Customizable component props for flexible usage (using OpenAI ChatKit options).

## Requirements

- ChatKit Next Proxy module installed, see [ChatKit Next Repository](https://github.com/eniewold/chatkit-nuxt) or [ChatKit Nuxt NPMJS]()
- OpenAI API Key with access to ChatKit (available through [OpenAI API Platform](https://platform.openai.com/).
- Agent workflow created on [OpenAI Chat prompts platform](https://platform.openai.com/chat) that is published and with a Prompt ID generated.
- For other than Development environments, a domain authorized in the [OpenAI API Security settings](https://platform.openai.com/settings/organization/security/domain-allowlist)

## Installation

Install the package via npm or yarn:
```bash
npm install chatkit-vue
```

Configure the `nuxt.config.ts` to include runtime config:
```ts
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith("openai-chatkit")
    }
  }
```

or

TODO: Configuration for Vue only

### Prerequisites

- Node.js v14 or higher
- Vue 3 or Nuxt 3+ project
- npm or yarn package manager

### Customization

Check out the [OpenAI ChatKit Studio Playground](https://chatkit.studio/playground) to explore available options and customize the component to fit your needs.

## LICENSE

This package includes the ChatKit Web Component bundle ([Apache 2.0])(./LICENSE) sourced from OpenAI. See [NOTICE-OPENAI](./NOTICE) for details. 
