const EXPOSE_KEY = Symbol('Expose key')

export function getTargetTrap(target, name) {
    if (name === EXPOSE_KEY) return target
}

export function exposeTarget(targetOrProxy) {
    const t = targetOrProxy[EXPOSE_KEY]
    return t ?? targetOrProxy // likely not a proxy if defaults
}
