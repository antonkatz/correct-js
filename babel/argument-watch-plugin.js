const extractArgumentName = require("./extractArgumentName").default
const template = require("@babel/template").default

const buildImport = template(`
  const watchArguments = require(IMPORT_PATH).default;
`)

module.exports = function transform(babel) {
    console.log("Correct JS env: ", process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'production') return {}

    const t = babel.types

    const importDeclaration = buildImport({
        IMPORT_PATH: t.stringLiteral("@onest.network/correct-js/lib/function/watchArguments")
    })
    const functionVisitor = (id, path, state) => prependWatchToBody(t, id, path, state)

    return {
        visitor: {
            Program(path, state) {
                if (state.file.opts.filename.includes('/correct-js/')) {
                    if (!state.file.opts.filename.includes('function/watchArguments')) {
                        path.unshiftContainer('body', buildImport({
                            // todo make `lib` configurable
                            IMPORT_PATH: t.stringLiteral(state.file.opts.root + '/lib/function/watchArguments')
                        }))
                    }
                } else {
                    path.unshiftContainer('body', importDeclaration)
                }
            },
            FunctionDeclaration(path, state) {
                functionVisitor(path.node.id, path, state)
            },
            ObjectMethod(path, state) {
                // console.log("* ObjectMethod", path.node.key.name, state.file.opts.filename)
                functionVisitor(path.node.key, path, state)
            },
        }
    }
}

function prependWatchToBody(t, id, path, state) {
    const line = path.node.loc && path.node.loc.start.line || -1

    if (state.file.opts.filename.includes('/correct-js/src/function') ||
        (id && id.name.startsWith("_") && line === -1) ||
        // fixme. Logger gets into an infinite loop with Contents
        state.file.opts.filename.includes('/correct-js/src/struct/buildStruct') ||
        state.file.opts.filename.includes('/correct-js/src/struct/contents') ||
        state.file.opts.filename.includes('/correct-js/src/struct/protect')
    ) return

    const fileId = state.file.opts.filename.replace(state.file.opts.root, '.')
    const params = path.node.params

    // console.log('\n\n', fileId, '>>>')

    const paramNames = params.flatMap(extractArgumentName)
    // console.log(paramNames)
    const paramValuesExpr = t.arrayExpression(
        paramNames.map(n => t.arrayExpression([t.stringLiteral(n), t.identifier(n)]))
    )
    const hasRestElement = params.length > 0 && t.isRestElement(params[params.length - 1]) || false

    // console.log()

    const expression = t.callExpression(t.identifier('watchArguments'), [
        t.stringLiteral(id && id.name || ''),
        t.stringLiteral(fileId),
        t.numericLiteral(line),
        t.booleanLiteral(hasRestElement),
        paramValuesExpr,
        t.identifier('arguments')
    ])

    path.get('body').unshiftContainer('body', t.expressionStatement(expression))
}
