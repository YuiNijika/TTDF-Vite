<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;

// 添加样式到头部
TTDF_Hook::add_action('load_head', function () {
    $cssFile = 'assets/dist/home.css';
    if (file_exists(__DIR__ . '/../../' . $cssFile)) {
        ?>
        <link rel="stylesheet" href="<?php echo get_theme_file_url($cssFile . '?ver=' . get_theme_version(false)); ?>">
        <?php
    }
});

// 添加脚本到底部
TTDF_Hook::add_action('load_foot', function () {
    // 引入页面特定脚本作为主应用
    $jsFile = 'assets/dist/home.js';
    if (file_exists(__DIR__ . '/../../' . $jsFile)) {
        ?>
        <script type="module" src="<?php echo get_theme_file_url($jsFile . '?ver=' . get_theme_version(false)); ?>"></script>
        <?php
    }
});

// 添加页面内容
TTDF_Hook::add_action('page_content', function () {
    ?>
<div class="home-page">
        <h1>首页</h1>
        <p>这是首页内容</p>
    </div>
    <?php
});
?>

