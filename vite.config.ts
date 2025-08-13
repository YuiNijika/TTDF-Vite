import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import * as fs from 'fs'
import * as path from 'path'

// 创建一个统一的入口文件
const entryFile = resolve(__dirname, 'src/entry-components.ts')
const componentsDir = resolve(__dirname, 'src/components')

// 递归获取所有.vue文件
function getAllVueFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = [...results, ...getAllVueFiles(file)];
        } else if (file.endsWith('.vue')) {
            results.push(file);
        }
    });
    return results;
}

const vueFiles = getAllVueFiles(componentsDir);

// 生成统一入口文件的内容
let entryContent = `import 'ant-design-vue/dist/reset.css';\n\n`

vueFiles.forEach(file => {
    const relativePath = path.relative(componentsDir, file).replace(/\\/g, '/');
    const name = relativePath.replace('.vue', '').replace(/\//g, '_'); // 使用下划线连接路径
    entryContent += `import ${name} from './components/${relativePath}'\n`
})

entryContent += `\n// 挂载所有组件的函数\nexport function mountAllComponents() {\n`

vueFiles.forEach(file => {
    const relativePath = path.relative(componentsDir, file).replace(/\\/g, '/');
    const name = relativePath.replace('.vue', '').replace(/\//g, '_');
    entryContent += `  const ${name}Elements = document.querySelectorAll('[data-component="${name}"]');\n`
    entryContent += `  ${name}Elements.forEach(el => {\n`
    entryContent += `    const ${name}App = createApp(${name});\n`
    entryContent += `    ${name}App.mount(el);\n`
    entryContent += `  });\n`
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