import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { uiConfig } from '../ui'

export const getPluginsConfig = (): PluginOption[] => {
    const plugins: PluginOption[] = [vue()]
    // 自动导入 Vue 相关 API
    plugins.push(
        AutoImport({
            imports: [
                'vue',
                'vue-router'
            ],
            dts: 'src/config/auto-imports.d.ts',
            dirs: [
                'src/composables',
                'src/utils'
            ],
            vueTemplate: true,
            eslintrc: {
                enabled: false,
            }
        })
    )
    const resolvers = []
    if (uiConfig.framework === 'antdv') {
        resolvers.push(
            AntDesignVueResolver({
                importStyle: false,
            })
        )
    }

    // 自动导入组件
    plugins.push(
        Components({
            dirs: ['src/components'],
            extensions: ['vue'],
            deep: true,
            dts: 'src/config/components.d.ts',
            resolvers,
            types: [{
                from: 'vue-router',
                names: ['RouterLink', 'RouterView']
            }]
        })
    )

    return plugins
}