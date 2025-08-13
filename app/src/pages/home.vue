<script setup>
import { onMounted } from 'vue'

onMounted(() => {
    console.log('is home')
})
</script>

<template>
    <div class="home-page">
        <h1>首页</h1>
        <p>这是首页内容</p>
    </div>
</template>

<style scoped>
.home-page {
    padding: 50px;
}
</style>