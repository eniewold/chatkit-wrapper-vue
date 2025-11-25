// openai chatkit imported types (also export them for component usage)
import type { ThemeOption, HostedApiConfig, HeaderOption, HistoryOption, StartScreenOption, ThreadItemActionsOption, ComposerOption, DisclaimerOption, EntitiesOption, WidgetsOption } from '@openai/chatkit'
export type { ThemeOption, HostedApiConfig, HeaderOption, HistoryOption, StartScreenOption, ThreadItemActionsOption, ComposerOption, DisclaimerOption, EntitiesOption, WidgetsOption }

// Session creation parameters are included from OpenAI chatkit definitions
import type { SessionCreateParams } from 'openai/resources/beta/chatkit'
export type { SessionCreateParams }

// All supported event handlers by ChatKit
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

// Properties for customization of the layout
export interface ChatKitPropertiesCustomization extends ChatKitHandlers {
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

// Properties (required and optional) for initialization of chat control
export interface ChatKitPropertiesInit extends ChatKitPropertiesCustomization {
	// Required workflow key to use for the chat session - use workflow key from your OpenAI ChatKit dashboard (wf_xxxxx)
	workflowKey: string
	// Optional workflow version string for specific workflow version, leave empty for latest production release
	workflowVersion?: string
	// Optional user ID to associate with the chat session - Is managed automatically if not provided
	userId?: string
	// Initial thread to show or empty for new thread - Is managed automatically if not provided
	initialThread?: string
}

// Pass-through of class and style properties set on the component itself
export interface ChatKitProperties extends ChatKitPropertiesInit {
	class?: string;
	style?: string;
}
