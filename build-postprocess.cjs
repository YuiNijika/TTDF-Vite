const fs = require('fs')
const path = require('path')
const { parse } = require('@vue/compiler-sfc')
const { parse: babelParse } = require('@babel/parser')
const traverse = require('@babel/traverse').default

class VueToPhpConverter {
    constructor() {
        this.distDir = path.resolve(__dirname, 'app/components/dist')
        this.pagesDir = path.resolve(__dirname, 'app/src/pages')
        this.componentMap = {
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
        this.booleanProps = ['block', 'disabled', 'loading', 'ghost', 'wrap']
    }

    // 确保目录存在
    ensureDistDir() {
        if (!fs.existsSync(this.distDir)) {
            fs.mkdirSync(this.distDir, { recursive: true })
        }
    }

    // 获取所有页面文件
    getPageFiles() {
        return fs.readdirSync(this.pagesDir)
    }

    // 解析Vue文件
    parseVueFile(filePath) {
        const vueContent = fs.readFileSync(filePath, 'utf-8')
        const { descriptor } = parse(vueContent)

        let templateContent = ''
        let scriptContent = ''

        if (descriptor.template) {
            templateContent = descriptor.template.content.trim()
        }

        if (descriptor.scriptSetup) {
            scriptContent = descriptor.scriptSetup.content
        } else if (descriptor.script) {
            scriptContent = descriptor.script.content
        }

        return { templateContent, scriptContent }
    }

    // 提取组件数据
    extractComponentData(scriptContent) {
        const data = {}

        if (!scriptContent) return data

        try {
            const ast = babelParse(scriptContent, {
                sourceType: 'module',
                plugins: ['typescript']
            })

            traverse(ast, {
                CallExpression(path) {
                    if (path.node.callee.name === 'ref') {
                        const parent = path.parent
                        if (parent.type === 'VariableDeclarator') {
                            const varName = parent.id.name
                            const args = path.node.arguments

                            if (args.length > 0) {
                                if (args[0].type === 'ArrayExpression') {
                                    const arrayData = []
                                    args[0].elements.forEach(element => {
                                        if (element.type === 'ObjectExpression') {
                                            const obj = {}
                                            element.properties.forEach(prop => {
                                                if (prop.key && prop.value) {
                                                    const key = prop.key.name || prop.key.value
                                                    const value = prop.value.value
                                                    obj[key] = value
                                                }
                                            })
                                            arrayData.push(obj)
                                        }
                                    })
                                    data[varName] = arrayData
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            console.warn('Failed to parse script content:', error)
        }

        return data
    }

    // 获取组件对应的 HTML 元素
    getHtmlElementForComponent(componentName) {
        return this.componentMap[componentName] || 'div'
    }

    // 转换 Ant Design 属性为 HTML 属性和类名
    convertAntdAttributes(attributes, componentName) {
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
        this.booleanProps.forEach(prop => {
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

    // 展开 v-for 循环
    expandVForLoops(templateContent, componentData) {
        let result = templateContent

        // 处理按钮的 v-for 循环
        result = result.replace(
            /<a-button\s+v-for="([^"]+)"[^>]*?:key="([^"]+)"[^>]*?:type="([^"]+)"[^>]*>\s*\{\{([^}]+)\}\}\s*<\/a-button>/g,
            (match, forExpr, keyExpr, typeExpr, contentExpr) => {
                const arrayName = forExpr.split(' in ')[1]
                const dataArray = componentData[arrayName] || []

                let buttons = ''
                dataArray.forEach(item => {
                    const typeValue = item.type === 'default' ? '' : ` type="${item.type}"`
                    buttons += `<a-button${typeValue}>${item.text}</a-button>`
                })

                return buttons
            }
        )

        // 处理项目的 v-for 循环
        result = result.replace(
            /<p\s+v-for="([^"]+)"[^>]*?:key="([^"]+)"[^>]*>\s*\{\{([^}]+)\}\}\s*<\/p>/g,
            (match, forExpr, keyExpr, contentExpr) => {
                const arrayName = forExpr.split(' in ')[1]
                const dataArray = componentData[arrayName] || []

                let items = ''
                dataArray.forEach(item => {
                    items += `<p>${item.title || item.text || ''}</p>`
                })

                return items
            }
        )

        return result
    }

    // 转换 Vue 模板为静态 HTML 模板
    convertToStaticTemplate(templateContent, componentData) {
        // 首先处理 v-for 循环展开
        let result = this.expandVForLoops(templateContent, componentData)

        // 处理 Ant Design Vue 组件 (开始标签)
        result = result.replace(/<a-(\w+)([^>]*?)\/?>/g, (match, componentName, attributes) => {
            const htmlElement = this.getHtmlElementForComponent(componentName)
            const htmlAttributes = this.convertAntdAttributes(attributes, componentName)
            const tag = `<${htmlElement}${htmlAttributes ? ' ' + htmlAttributes : ''}>`
            return tag.trim() + '>'
        })

        // 处理 Ant Design Vue 组件 (结束标签)
        result = result.replace(/<\/a-(\w+)>/g, (match, componentName) => {
            const htmlElement = this.getHtmlElementForComponent(componentName)
            return `</${htmlElement}>`
        })

        // 移除所有 Vue 特定语法
        result = result
            .replace(/{{[^}]*}}/g, '')
            .replace(/@\w+="[^"]*"/g, '')
            .replace(/:\w+="[^"]*"/g, '')
            .replace(/v-\w+="[^"]*"/g, '')
            .replace(/@\w+(?=\s|>)/g, '')
            .replace(/:\w+(?=\s|>)/g, '')
            .replace(/v-\w+(?=\s|>)/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/\s*=\s*/g, '=')
            .replace(/>\s+</g, '> <')
            .trim()

        return result
    }

    // 生成PHP模板内容
    generatePhpTemplate(pageName, staticTemplateContent) {
        return `<?php
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
    }

    // 处理单个页面文件
    processPageFile(file) {
        if (!file.endsWith('.vue')) return

        const pageName = file.replace('.vue', '')
        const vueFilePath = path.join(this.pagesDir, file)

        // 解析 Vue 文件
        const { templateContent, scriptContent } = this.parseVueFile(vueFilePath)

        // 提取组件数据
        const componentData = this.extractComponentData(scriptContent)

        // 生成静态模板内容
        const staticTemplateContent = this.convertToStaticTemplate(templateContent, componentData)

        // 生成PHP模板
        const pageContent = this.generatePhpTemplate(pageName, staticTemplateContent)

        // 写入文件
        fs.writeFileSync(path.join(this.distDir, `${pageName}.php`), pageContent)
    }

    // 执行转换过程
    convert() {
        this.ensureDistDir()
        const pageFiles = this.getPageFiles()

        pageFiles.forEach(file => {
            this.processPageFile(file)
        })

        console.log('✅ TTDF: Static PHP page templates generated successfully!')
    }
}

// 执行转换
const converter = new VueToPhpConverter()
converter.convert()