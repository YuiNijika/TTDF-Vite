<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;

// 添加样式到头部
TTDF_Hook::add_action('load_head', function () {
    $cssFile = 'assets/dist/home.css';
    if (file_exists(__DIR__ . '/../../../' . $cssFile)) {
        ?>
        <link rel="stylesheet" href="<?php echo get_theme_file_url($cssFile . '?ver=' . get_theme_version(false)); ?>">
        <?php
    }
});

// 添加脚本到底部
TTDF_Hook::add_action('load_foot', function () {
    // 引入页面特定脚本作为主应用
    $jsFile = 'assets/dist/home.js';
    if (file_exists(__DIR__ . '/../../../' . $jsFile)) {
        ?>
        <script type="module" src="<?php echo get_theme_file_url($jsFile . '?ver=' . get_theme_version(false)); ?>"></script>
        <?php
    }
});
Get::Components('AppHeader');
?>
    <div class="home-page"> <div class="ant-alert ant-alert-success" message="is home" show-icon>> <h1>首页 home.vue</h1> <p>这是首页内容 TTDF+Vite+Vue3</p> <p>test</p><p>test1</p> <div class="ant-space ant-space-wrap">> <button class="ant-button ant-button-primary">>Primary Button</button><button>>Default Button</button><button class="ant-button ant-button-dashed">>Dashed Button</button><button class="ant-button ant-button-text">>Text Button</button><button class="ant-button ant-button-link">>Link Button</button> </div> <button class="ant-button ant-button-primary" >>Open</button> <div class="ant-drawer custom-class" root-class-name="root-class-name" :root-style="{ color: 'blue' }" style="color: red" title="Basic Drawer" placement="right" @after-open-change="afterOpenChange">> <p>Some contents...</p> <p>Some contents...</p> <p>Some contents...</p> </div> </div>
<?php
Get::Components('AppFooter');
?>

