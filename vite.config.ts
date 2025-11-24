import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            outDir: 'dist',
            tsconfigPath: 'tsconfig.json',
            insertTypesEntry: true,
            rollupTypes: true
        })
    ],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'ChatKitVue',
            fileName: (format) => `chatkit-wrapper-vue.${format}.js`,
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
