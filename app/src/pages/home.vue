<script setup>
import { onMounted, ref } from 'vue'

const open = ref(false);
const afterOpenChange = bool => {
    console.log('open', bool);
};
const showDrawer = () => {
    open.value = true;
};

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

import { notification } from 'ant-design-vue';
const openNotification = () => {
    notification.open({
        message: 'Notification Title',
        description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
};

onMounted(() => {
    console.log('is home.vue test')
    openNotification();
})
</script>

<template>
    <div class="home-page">
        <a-alert message="is home" type="success" show-icon />
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

        <a-button type="primary" @click="showDrawer">Open</a-button>
        <a-drawer v-model:open="open" class="custom-class" root-class-name="root-class-name"
            :root-style="{ color: 'blue' }" style="color: red" title="Basic Drawer" placement="right"
            @after-open-change="afterOpenChange">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </a-drawer>
    </div>
</template>

<style scoped>
.home-page {
    padding: 50px;
}
</style>