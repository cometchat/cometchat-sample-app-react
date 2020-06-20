var path = require ('path');
var fs = require ('fs');
const {
    override,
    addDecoratorsLegacy,
    babelInclude,
    disableEsLint,
} = require("customize-cra");

module.exports = function (config, env) {
    return Object.assign(config, override(
        disableEsLint(),
        addDecoratorsLegacy(),
        /*Make sure Babel compiles the stuff in the common folder*/
        babelInclude([
            fs.realpathSync('src'), // don't forget this
            fs.realpathSync('node_modules/uikit/CometChat')
        ])
        )(config, env)
    )
}