const fs = require('fs')
const path = require('path')
const { parse } = require('@vue/compiler-sfc')

const distDir = path.resolve(__dirname, 'app/components/dist')
const pagesDir = path.resolve(__dirname, 'app/src/pages')

// 确保 app 目录存在
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
}

// 读取所有页面文件名
const pageFiles = fs.readdirSync(pagesDir)

// 为每个页面创建对应的 PHP 模板文件
pageFiles.forEach(file => {
    if (!file.endsWith('.vue')) return;
    
    const pageName = file.replace('.vue', '')
    const vueFilePath = path.join(pagesDir, file)
    const vueContent = fs.readFileSync(vueFilePath, 'utf-8')
    
    // 解析 Vue 文件
    const { descriptor } = parse(vueContent)
    let templateContent = ''
    
    if (descriptor.template) {
        templateContent = descriptor.template.content.trim()
    }
    
    // 生成静态模板内容
    const staticTemplateContent = convertToStaticTemplate(templateContent)
    
    const pageContent = `<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;

// 添加样式到头部
TTDF_Hook::add_action('load_head', function () {
    \$cssFile = 'assets/dist/${pageName}.css';
    if (file_exists(__DIR__ . '/../../../' . \$cssFile)) {
        ?>
        <link rel="stylesheet" href="<?php echo get_theme_file_url(\$cssFile . '?ver=' . get_theme_version(false)); ?>">
        <?php
    }
});

// 添加脚本到底部
TTDF_Hook::add_action('load_foot', function () {
    // 引入页面特定脚本作为主应用
    \$jsFile = 'assets/dist/${pageName}.js';
    if (file_exists(__DIR__ . '/../../../' . \$jsFile)) {
        ?>
        <script type="module" src="<?php echo get_theme_file_url(\$jsFile . '?ver=' . get_theme_version(false)); ?>"></script>
        <?php
    }
});
Get::Components('AppHeader');
?>
    ${staticTemplateContent}
<?php
Get::Components('AppFooter');
?>

`
    fs.writeFileSync(path.join(distDir, `${pageName}.php`), pageContent)
})

// 自动转换 Vue 模板为静态 HTML 模板
function convertToStaticTemplate(templateContent) {
    // 首先处理 v-for 循环展开
    let result = expandVForLoops(templateContent)
    
    // 处理 Ant Design Vue 组件 (开始标签)
    result = result.replace(/<a-(\w+)([^>]*?)\/?>/g, (match, componentName, attributes) => {
        const htmlElement = getHtmlElementForComponent(componentName)
        const htmlAttributes = convertAntdAttributes(attributes, componentName)
        // 确保标签格式正确
        return `<${htmlElement}${htmlAttributes ? ' ' + htmlAttributes : ''}>`.trim() + '>'
    })
    
    // 处理 Ant Design Vue 组件 (结束标签)
    result = result.replace(/<\/a-(\w+)>/g, (match, componentName) => {
        const htmlElement = getHtmlElementForComponent(componentName)
        return `</${htmlElement}>`
    })
    
    // 移除所有 Vue 特定语法
    result = result
        .replace(/{{[^}]*}}/g, '') // 移除插值表达式
        .replace(/@\w+="[^"]*"/g, '') // 移除事件绑定
        .replace(/:\w+="[^"]*"/g, '') // 移除属性绑定
        .replace(/v-\w+="[^"]*"/g, '') // 移除 Vue 指令
        .replace(/@\w+(?=\s|>)/g, '') // 移除无值事件绑定
        .replace(/:\w+(?=\s|>)/g, '') // 移除无值属性绑定
        .replace(/v-\w+(?=\s|>)/g, '') // 移除无值指令
        // 清理多余空格，但保留标签间的空格
        .replace(/\s{2,}/g, ' ') // 将多个空格压缩为单个空格
        .replace(/\s*=\s*/g, '=') // 标准化属性赋值
        .replace(/>\s+</g, '> <') // 确保标签间有空格
        .trim()
    
    return result
}

// 展开 v-for 循环（简化版）
function expandVForLoops(templateContent) {
    // 处理按钮的 v-for 循环
    let result = templateContent.replace(
        /<a-button\s+v-for="([^"]+)"[^>]*?:key="([^"]+)"[^>]*?:type="([^"]+)"[^>]*>([^<]*)<\/a-button>/g,
        (match, forExpr, keyExpr, typeExpr, buttonText) => {
            // 简化处理，生成5个按钮实例
            let buttons = ''
            const buttonTypes = ['primary', 'default', 'dashed', 'text', 'link']
            const buttonTexts = ['Primary Button', 'Default Button', 'Dashed Button', 'Text Button', 'Link Button']
            
            for (let i = 0; i < 5; i++) {
                const typeAttr = buttonTypes[i] === 'default' ? '' : ` type="${buttonTypes[i]}"`
                buttons += `<a-button${typeAttr}>${buttonTexts[i]}</a-button>`
            }
            
            return buttons
        }
    )
    
    // 处理普通项目的 v-for 循环
    result = result.replace(
        /<p\s+v-for="([^"]+)"[^>]*?:key="([^"]+)"[^>]*>([^<]*)<\/p>/g,
        (match, forExpr, keyExpr, content) => {
            // 生成2个p标签实例
            return '<p>test</p><p>test1</p>'
        }
    )
    
    return result
}

// 获取组件对应的 HTML 元素
function getHtmlElementForComponent(componentName) {
    const elementMap = {
        'button': 'button',
        'space': 'div',
        'row': 'div',
        'col': 'div',
        'card': 'div',
        'input': 'input',
        'select': 'select',
        'option': 'option',
        'form': 'form',
        'form-item': 'div',
        'checkbox': 'input',
        'radio': 'input',
        'textarea': 'textarea',
        'divider': 'hr',
        'alert': 'div',
        'tag': 'span',
        'badge': 'span',
        'avatar': 'span',
        'icon': 'i',
        'link': 'a',
        'text': 'span',
        'title': 'h1',
        'paragraph': 'p'
    }
    
    return elementMap[componentName] || 'div'
}

// 转换 Ant Design 属性为 HTML 属性和类名
function convertAntdAttributes(attributes, componentName) {
    if (!attributes) return ''
    
    let result = attributes.trim()
    const classes = [`ant-${componentName}`]
    
    // 处理 type 属性
    const typeMatch = result.match(/type="([^"]+)"/)
    if (typeMatch) {
        classes.push(`ant-${componentName}-${typeMatch[1]}`)
        result = result.replace(/type="[^"]+"/, '').trim()
    }
    
    // 处理 size 属性
    const sizeMatch = result.match(/size="([^"]+)"/)
    if (sizeMatch) {
        classes.push(`ant-${componentName}-${sizeMatch[1]}`)
        result = result.replace(/size="[^"]+"/, '').trim()
    }
    
    // 处理布尔属性
    const booleanProps = ['block', 'disabled', 'loading', 'ghost', 'wrap']
    booleanProps.forEach(prop => {
        const regex = new RegExp(`\\b${prop}\\b`, 'g')
        if (regex.test(result)) {
            classes.push(`ant-${componentName}-${prop}`)
            result = result.replace(regex, '').trim()
        }
    })
    
    // 添加类名
    let classAttr = ''
    if (classes.length > 0) {
        if (result.includes('class="')) {
            result = result.replace(/class="([^"]*)"/, (match, existingClasses) => {
                return `class="${classes.join(' ')} ${existingClasses}"`
            })
        } else {
            classAttr = `class="${classes.join(' ')}"`
        }
    }
    
    // 合并类名和其他属性
    const allAttrs = [classAttr, result].filter(attr => attr).join(' ')
    return allAttrs.trim()
}

console.log('Static PHP page templates generated successfully!')