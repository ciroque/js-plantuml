module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
    ],
    plugins: [
        'syntax-async-generators',
        ["@babel/plugin-proposal-pipeline-operator", { "proposal": "fsharp" }]
    ]
};
