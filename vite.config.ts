import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

// 动态生成每个页面的入口配置
const pagesDir = resolve(__dirname, 'app/src/pages')
const pageFiles = fs.readdirSync(pagesDir)
const input: Record<string, string> = {}

// 为每个页面创建独立的入口点
pageFiles.forEach(file => {
    if (file.endsWith('.vue')) {
        const name = file.replace('.vue', '')
        // 为每个页面创建一个临时入口文件
        const entryFile = resolve(__dirname, `app/src/entry-${name}.ts`)

        // 写入页面特定的入口代码
        const entryContent = `import { createApp } from 'vue'
import PageComponent from './pages/${file}'

const app = createApp(PageComponent)
app.mount('#app')`

        fs.writeFileSync(entryFile, entryContent)
        input[name] = entryFile
    }
})

// 保留主入口用于开发环境
input['main'] = resolve(__dirname, 'app/src/main.ts')

export default defineConfig({
    plugins: [
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false,
                }),
            ],
        }),
        vue(),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './app/src')
        }
    },
    build: {
        outDir: 'assets/dist',
        assetsDir: '',
        rollupOptions: {
            input: input,
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                chunkFileNames: '[name].[hash].js',
                format: 'es'
            },
            preserveEntrySignatures: 'allow-extension'
        }
    },
    server: {
        port: 3000,
        strictPort: true,
        host: true,
        origin: 'http://localhost:3000'
    },
    root: process.cwd()
})