<script setup>
import { onMounted, ref } from 'vue'

onMounted(() => {
    console.log('is post')
})
</script>

<template>
    <div class="post-page">
        <h1>文章页</h1>
        <p>这是文章页内容</p>
    </div>
</template>

<style scoped>
.post-page {
    padding: 20px;
}
</style>