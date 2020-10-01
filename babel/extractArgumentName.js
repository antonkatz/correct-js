function extract(p) {
    console.log(p)

    const name = p.type === "Identifier" && p.name ||
    (p.type === "AssignmentPattern" && extract(p.left)) || // in case of default params
    (p.type === "ObjectPattern" && extractObjectPattern(p)) ||
    (p.type === "ObjectProperty" && extract(p.value)) ||
    (p.argument && p.argument.name)

    console.log('<<<', name, '<<<//')
    if (!name || !name[0]) console.log("!!!", p, "!!!")

    return Array.isArray(name) ? name.flat() : [name]
}

function extractObjectPattern(pattern) {
    return pattern.properties.map(extract)
}

module.exports.default = extract
