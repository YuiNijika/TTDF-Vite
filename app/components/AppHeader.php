<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
?>
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">

<head>
    <?php
        TTDF_Hook::do_action('load_head');
        if (TTDF_CONFIG['VITE'] ?? false) {
    ?>
    <script type="module" src="http://localhost:3000/@vite/client"></script>
    <script type="module" src="http://localhost:3000/src/main.ts"></script>
    <?php } else { ?>
    <link rel="stylesheet" href="<?php get_theme_file_url('assets/dist/components.css?ver=' . get_theme_version(false)); ?>">
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5/themes.css" rel="stylesheet" type="text/css" />
    <?php } ?>
</head>

<body>
    <div id="app">