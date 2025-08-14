const BaseUIParser = require('./base.cjs')

class TailwindUIParser extends BaseUIParser {
    convertToStaticTemplate(templateContent, componentData) {
        // 最小化处理，只移除 Vue 特定语法
        return templateContent
            .replace(/{{[^}]*}}/g, '')
            .replace(/@\w+="[^"]*"/g, '')
            .replace(/:\w+="[^"]*"/g, '')
            .replace(/v-\w+="[^"]*"/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/\s*=\s*/g, '=')
            .replace(/>\s+</g, '> <')
            .trim()
    }
}

module.exports = TailwindUIParser