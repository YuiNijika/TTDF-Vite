<script setup>
import { onMounted, ref } from 'vue'

const items = ref([
    {
        title: 'test',
    },
    {
        title: 'test1',
    },
])

const buttons = ref([
    {
        type: 'primary',
        text: 'Primary Button'
    },
    {
        type: 'default',
        text: 'Default Button'
    },
    {
        type: 'dashed',
        text: 'Dashed Button'
    },
    {
        type: 'text',
        text: 'Text Button'
    },
    {
        type: 'link',
        text: 'Link Button'
    }
])

onMounted(() => {
    console.log('is home.vue test')
})
</script>

<template>
    <div class="home-page">
        <h1>首页 home.vue</h1>
        <p>这是首页内容 TTDF+Vite+Vue3</p>
        <p v-for="item in items" :key="item.title">
            {{ item.title }}
        </p>
        <a-space wrap>
            <a-button v-for="button in buttons" :key="button.text"
                :type="button.type === 'default' ? undefined : button.type">
                {{ button.text }}
            </a-button>
        </a-space>
    </div>
</template>

<style scoped>
.home-page {
    padding: 50px;
}
</style>