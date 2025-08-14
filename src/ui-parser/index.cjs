const AntdvParser = require('./antdv.cjs');

const uiConfig = {
    framework: 'antdv'
};

module.exports = {
    uiConfig
};

class UIParserFactory {
    static createParser() {
        switch (uiConfig.framework) {
            case 'antdv':
                return new AntdvParser();
            default:
                throw new Error(`Unsupported UI framework: ${uiConfig.framework}`);
        }
    }
}

module.exports = UIParserFactory;