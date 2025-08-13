const BaseUIParser = require('./base.cjs')

class AntdvParser extends BaseUIParser {
    constructor() {
        super()
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

    convertAttributes(attributes, componentName) {
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
}

module.exports = AntdvParser