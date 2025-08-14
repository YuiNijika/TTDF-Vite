import { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export const getPluginsConfig = (): PluginOption[] => [
    vue(),

    // 自动导入 Vue 相关 API
    AutoImport({
        imports: [
            'vue',
            'vue-router'
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: [
            'src/composables',
            'src/utils'
        ],
        vueTemplate: true,
        eslintrc: {
            enabled: false, // 当设置为 true 时，会生成 .eslintrc-auto-import.json 文件
        }
    }),

    // 自动导入组件
    Components({
        dirs: ['src/components'],
        extensions: ['vue'],
        deep: true,
        dts: 'src/components.d.ts',
        resolvers: [
            AntDesignVueResolver({
                importStyle: false, // 设置为 'less' 如果你使用 less
            })
        ],
        // 生成组件类型声明
        types: [{
            from: 'vue-router',
            names: ['RouterLink', 'RouterView']
        }]
    })
]