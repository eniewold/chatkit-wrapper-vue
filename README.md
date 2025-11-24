# ChatKit Vue Component - OpenAI ChatKit

A Vue 3 wrapper around the OpenAI ChatKit web component so Vue and Nuxt developers can drop a fully featured AI chat UI into their apps.

A proxy is required to hide OpenAI secrets from the browser. Use the companion [ChatKit Nuxt server](https://github.com/eniewold/chatkit-nuxt) to expose secure `/api/openai/chatkit/*` endpoints.

## Features

- First-class Vue 3 component with optional plugin installation for Nuxt 3 and Vue 3 projects.
- Ships the official OpenAI ChatKit web component for streaming responses, thread management, widgets, and attachment handling out of the box.
- Typed props mirror the underlying `@openai/chatkit` options, so the same configuration works in Vue, Nuxt, or vanilla web builds.
- Built-in event bindings for lifecycle, error, logging, and thread changes to keep your Vue state in sync.
- Works with dark/light modes and exposes deep UI customization through ChatKit theme options.

## Requirements

- Node.js 14+ with npm, pnpm, or yarn.
- Vue 3 or Nuxt 3 project (Vite-compatible).
- An OpenAI API key with ChatKit access and an existing workflow published in the [Chat prompts](https://platform.openai.com/chat) dashboard (use the `wf_...` workflow ID).
- Allowed domain configured in [OpenAI domain allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist) for non-development environments.
- Backend proxy that can create ChatKit sessions and return client secrets, e.g., [chatkit-nuxt](https://github.com/eniewold/chatkit-nuxt).

## Installation

### 1. Install the package

```bash
npm install chatkit-vue
```

### 2. Register the component

#### Vue 3

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import ChatKit from 'chatkit-vue'

const app = createApp(App)
app.component('ChatKit', ChatKit)
app.mount('#app')
```

Add the custom element rule so Vue does not attempt to compile the underlying web component:

```ts
// vite.config.ts or vue.config.ts
export default defineConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('openai-chatkit'),
    },
  },
})
```

If you prefer plugin-style registration (helpful for Nuxt-style runtime config), you can also install the helper with your workflow key:

```ts
import ChatKitPlugin from 'chatkit-vue'

app.use(ChatKitPlugin, {
  chatkitOpenAIWorkflowKey: process.env.VITE_OPENAI_WORKFLOW_ID!,
  endpoint: '/api/openai/chatkit',
})
```

#### Nuxt 3

Add the Vue compiler rule to `nuxt.config.ts` and register the module (or use a client plugin) similar to Vue. Combine it with the [chatkit-nuxt](https://github.com/eniewold/chatkit-nuxt) server to expose the `/api/openai/chatkit/sessions` endpoint that the component calls for `getClientSecret`.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('openai-chatkit'),
    },
  },
})
```

## Properties

`ChatKitProperties` mirrors the options from `@openai/chatkit` with Vue-friendly types:

- `userId?: string` — Optional user identifier. When omitted, the component generates and reuses a local ID for the session.
- `workflowKey?: string` — Workflow ID (`wf_...`) required for ChatKit sessions. If not provided directly, the plugin can inject it via runtime config.
- `initialThread?: string` — Thread ID to open first. Defaults to a new thread when undefined.
- `theme?: Partial<ThemeOption>` — Visual configuration for color scheme, radius, density, and other theming fields exposed by ChatKit’s `ChatKitTheme` support.
- `api?: Partial<HostedApiConfig>` — API configuration. Provide `getClientSecret` to mint/refresh client secrets from your proxy; matches ChatKit’s hosted API contract.
- `header?: Partial<HeaderOption>` — Controls header visibility and optional left/right actions or static titles as defined in ChatKit’s header config.
- `history?: Partial<HistoryOption>` — Enables thread history and toggles delete/rename controls from the ChatKit history settings.
- `startScreen?: Partial<StartScreenOption>` — Customize the new-thread greeting and starter prompts shown before the first message.
- `threadItemActions?: Partial<ThreadItemActionsOption>` — Toggle response feedback, retry, or share actions for thread items per ChatKit options.
- `composer?: Partial<ComposerOption>` — Configure composer placeholder, models, tools, and attachment limits (max size/count, MIME acceptance). Attachments are disabled by default here but can be enabled to match ChatKit defaults.
- `disclaimer?: Partial<DisclaimerOption>` — Provide optional disclaimer text below the composer, with support for high-contrast styling.
- `entities?: Partial<EntitiesOption>` — Supply callbacks for entity tagging, autocomplete search, click handlers, and previews used by ChatKit’s tag UI.
- `widgets?: Partial<WidgetsOption>` — Enable widget actions by handling `onAction` from ChatKit widgets such as cards or list views.
- Event handlers: `onError`, `onResponseStart`, `onResponseEnd`, `onThreadChange`, `onThreadLoadStart`, `onThreadLoadEnd`, `onLog` — Register callbacks to mirror the underlying web component events for logging, response lifecycle, and thread management.

## Events

The wrapper wires the `openai-chatkit` element events into Vue-friendly callbacks:

- `chatkit.error` → `onError` — Raised when the component encounters an error; payload includes an `Error` instance.
- `chatkit.ready` → `onReady` — Fired when the component reaches a ready state.
- `chatkit.response.start` → `onResponseStart` — Fired when ChatKit begins streaming a response.
- `chatkit.response.end` → `onResponseEnd` — Fired after the streamed response completes.
- `chatkit.thread.change` → `onThreadChange` — Fired when the active thread changes; includes the new `threadId` (or `null`).
- `chatkit.thread.load.start` → `onThreadLoadStart` — Emitted when a thread begins loading.
- `chatkit.thread.load.end` → `onThreadLoadEnd` — Emitted when thread loading completes.
- `chatkit.log` → `onLog` — General-purpose logging hook with a `name` and optional `data` payload from ChatKit internals.

## Customization

Use the [OpenAI ChatKit Studio Playground](https://chatkit.studio/playground) to experiment with themes, start screen prompts, thread actions, widgets, and composer tools. Export the generated options and pass them directly into the corresponding props above. The Vue wrapper forwards these options unchanged to the underlying web component.

## License

This package bundles the OpenAI ChatKit web component and related assets under the [Apache 2.0](./LICENSE) license. See [NOTICE-OPENAI](./NOTICE) for attribution details consistent with the upstream `@openai/chatkit` distribution.

## Unsupported / To-do

The following items are not (yet) supported and will be implemented as needed:

- Client Tool handlers (onClientTool)
- Customize locale (is currently automatically chosen through browser)