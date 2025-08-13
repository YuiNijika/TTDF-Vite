import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import * as fs from 'fs'

// 创建一个统一的入口文件
const entryFile = resolve(__dirname, 'src/entry-components.ts')
const componentsDir = resolve(__dirname, 'src/components')
const componentFiles = fs.readdirSync(componentsDir)

// 生成统一入口文件的内容
let entryContent = `import 'ant-design-vue/dist/reset.css';\n\n`

componentFiles.forEach(file => {
    if (file.endsWith('.vue')) {
        const name = file.replace('.vue', '')
        entryContent += `import ${name} from './components/${file}'\n`
    }
})

entryContent += `\n// 挂载所有组件的函数\nexport function mountAllComponents() {\n`

componentFiles.forEach(file => {
    if (file.endsWith('.vue')) {
        const name = file.replace('.vue', '')
        entryContent += `  const ${name}Elements = document.querySelectorAll('[data-component="${name}"]');\n`
        entryContent += `  ${name}Elements.forEach(el => {\n`
        entryContent += `    const ${name}App = createApp(${name});\n`
        entryContent += `    ${name}App.mount(el);\n`
        entryContent += `  });\n`
    }
})

entryContent += `}\n\n`

entryContent += `import { createApp } from 'vue';\n\n`
entryContent += `// 如果在浏览器环境中，立即挂载所有组件\n`
entryContent += `if (typeof window !== 'undefined') {\n`
entryContent += `  if (document.readyState === 'loading') {\n`
entryContent += `    document.addEventListener('DOMContentLoaded', mountAllComponents);\n`
entryContent += `  } else {\n`
entryContent += `    mountAllComponents();\n`
entryContent += `  }\n`
entryContent += `}\n`

// 写入统一入口文件
fs.writeFileSync(entryFile, entryContent)

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
            '@': resolve(__dirname, './src')
        }
    },
    build: {
        outDir: 'assets/dist',
        assetsDir: '',
        rollupOptions: {
            // 只使用统一入口
            input: {
                components: entryFile
            },
            output: {
                entryFileNames: 'components.js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'components.css';
                    }
                    return '[name].[ext]';
                },
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