import { ServerOptions } from 'vite'

export const getServerConfig = (): ServerOptions => ({
    port: 3000,
    strictPort: true,
    host: true,
    origin: 'http://localhost:3000'
})