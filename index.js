const path = require("path");
const ruleChildren = (loader) => loader.use || loader.oneOf || Array.isArray(loader.loader) && loader.loader || []

const findIndexAndRules = (rulesSource, ruleMatcher) => {
    let result = undefined
    const rules = Array.isArray(rulesSource) ? rulesSource : ruleChildren(rulesSource)
    rules.some((rule, index) => result = ruleMatcher(rule) ? {index, rules} : findIndexAndRules(ruleChildren(rule), ruleMatcher))
    return result
}

const createLoaderMatcher = (loader) => (rule) => rule.loader && rule.loader.indexOf(`${path.sep}${loader}${path.sep}`) !== -1
const fileLoaderMatcher = createLoaderMatcher('file-loader')

const addBeforeRule = (rulesSource, ruleMatcher, value) => {
    const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher)
    rules.splice(index, 0, value)
}

module.exports = function (config, env, webpackOptions = {}, svgReactLoaderOptions = {}) {
    const defaults = {
        test: /\.svg$/,
        loader: require.resolve('svg-react-loader'),
    }

    // merge any extra webpack options into the default config
    var svgReactLoader = Object.assign(defaults, webpackOptions)

    // if svg react loader options are passed, 
    // add them to a query dictionary and append that
    if (Object.keys(svgReactLoaderOptions)) {
        // query is necessary because that's how the API works
        // see: https://github.com/jhamlet/svg-react-loader#query-params
        const queryOptions = { query: svgReactLoaderOptions }
        svgReactLoader = Object.assign(svgReactLoader, queryOptions)
    }

    addBeforeRule(config.module.rules, fileLoaderMatcher, svgReactLoader)

    return config
}
