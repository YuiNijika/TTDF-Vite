const fs = require('fs')
const path = require('path')

const distDir = path.resolve(__dirname, 'app/dist')
const pagesDir = path.resolve(__dirname, 'app/src/pages')

// 确保 app 目录存在
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
}

// 读取所有页面文件名
const pageFiles = fs.readdirSync(pagesDir)

// 创建对应的 PHP 模板文件
pageFiles.forEach(file => {
    if (!file.endsWith('.vue')) return;
    
    const pageName = file.replace('.vue', '')
    const vueFilePath = path.join(pagesDir, file)
    const vueContent = fs.readFileSync(vueFilePath, 'utf-8')
    
    // 提取template部分
    let templateContent = ''
    const templateMatch = vueContent.match(/<template>([\s\S]*)<\/template>/)
    if (templateMatch && templateMatch[1]) {
        templateContent = templateMatch[1].trim()
    }
    
    const pageContent = `<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;

// 添加样式到头部
TTDF_Hook::add_action('load_head', function () {
    \$cssFile = 'assets/dist/${pageName}.css';
    if (file_exists(__DIR__ . '/../../' . \$cssFile)) {
        ?>
        <link rel="stylesheet" href="<?php echo get_theme_file_url(\$cssFile . '?ver=' . get_theme_version(false)); ?>">
        <?php
    }
});

// 添加脚本到底部
TTDF_Hook::add_action('load_foot', function () {
    // 引入页面特定脚本作为主应用
    \$jsFile = 'assets/dist/${pageName}.js';
    if (file_exists(__DIR__ . '/../../' . \$jsFile)) {
        ?>
        <script type="module" src="<?php echo get_theme_file_url(\$jsFile . '?ver=' . get_theme_version(false)); ?>"></script>
        <?php
    }
});

// 添加页面内容
TTDF_Hook::add_action('page_content', function () {
    ?>
${templateContent}
    <?php
});
?>

`
    fs.writeFileSync(path.join(distDir, `${pageName}.php`), pageContent)
})

console.log('PHP page templates generated successfully!')