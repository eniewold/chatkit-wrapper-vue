// openai chatkit imported types (also export them for component usage)
import type { ThemeOption, HostedApiConfig, HeaderOption, HistoryOption, StartScreenOption, ThreadItemActionsOption, ComposerOption, DisclaimerOption, EntitiesOption, WidgetsOption } from '@openai/chatkit'
export type { ThemeOption, HostedApiConfig, HeaderOption, HistoryOption, StartScreenOption, ThreadItemActionsOption, ComposerOption, DisclaimerOption, EntitiesOption, WidgetsOption }

export interface ChatKitHandlers {
	// Event callbacks, set property to functions to handle events
	onReady?: (event: CustomEvent) => void
	onError?: (event: CustomEvent) => void
	onLog?: (event: CustomEvent) => void
	onResponseStart?: (event: CustomEvent) => void
	onResponseEnd?: (event: CustomEvent) => void
	onThreadChange?: (event: CustomEvent) => void
	onThreadLoadStart?: (event: CustomEvent) => void
	onThreadLoadEnd?: (event: CustomEvent) => void
}

// Properties as supported from OpenAI chatkit itself
export interface ChatKitPropertiesOpenAI extends ChatKitHandlers {
	// Optional user ID to associate with the chat session - Is managed automatically if not provided
	userId?: string
	// Required workflow key to use for the chat session - use workflow key from your OpenAI ChatKit dashboard (wf_xxxxx)
	workflowKey?: string
	// Initial thread to show or empty for new thread - Is managed automatically if not provided
	initialThread?: string
	// Optional properties to customize the chatkit experience
	theme?: Partial<ThemeOption>
	api?: Partial<HostedApiConfig>
	header?: Partial<HeaderOption>
	history?: Partial<HistoryOption>
	startScreen?: Partial<StartScreenOption>
	threadItemActions?: Partial<ThreadItemActionsOption>
	composer?: Partial<ComposerOption>
	disclaimer?: Partial<DisclaimerOption>
	entities?: Partial<EntitiesOption>
	widgets?: Partial<WidgetsOption>
}

export interface ChatKitProperties extends ChatKitPropertiesOpenAI {
	class?: string;
	style?: string;
}
