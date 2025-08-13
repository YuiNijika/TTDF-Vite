import { PluginOption } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'

export const getPluginsConfig = (): PluginOption[] => [
    Components({
        resolvers: [
            AntDesignVueResolver({
                importStyle: false,
            }),
        ],
    }),
    vue(),
]