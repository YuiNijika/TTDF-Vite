<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
?>
<div data-component="home">
    <div id="home-component" class="home-page" data-component="home"> <div class="ant-alert ant-alert-success" message="is home" show-icon>> <p>这是首页内容 TTDF+Vite+Vue3</p> <p>test</p><p>test1</p> <div class="ant-space ant-space-wrap">> <button class="ant-button ant-button-primary">>Primary Button</button><button>>Default Button</button><button class="ant-button ant-button-dashed">>Dashed Button</button><button class="ant-button ant-button-text">>Text Button</button><button class="ant-button ant-button-link">>Link Button</button> </div> <button class="ant-button ant-button-primary" >>Open</button> <div class="ant-drawer custom-class" root-class-name="root-class-name" :root-style="{ color: 'blue' }" style="color: red" title="Basic Drawer" placement="right" @after-open-change="afterOpenChange">> <p>Some contents...</p> <p>Some contents...</p> <p>Some contents...</p> </div> </div>
</div>
