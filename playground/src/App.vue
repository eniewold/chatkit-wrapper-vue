<script setup lang="ts">
import { ChatKit } from 'chatkit-wrapper-vue'

const workflowKey = 'demo-workflow-id'
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
      <ChatKit
        class="openai-chatkit"
        :workflow-key="workflowKey"
        :workflow-version="1"
      />
    </section>
  </main>
</template>
