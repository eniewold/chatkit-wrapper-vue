# ChatKit Vue Component - OpenAI ChatKit

A Vue 3 wrapper around the OpenAI ChatKit web component so Vue and Nuxt developers can drop a fully featured AI chat UI into their apps.

A proxy is required to hide OpenAI secrets from the browser. Use the companion [ChatKit Wrapper Nuxt server](https://github.com/eniewold/chatkit-wrapper-nuxt) to expose secure `/api/openai/chatkit/*` endpoints.

## Features

- First-class Vue 3 component with optional plugin installation for Nuxt 3 and Vue 3 projects.
- Ships the official OpenAI ChatKit web component for streaming responses, thread management, widgets, and attachment handling out of the box.
- Typed props mirror the underlying `@openai/chatkit` options, so the same configuration works in Vue, Nuxt, or vanilla web builds.
- Built-in event bindings for lifecycle, error, logging, and thread changes to keep your Vue state in sync.
- Works with dark/light modes and exposes deep UI customization through ChatKit theme options.
- Simple dark mode detection ('dark' class) with automatic ChatKit theme switching

## Requirements

- Node.js 20+ with package manager
- Vue 3 or Nuxt 3 project (Vite-compatible).
- An OpenAI API key with ChatKit access and an existing workflow published in the [Chat prompts](https://platform.openai.com/chat) dashboard (use the `wf_...` workflow ID).
- (for non-development environment) Allowed domain configured in [OpenAI domain allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist).
- Backend proxy that can create ChatKit sessions and inject client secrets, e.g., [chatkit-wrapper-nuxt](https://github.com/eniewold/chatkit-wrapper-nuxt) or use a Cloud Proxy. 

## Installation

### 1. Install the package

```bash
npm install chatkit-wrapper-vue
```

### 2. Usage

After the module has been installed it can be used in your .vue file. the workflowKey (or workflow-key) property is required, as retrieved from the OpenAI Agent builder. 

```ts
<script setup lang="ts">
  import { ChatKit } from 'chatkit-wrapper-vue'
</script>

<template>
  <ChatKit workflowKey="wf_xxxxxx" />
</template>
```

For Nuxt, don't forget to use `<ClientOnly>` tags around the `<ChatKit>` to prevent server side processing.

### 3. Proxy Configuration

Note that a proxy server is needed to hide secret OpenAI API keys, check out the [chatkit-wrapper-nuxt](https://github.com/eniewold/chatkit-wrapper-nuxt) module for ready-to-go implementation. You can also use a Cloud Proxy that supports the OpenAI API.

If you want to use your own proxy, configure it using the `sessionUrl` property directly or using an environment variable, for example:

```ts
<script setup lang="ts">
    import { ChatKit } from 'chatkit-wrapper-vue'
    const sessionsUrl = import.meta.env.VITE_CHATKIT_PROXY_URL;
</script>

<template>
    <ChatKit :sessionsUrl="sessionsUrl" workflow-key="wf_xxxxxx" />
</template>
```

If the `sessionUrl` is not set, it will default to `/api/openai/chatkit/sessions` for same app api routing.

### 4. (optional) Add custom element exception

#### Vue 3

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

#### Nuxt 3

Add the Vue compiler rule to `nuxt.config.ts` and register the module (or use a client plugin) similar to Vue. Combine it with the [chatkit-wrapper-nuxt](https://github.com/eniewold/chatkit-wrapper-nuxt) server to expose the `/api/openai/chatkit/sessions` endpoint that the component calls for `getClientSecret`.

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

`ChatKitProperties` extends the options from `@openai/chatkit` with Vue-friendly types:

- `workflowKey: string` — Required Workflow ID (`wf_...`) required for ChatKit sessions.
- `workflowVersion?: string` — *Optional* Workflow version, if a specific version of a published OpenAI Workflow is needed. Empty by default.
- `sessionsUrl?: string` — *Optional* alternative url to call to kickstart ChatKit communication. Defaults to a local uri default to `/api/openai/chatkit/sessions` 
- `userId?: string` — *Optional* Eser identifier. When omitted, the component generates and reuses a local ID for the session.
- `api?: Partial<HostedApiConfig>` — *Optional* API configuration. Provide `getClientSecret` to mint/refresh client secrets from your proxy; matches ChatKit’s hosted API contract. Leave empty if no custom call is needed. 
- `initialThread?: string` — *Optional* Thread ID to open first. Defaults to a new thread when undefined.
- `theme?: Partial<ThemeOption>` —*Optional* Visual configuration for color scheme, radius, density, and other theming fields exposed by ChatKit’s `ChatKitTheme` support.
- `header?: Partial<HeaderOption>` — *Optional* Controls header visibility and optional left/right actions or static titles as defined in ChatKit’s header config.
- `history?: Partial<HistoryOption>` — *Optional* Enables thread history and toggles delete/rename controls from the ChatKit history settings.
- `startScreen?: Partial<StartScreenOption>` — *Optional* Customize the new-thread greeting and starter prompts shown before the first message.
- `threadItemActions?: Partial<ThreadItemActionsOption>` — *Optional* Toggle response feedback, retry, or share actions for thread items per ChatKit options.
- `composer?: Partial<ComposerOption>` — *Optional* Configure composer placeholder, models, tools, and attachment limits (max size/count, MIME acceptance). Attachments are disabled by default here but can be enabled to match ChatKit defaults.
- `disclaimer?: Partial<DisclaimerOption>` — *Optional* Provide optional disclaimer text below the composer, with support for high-contrast styling.
- `entities?: Partial<EntitiesOption>` — *Optional* Supply callbacks for entity tagging, autocomplete search, click handlers, and previews used by ChatKit’s tag UI.
- `widgets?: Partial<WidgetsOption>` — *Optional* Enable widget actions by handling `onAction` from ChatKit widgets such as cards or list views.

*Note that only the `workflowKey` property is mandatory. The component is implemented to work out-of-the-box without any other properties.*

## Events

The wrapper wires the `openai-chatkit` element events into Vue-friendly callbacks:

- `chatkit.ready` → `onReady` — Fired when the component reaches a ready state.
- `chatkit.error` → `onError` — Raised when the component encounters an error; payload includes an `Error` instance.
- `chatkit.log` → `onLog` — General-purpose logging hook with a `name` and optional `data` payload from ChatKit internals.
- `chatkit.response.start` → `onResponseStart` — Fired when ChatKit begins streaming a response.
- `chatkit.response.end` → `onResponseEnd` — Fired after the streamed response completes.
- `chatkit.thread.change` → `onThreadChange` — Fired when the active thread changes; includes the new `threadId` (or `null`).
- `chatkit.thread.load.start` → `onThreadLoadStart` — Emitted when a thread begins loading.
- `chatkit.thread.load.end` → `onThreadLoadEnd` — Emitted when thread loading completes.

## Customization

Use the [OpenAI ChatKit Studio Playground](https://chatkit.studio/playground) to experiment with themes, start screen prompts, thread actions, widgets, and composer tools. Export the generated options and pass them directly into the corresponding props above. The Vue wrapper forwards these options unchanged to the underlying web component.

## License

This package bundles the OpenAI ChatKit web component and related assets under the [Apache 2.0](./LICENSE) license. See [NOTICE-OPENAI](./NOTICE) for attribution details consistent with the upstream `@openai/chatkit` distribution.

## Unsupported / To-do

The following items are not (yet) supported and will be implemented as needed:

- Client Tool handlers (onClientTool)
- Customize locale (is currently automatically chosen through browser)
- Widget events

## FAQ / Common Errors

- When you get a `HTMLElement is not defined` error, make sure to use `<ClientOnly>` tags around the component to force client only rendering.
- Warnings showing `Failed to resolve component: ChatKit` in console, make sure to setup the import correctly. (Might also be component loading timing issue).
- Errors in console `Invalid client secret format` signal that no proxy is found, install Nuxt module [chatkit-wrapper-nuxt](https://github.com/eniewold/chatkit-wrapper-nuxt) that contains a proxy server component (only for Nuxt framework, not for native Vue)

## Version History

- 0.3.6 - Property 'sessionsUrl' added that is used to kickstart the ChatKit communication. 
- 0.3.5 - README missing essential keyword in instructions
- 0.3.4 - Explicit import of some vue methods
- 0.3.3 - Small fixes to exported types
- 0.3.2 - First public package update
- 0.2.0 - Added support for event listeners, you can now trigger functions on events triggered by the OpenAI ChatKit.
- 0.1.1 - Implemented all support properties on component as pass-through and with default functionality or default values.
- 0.1.0 - Initial version with functional wrapper.