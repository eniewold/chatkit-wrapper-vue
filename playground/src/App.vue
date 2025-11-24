<script setup lang="ts">
import { ChatKit } from 'chatkit-wrapper-vue'

const workflowKey = 'demo-workflow-id'
const apiOptions = {
  async getClientSecret() {
    return 'playground-client-secret'
  }
}

const header = {
  title: 'ChatKit Playground',
  subtitle: 'Try the Vue wrapper with a simple configuration.'
}

const composer = {
  placeholder: 'Ask me anything about the ChatKit wrapper…'
}

const startScreen = {
  headline: 'Hello from ChatKit',
  description: 'Swap the workflow key and API handler with your own values to talk to your AI.'
}
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

    <section class="demo-grid">
      <article class="card">
        <h2>Configuration</h2>
        <p>Update the <code>workflowKey</code> and <code>api.getClientSecret</code> to point at your backend.</p>
      </article>
      <article class="card">
        <h2>Theme &amp; UX</h2>
        <p>Toggle the document <code>dark</code> class or pass props to adjust the theme.</p>
      </article>
    </section>

    <section class="card">
      <ChatKit
        class="openai-chatkit"
        :workflow-key="workflowKey"
        :api="apiOptions"
        :header="header"
        :composer="composer"
        :start-screen="startScreen"
      />
    </section>
  </main>
</template>
