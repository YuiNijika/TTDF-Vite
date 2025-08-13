<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
?>
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <?php
    if (TTDF_CONFIG['VITE'] ?? false) {
    ?>
<script type="module" src="http://localhost:3000/@vite/client"></script>
    <script type="module" src="http://localhost:3000/app/src/main.ts"></script>
    <?php
    }
        TTDF_Hook::do_action('load_head');
    ?>
</head>

<body>
    <div id="app">