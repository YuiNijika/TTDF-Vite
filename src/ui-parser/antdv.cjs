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
            'paragraph': 'p',
            // 补充更多组件映射
            'layout': 'div',
            'layout-header': 'header',
            'layout-content': 'main',
            'layout-footer': 'footer',
            'layout-sider': 'aside',
            'menu': 'ul',
            'menu-item': 'li',
            'submenu': 'li',
            'breadcrumb': 'nav',
            'breadcrumb-item': 'span',
            'pagination': 'ul',
            'steps': 'div',
            'step': 'div',
            'tabs': 'div',
            'tab-pane': 'div',
            'tooltip': 'span',
            'popover': 'span',
            'modal': 'div',
            'drawer': 'div',
            'table': 'table',
            'list': 'div',
            'list-item': 'div',
            'carousel': 'div',
            'carousel-item': 'div',
            'collapse': 'div',
            'collapse-panel': 'div',
            'timeline': 'ul',
            'timeline-item': 'li',
            'tree': 'ul',
            'tree-node': 'li',
            'rate': 'ul',
            'slider': 'div',
            'switch': 'button',
            'upload': 'div',
            'progress': 'div',
            'spin': 'div',
            'skeleton': 'div',
            'dropdown': 'div',
            'dropdown-button': 'button',
            'popconfirm': 'span'
        }
        this.booleanProps = ['block', 'disabled', 'loading', 'ghost', 'wrap', 'checked', 'indeterminate']
        // 添加更多布尔属性
        this.extendedBooleanProps = [
            'bordered', 'showSearch', 'allowClear', 'multiple', 'closable',
            'closeIcon', 'showIcon', 'dot', 'overflowCount', 'showZero',
            'draggable', 'selectable', 'checkable', 'autoFocus', 'readOnly'
        ]
    }

    convertStartTag(componentName, attributes) {
        const htmlTag = this.componentMap[componentName] || 'div'
        const convertedAttrs = this.convertAttributes(attributes, componentName)
        return `<${htmlTag}${convertedAttrs ? ' ' + convertedAttrs : ''}>`
    }

    convertEndTag(componentName) {
        const htmlTag = this.componentMap[componentName] || 'div'
        return `</${htmlTag}>`
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

        // 处理 status 属性
        const statusMatch = result.match(/status="([^"]+)"/)
        if (statusMatch) {
            classes.push(`ant-${componentName}-${statusMatch[1]}`)
            result = result.replace(/status="[^"]+"/, '').trim()
        }

        // 处理布尔属性
        this.booleanProps.forEach(prop => {
            const regex = new RegExp(`\\b${prop}\\b`, 'g')
            if (regex.test(result)) {
                classes.push(`ant-${componentName}-${prop}`)
                result = result.replace(regex, '').trim()
            }
        })

        // 处理扩展布尔属性
        this.extendedBooleanProps.forEach(prop => {
            const regex = new RegExp(`\\b${prop}\\b`, 'g')
            if (regex.test(result)) {
                classes.push(`ant-${componentName}-${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}`)
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
        let result = templateContent;

        // 自动处理所有 v-for 循环
        result = result.replace(
            /<([a-zA-Z0-9-]+)([^>]*?)v-for="([^"]+)"([^>]*?):key="([^"]+)"([^>]*?)>([\s\S]*?)<\/\1>/g,
            (match, tagName, beforeFor, forExpr, afterFor, keyExpr, afterKey, content) => {
                // 提取组件名称（去除前缀 a-）
                const componentName = tagName.replace(/^a-/, '');
                
                // 获取数组名
                const arrayName = forExpr.split(' in ')[1];
                const dataArray = componentData[arrayName] || [];

                // 生成展开的组件
                let expandedComponents = '';
                
                dataArray.forEach((item, index) => {
                    // 构建组件属性
                    let attrs = '';
                    
                    // 处理 key 属性
                    const keyValue = item[keyExpr] || item.key || item.id || index;
                    attrs += ` key="${keyValue}"`;
                    
                    // 处理其他属性（从原始标签中提取）
                    let allAttrs = beforeFor + afterFor + afterKey;
                    
                    // 处理文本内容中的插值
                    let processedContent = content;
                    if (content.includes('{{') && content.includes('}}')) {
                        // 简单处理最常见的文本插值情况
                        processedContent = content.replace(/\{\{([^}]+)\}\}/g, (match, expr) => {
                            // 清理表达式，移除 item. 前缀
                            const cleanExpr = expr.trim().replace(/^item\./, '');
                            return item[cleanExpr] || '';
                        });
                    }
                    
                    // 特殊处理某些组件的属性
                    if (tagName === 'a-button' && item.type) {
                        attrs += ` type="${item.type}"`;
                    }
                    
                    if (tagName === 'a-tab-pane' && item.tab) {
                        attrs += ` tab="${item.tab}"`;
                    }
                    
                    if (tagName === 'a-menu-item' && (item.key || item.id)) {
                        attrs += ` key="${item.key || item.id}"`;
                    }
                    
                    // 合并原始属性（移除 v-for 和 :key 相关属性）
                    const cleanedAttrs = allAttrs
                        .replace(/v-for="[^"]*"/g, '')
                        .replace(/:key="[^"]*"/g, '')
                        .trim();
                    
                    if (cleanedAttrs) {
                        attrs += ' ' + cleanedAttrs;
                    }
                    
                    expandedComponents += `<${tagName}${attrs}>${processedContent}</${tagName}>`;
                });

                return expandedComponents;
            }
        );

        return result;
    }
}

module.exports = AntdvParser