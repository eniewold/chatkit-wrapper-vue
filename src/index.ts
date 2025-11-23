// Main ChatKit component import and export
import ChatKit from './components/ChatKit.vue'
export { default as ChatKit } from './components/ChatKit.vue'

// ChatKit properties type import and export
import type { ChatKitProperties } from './types/ChatKitProperties'
export type { ChatKitProperties }
// Also export OpenAI chatkit exposed types
export type { ThemeOption, HostedApiConfig, HeaderOption, HistoryOption, StartScreenOption, ThreadItemActionsOption, ComposerOption, DisclaimerOption, EntitiesOption, WidgetsOption } from './types/ChatKitProperties'

// Define the options interface for configuration of environment variables
export interface ChatKitOptions {
    chatkitOpenAIWorkflowKey: string
    endpoint?: string
}
let config: ChatKitOptions

// Export for vue components to use the config
import type { App } from 'vue'
export function install(app: App, options: ChatKitOptions) {
    config = options
    app.component('ChatKit', ChatKit)
}

export function useLibraryConfig() {
  return config
}