<script setup>
import { ref } from 'vue';

const features = ref([
    {
        title: '强力驱动',
        desc: '由TTDF强力驱动后端调用',
    },
    {
        title: '现代前端',
        desc: '使用Vite+Vue3的方式开发前端',
    },
    {
        title: '集成UI',
        desc: '集成Antdv可高度自定义',
    }
]);
</script>

<template>
    <div class="welcome-container">
        <div class="background-effect">
            <div class="effect-circle circle-1"></div>
            <div class="effect-circle circle-2"></div>
            <div class="effect-circle circle-3"></div>
            <div class="effect-circle circle-4"></div>
        </div>

        <div class="main-content">
            <div class="title-section">
                <h1 class="welcome-title">TTDF Vite</h1>
                <p class="welcome-subtitle">使用TTDF+Vite+Vue3快速构建现代主题</p>

                <div class="title-buttons">
                    <a-button type="primary" size="large" href="https://github.com/YuiNijika/TTDF-Vite">立即开始</a-button>
                    <a-button size="large" href="https://github.com/YuiNijika/TTDF">安装前置</a-button>
                </div>
            </div>

            <div class="card-section">
                <a-row :gutter="16" justify="center">
                    <a-col :xs="24" :sm="12" :md="8" v-for="(feature, index) in features" :key="index">
                        <a-card hoverable class="feature-card">
                            <a-card-meta :title="feature.title" :description="feature.desc">
                            </a-card-meta>
                        </a-card>
                    </a-col>
                </a-row>
            </div>
        </div>
    </div>
</template>

<style scoped>
.welcome-container {
    height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.background-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.effect-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(24, 144, 255, 0.1);
    animation: float 15s ease-in-out infinite;
}

.circle-1 {
    width: 300px;
    height: 300px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.circle-2 {
    width: 200px;
    height: 200px;
    top: 60%;
    left: 70%;
    animation-delay: 3s;
}

.circle-3 {
    width: 400px;
    height: 400px;
    top: 30%;
    left: 50%;
    animation-delay: 6s;
}

.circle-4 {
    width: 250px;
    height: 250px;
    top: 70%;
    left: 20%;
    animation-delay: 9s;
}

@keyframes float {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
    }

    25% {
        transform: translate(10%, 10%) rotate(5deg);
    }

    50% {
        transform: translate(20%, 0) rotate(0deg);
    }

    75% {
        transform: translate(10%, -10%) rotate(-5deg);
    }
}

.main-content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1200px;
    padding: 20px;
}

.title-section {
    text-align: center;
    margin-bottom: 40px;
}

.welcome-title {
    font-size: 2.5rem;
    margin-bottom: 16px;
    background: linear-gradient(to right, #1890ff, #722ed1);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.welcome-subtitle {
    font-size: 1.2rem;
    color: #595959;
    margin-bottom: 24px;
}

.title-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
}

.card-section {
    margin-top: 40px;
}

.feature-card {
    margin-bottom: 16px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .welcome-title {
        font-size: 2rem;
    }

    .title-buttons {
        flex-direction: column;
        align-items: center;
    }

    .effect-circle {
        display: none;
    }
}
</style>