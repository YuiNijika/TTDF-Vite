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
    // 先引入主应用脚本
    $mainJsFile = 'assets/dist/main.js';
    if (file_exists(__DIR__ . '/../../../' . $mainJsFile)) {
        ?>
        <script type="module" src="<?php get_theme_file_url($mainJsFile . '?ver=' . get_theme_version(false)); ?>"></script>
        <?php
    }
    
    // 再引入页面特定脚本（如果有的话）
    $jsFile = 'assets/dist/home.js';
    if (file_exists(__DIR__ . '/../../../' . $jsFile) && 'home' !== 'home') {
        ?>
        <script type="module" src="<?php get_theme_file_url($jsFile . '?ver=' . get_theme_version(false)); ?>"></script>
        <?php
    }
});
Get::Components('AppHeader');
?>
<div class="home-page">
        <h1>首页</h1>
        <p>这是首页内容</p>
    </div>
<?php
Get::Components('AppFooter');
?>

