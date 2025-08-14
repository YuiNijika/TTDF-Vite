const AntdvParser = require('./antdv.cjs');
const TailwindParser = require('./tailwind.cjs');

const uiConfig = {
    framework: 'tailwind'
};

module.exports = {
    uiConfig
};

class UIParserFactory {
    static createParser() {
        switch (uiConfig.framework) {
            case 'antdv':
                return new AntdvParser();
            case 'tailwind':
                return new TailwindParser();
            default:
                throw new Error(`Unsupported UI framework: ${uiConfig.framework}`);
        }
    }
}

module.exports = UIParserFactory;