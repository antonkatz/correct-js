import {EXT}      from "./const"
import deleteLogs from './deleteLogs'

const fs = require('fs')
var fifo = require('@stdlib/utils/fifo')
var isFunction = require('@stdlib/assert/is-function')

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
    if (obj == null) return obj

    if (Array.isArray(obj)) {
        return obj.map(serializeObject)
    } else if (obj.__structId) { // fixme. make more difined
        return {
            Contents: serializeObject(obj.Contents),
            Methods: Object.keys(Object.getPrototypeOf(obj))
        }
    } else if (isFunction(obj)) {
        return "Function"
    } else if (typeof obj === 'object') {
        const s = {}
        for (const p in obj) {
            s[p] = depth >= 5 ? "..." : serializeObject(obj[p], depth + 1)
        }
        return s
    } else {
        return obj
    }
}

