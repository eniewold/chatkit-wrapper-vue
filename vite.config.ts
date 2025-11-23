import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'ChatKitVue',
            fileName: (format) => `chatkit-vue.${format}.js`,
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
})
