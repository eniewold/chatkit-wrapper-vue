<script setup lang="ts">
    import '../lib/chatkit'
    import { ref, onMounted, computed, onBeforeUnmount, defineOptions, defineProps } from 'vue'
    import { checkUserId, getThreadId, setThreadId } from '../lib'
    import type { OpenAIChatKit, ChatKitOptions, ThemeOption, StartScreenOption, ChatKitEvents } from '@openai/chatkit'
    import type { ChatKitProperties, ChatKitHandlers, SessionCreateParams } from '../types/ChatKitProperties'
    import { $fetch } from 'ofetch'

    // chat-kit html element reference
    const chatkitElement = ref<HTMLElement | null>(null)

    // Options and properties
    defineOptions({ name: 'ChatKit' })

    // Define properties for the our component
    const props = defineProps<ChatKitProperties>()

    // Create a list of all possible listeners
    const ourListeners: Record<keyof ChatKitHandlers, keyof ChatKitEvents> = {
        'onReady': 'chatkit.ready',
        'onError': 'chatkit.error',
        'onLog': 'chatkit.log',
        'onResponseStart': 'chatkit.response.start',
        'onResponseEnd': 'chatkit.response.end',
        'onThreadChange': 'chatkit.thread.change',
        'onThreadLoadStart': 'chatkit.thread.load.start',
        'onThreadLoadEnd': 'chatkit.thread.load.end',
    }
    // Keep track of active listeners for dispose purposes
    const activeListeners: Array<() => void> = []

    // Dark mode detector (select dark mode automatically if root document contains dark class)
    const isDark = computed(() =>
        document.documentElement.classList.contains("dark")
    )

    // When mounted, start to initialize the chatkit with options
    onMounted(async () => {
        // Wait until web component is available (is loaded through client side plugin)
        await customElements.whenDefined('openai-chatkit')

        // Make sure to use reference as web component
        const chatkit = chatkitElement.value as OpenAIChatKit

        // Apply the event handlers
        for (const [handler, event] of Object.entries(ourListeners) as [keyof ChatKitHandlers, keyof ChatKitEvents][]) {
            const listener = (payload: any) => {
                // Call external handler (if any)
                props[handler]?.(payload)
                // Save the thread when changed
                if (event === 'chatkit.thread.change') setThreadId(payload.detail.threadId)
            }
            chatkit.addEventListener(event, listener)
            // Store the event and listener in callable function array
            activeListeners.push(() => chatkit.removeEventListener(event, listener))
        }

        // Retrieve or create a new unique id from local storage
        const userId = props.userId || checkUserId()

        // Check properties
        if (!props.workflowKey) throw new Error('OpenAI Workflow id property (workflowKey) is not given but is required')

        // Session create parameters
        const sesion: SessionCreateParams = {
            user: userId,
            workflow: {
                id: props.workflowKey,
                version: props.workflowVersion ? String(props.workflowVersion) : undefined
            }
        }

        // Create an options structure
        const options: ChatKitOptions = {
            api: {
                // https://platform.openai.com/docs/api-reference/chatkit/sessions/create
                async getClientSecret(currentClientSecret: string | null) {
                    // Create a new session is no secret is not passed as parameter
                    if (!currentClientSecret) {                        
                        const url = props.sessionsUrl || '/api/openai/chatkit/sessions';
                        const data: any = await $fetch(url, {
                            method: 'POST',
                            body: {
                                ...sesion
                            },
                        })
                        return data.client_secret
                    }
                    return currentClientSecret
                },
                ...props.api
            },
            //locale: '',
            theme: {
                colorScheme: isDark.value ? 'dark' : 'light',
                ...props.theme
            },
            initialThread: props.initialThread || getThreadId(),
            //onClientTool: {}
            header: {
                ...props.header
            },
            history: {
                ...props.history
            },
            startScreen: {
                ...props.startScreen
            },
            threadItemActions: {
                ...props.threadItemActions
            },
            composer: {
                ...props.composer
            },
            disclaimer: {
                text: "AI-generated content - please verify important information.",
                ...props.disclaimer
            },
            entities: {
                ...props.entities
            },
            widgets: {
                ...props.widgets
            },
        }

        // Apply the web component options
        chatkit.setOptions(options)

    });

    // Make sure to remove all active listeners when unmounting
    onBeforeUnmount(() => {
        activeListeners.forEach((f) => f());
    });

</script>

<template>
    <openai-chatkit ref="chatkitElement" :class="props.class" :style="props.style" />
</template>
