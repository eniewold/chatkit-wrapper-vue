<script setup lang="ts">
    import { ChatKit } from 'chatkit-wrapper-vue'

    const sessionsUrl = import.meta.env.VITE_CHATKIT_PROXY_URL;
    const workflowKey = import.meta.env.VITE_OPENAI_WORKFLOW_KEY;

</script>

<template>
    <main class="playground">
        <header class="card">
            <h1>ChatKit + Vue Playground</h1>
            <p>
                This playground links the local <code>chatkit-wrapper-vue</code> package via <code>file:..</code> so you can
                experiment with the <code>&lt;ChatKit /&gt;</code> component while developing the library.
            </p>
        </header>

        <section class="card">
            <ChatKit class="openai-chatkit"
                     :sessionsUrl="sessionsUrl"
                     :workflow-key="workflowKey"/>
        </section>
    </main>
</template>
