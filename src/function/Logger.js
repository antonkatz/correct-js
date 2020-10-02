const fs = require('fs');
var fifo = require( '@stdlib/utils/fifo' );

export default Object.create({
    isWriting: false,
    queue: fifo(),
    openedFiles: new Set(),

    logFunctionCall(name, file, lineNumber, Args) {
        this.queue.push({file: file + ".cjslog", data: this.formatFuncLog(name, lineNumber, Args.serialize())})
        console.log('>>>', name, this.queue.length)

        this.writeNext()
    },

    async writeNext(tailCall = false) {
        if (this.isWriting && !tailCall) return

        // check if anything left
        this.isWriting = this.queue.length > 0
        if (!this.isWriting) return

        const {file, data} = this.queue.pop()
        console.log('<<<', this.queue.length)

        if (this.openedFiles.has(file)) {
            fs.appendFileSync(file, data);
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
