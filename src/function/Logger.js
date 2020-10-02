const fs = require('fs')
const path = require('path')
var fifo = require('@stdlib/utils/fifo')
const recursive = require("recursive-readdir")

const EXT = ".cjslog"

export default Object.create({
    beforeRun: deleteExisting(),
    isWriting: false,
    queue: fifo(),
    openedFiles: new Set(),

    logFunctionCall(name, file, lineNumber, Args) {

        this.queue.push({file: file + EXT, data: this.formatFuncLog(name, lineNumber, Args.serialize())})
        // console.log('>>>', name, this.queue.length)

        this.writeNext()
    },

    async writeNext(tailCall = false) {
        await this.beforeRun

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
        return `<<< ${name} (${lineNumber})\n` + JSON.stringify(args, null, 2) + "\n\n"
    }
})

async function deleteExisting() {
    const files = await recursive(".",
        ["*node_modules/*", ignoreHiddenDirs, ignoreNonLogs])
    const deleteOps = files.map(f => new Promise((resolve, reject) => {
        fs.unlink(f, reject)
        resolve()
    }))
    await Promise.all(deleteOps)
}

function ignoreHiddenDirs(file, stats) {
    return stats.isDirectory() && path.basename(file).startsWith('.')
}

function ignoreNonLogs(file, stats) {
    return stats.isFile() && path.extname(file) !== EXT
}
