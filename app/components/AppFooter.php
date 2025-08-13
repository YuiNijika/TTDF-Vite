<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
?>
    </div>
<?php 
    TTDF_Hook::do_action('load_foot');
    if (!(TTDF_CONFIG['VITE'] ?? false)) {
?>
    <script type="module" src="<?php get_theme_file_url('assets/dist/components.js?ver=' . get_theme_version(false)); ?>"></script>
<?php } ?>
</body>
</html>
