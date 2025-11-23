<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import { checkUserId, getThreadId, setThreadId } from '../lib'
    import type { OpenAIChatKit, ChatKitOptions, ThemeOption, StartScreenOption } from '@openai/chatkit'
    import { useLibraryConfig } from '../index'
    import type { ChatKitProperties } from '../types/ChatKitProperties'
    import { $fetch } from 'ofetch'
    import '../lib/chatkit'

    // chat-kit html element reference
    const chatkitElement = ref<HTMLElement | null>(null)

    // Options and properties
    defineOptions({ name: 'ChatKit' })
    const props = defineProps<ChatKitProperties>()

    // Config
    const config = useLibraryConfig()

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

        // Retrieve or create a new unique id from local storage
        const userId = props.userId || checkUserId()
        const threadId = props.initialThread || getThreadId()
        const workflowId = props.workflowKey || (config ? config.chatkitOpenAIWorkflowKey : undefined);

        // Check properties
        if (!workflowId) throw new Error('OpenAI Workflow id property (workflowKey) is not given but is required')

        // Events
        chatkit.addEventListener('chatkit.log', function(event) {
            if (props.onLog) props.onLog(event);
            console.log('chatkit.log', event.detail)
        })
        chatkit.addEventListener('chatkit.error', function(event) {
            if (props.onError) props.onError(event);
            console.log('chatkit.error', event.detail)
        })
        chatkit.addEventListener('chatkit.response.start', function(event) {
            if (props.onResponseStart) props.onResponseStart(event);
            console.log('chatkit.response.start', event.detail)
        })
        chatkit.addEventListener('chatkit.response.end', function(event) {
            if (props.onResponseEnd) props.onResponseEnd(event);
            console.log('chatkit.response.end', event.detail)
        })
        chatkit.addEventListener('chatkit.thread.change', function(event) {
            // Store thread last seen/created
            setThreadId(event.detail.threadId);
            if (props.onThreadChange) props.onThreadChange(event);
            console.log('chatkit.thread.change', event.detail)
        })
        chatkit.addEventListener('chatkit.thread.load.start', function(event) {
            if (props.onThreadLoadStart) props.onThreadLoadStart(event);
            console.log('chatkit.thread.load.start', event.detail)
        })
        chatkit.addEventListener('chatkit.thread.load.end', function(event) {
            if (props.onThreadLoadEnd) props.onThreadLoadEnd(event);
            console.log('chatkit.thread.load.end', event.detail)
        })

        // Create an options structure
        const options: ChatKitOptions = {
            initialThread: threadId,
            api: {
                async getClientSecret(currentClientSecret: string | null) {
                    // Create a new session is no secret is not passed as parameter
                    if (!currentClientSecret) {
                        // https://platform.openai.com/docs/api-reference/chatkit/sessions/create
                        const data: any = await $fetch('/api/openai/chatkit/sessions', {
                            method: 'POST',
                            body: {
                                user: userId,
                                workflow: { id: workflowId },
                            },
                        })
                        return data.client_secret
                    }
                    return currentClientSecret
                },
            },
            theme:  {
                colorScheme: isDark.value ? 'dark' : 'light',
                radius: 'round',
                density: 'spacious',
                ...props.theme
            } as ThemeOption,
            composer: {
                attachments: {
                    enabled: false,
                },
            },
            startScreen: {
                greeting: 'Welcome to this ChatKit example',
                prompts: [
                    {
                        icon: 'circle-question',
                        label: 'What is ChatKit?',
                        prompt: 'What is ChatKit and what does it do?',
                    },
                    {
                        icon: 'write',
                        label: 'How can I implement this into my own app?',
                        prompt: 'Explain how this component (https://github.com/eniewold/openai-chatkit-vue) can be imported and used insied a containing web app. Check for requirements and needed configuration items. ',
                    },
                ],
                ...props.startScreen
            },
        }

        // Finally set the options
        chatkit.setOptions(options)

    });

</script>

<template>
    <openai-chatkit ref="chatkitElement" />
</template>
