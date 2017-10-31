const subject = require('./index')

describe('SVG React Loader rewire', () => {

    const mockDevelopmentConfig = {
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    enforce: 'pre',
                    use: [
                        {options: {}, loader: '/path/to/eslint-loader/index.js'}
                    ],
                    include: '/path/to/src'
                },
                {
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: '/path/to/url-loader/index.js',
                            options: {},
                        },
                        {
                            test: /\.(js|jsx|mjs)$/,
                            include: '/path/to/src',
                            loader: '/path/to/babel-loader/lib/index.js',
                            options: {},
                        },
                        {
                            test: /\.css$/,
                            use: [
                                '/path/to/style-loader/index.js',
                                {
                                    loader: '/path/to/css-loader/index.js',
                                    options: {},
                                },
                                {
                                    loader: '/path/to/postcss-loader/lib/index.js',
                                    options: {},
                                },
                            ],
                        },
                        {
                            exclude: [/\.js$/, /\.html$/, /\.json$/],
                            loader: '/path/to/file-loader/dist/cjs.js',
                            options: {name: 'static/media/[name].[hash:8].[ext]'},
                        },
                    ]
                }]
        }
    }

    const mockProductionConfig = {
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    enforce: 'pre',
                    use: [
                        {options: {}, loader: '/path/to/eslint-loader/index.js'}
                    ],
                    include: '/path/to/src'
                },
                {
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: '/path/to/url-loader/index.js',
                            options: {},
                        },
                        {
                            test: /\.(js|jsx|mjs)$/,
                            include: '/path/to/src',
                            loader: '/path/to/babel-loader/lib/index.js',
                            options: {},
                        },
                        {
                            test: /\.css$/,
                            loader: [
                                {
                                    loader: '/path/to/extract-text-webpack-plugin/dist/loader.js',
                                    options: {}
                                },
                                {
                                    loader: '/path/to/style-loader/index.js',
                                    options: {}
                                },
                                {
                                    loader: '/path/to/css-loader/index.js',
                                    options: {}
                                },
                                {
                                    loader: '/path/to/postcss-loader/lib/index.js',
                                    options: {}
                                }
                            ]
                        },
                        {
                            exclude: [/\.js$/, /\.html$/, /\.json$/],
                            loader: '/path/to/file-loader/dist/cjs.js',
                            options: {name: 'static/media/[name].[hash:8].[ext]'},
                        },
                    ]
                }]
        }
    }

    describe('development', () => {

        const result = subject(mockDevelopmentConfig)
        const svgLoader = result.module.rules[1].oneOf[3]
        const fileLoader = result.module.rules[1].oneOf[4]

        it('should set test on the configuration', () => {
            expect(svgLoader.test).toEqual(/\.svg$/)
        })

        it('should set loader on the configuration', () => {
            expect(svgLoader.loader).toContain('/svg-react-loader/')
        })

        it('should insert the SVG loader before the file loader', () => {
            expect(fileLoader.loader).toContain('/file-loader/')
        })
    })

    describe('production', () => {

        const result = subject(mockProductionConfig)
        const svgLoader = result.module.rules[1].oneOf[3]
        const fileLoader = result.module.rules[1].oneOf[4]

        it('should set test on the configuration', () => {
            expect(svgLoader.test).toEqual(/\.svg$/)
        })

        it('should set loader on the configuration', () => {
            expect(svgLoader.loader).toContain('/svg-react-loader/')
        })

        it('should insert the SVG loader before the file loader', () => {
            expect(fileLoader.loader).toContain('/file-loader/')
        })
    })
})
