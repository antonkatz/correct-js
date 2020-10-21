import {EXT}      from "./const"
import deleteLogs from './deleteLogs'

const fs = require('fs')
var fifo = require('@stdlib/utils/fifo')
var isFunction = require('@stdlib/assert/is-function')
var isPrimitive = require('@stdlib/assert/is-primitive')
var isSymbol = require('@stdlib/assert/is-symbol')

export default Object.create({
    // beforeRun: deleteLogs(),
    isWriting: false,
    queue: fifo(),
    openedFiles: new Set(),

    logFunctionCall(name, file, lineNumber, Args) {

        this.queue.push({file: file + EXT, data: this.formatFuncLog(name, lineNumber, Args.serialize())})
        // console.log('>>>', name, this.queue.length)

        this.writeNext()
    },

    async writeNext(tailCall = false) {
        // await this.beforeRun

        if (this.isWriting && !tailCall) return

        // check if anything left
        this.isWriting = this.queue.length > 0
        if (!this.isWriting) return

        const {file, data} = this.queue.pop()
        // console.log('<<<', this.queue.length)

        if (this.openedFiles.has(file)) {
            fs.appendFileSync(file, data)
        } else {
            fs.writeFileSync(file, data)
            this.openedFiles.add(file)
        }
        return await this.writeNext(true)
    },

    formatFuncLog(name, lineNumber, args) {
        return `<<< ${name} (${lineNumber})\n` + JSON.stringify(serializeObject(args), null, 2) + "\n\n"
    }
})

function serializeObject(obj, depth = 0) {
    try {
        if (obj == null) return obj
        if (depth >= 5) {
            // console.warn("Reached maximum serialization depth")
            // console.trace()
            return "..."
        }

        if (Array.isArray(obj)) {
            return obj.map(o => serializeObject(o, depth + 1))
        } else if (isFunction(obj?.then)) { // fixme. make more difined
            return "*Promise"
        } else if (obj.__structId) { // fixme. make more difined
            return {
                Contents: serializeObject(obj.Contents, depth + 1),
                Methods: Object.keys(Object.getPrototypeOf(obj))
            }
        } else if (isFunction(obj)) {
            return "Function"
        } else if (typeof obj === 'object') {
            const s = {}
            for (const p in obj) {
                s[p] = serializeObject(obj[p], depth + 1)
            }
            return s
        } else if (isPrimitive(obj)) {
            return isSymbol(obj) ? String(obj) : obj
        } else {
            return "???"
        }
    } catch (e) {
        console.warn("Failed to serialize", e)
        throw e
    }
}

