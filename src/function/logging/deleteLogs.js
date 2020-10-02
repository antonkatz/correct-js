import {EXT} from "./const"

const recursive = require("recursive-readdir")
const fs = require('fs')
const path = require('path')

export default async function deleteExisting() {
    const files = await recursive(".",
        ["*node_modules/*", ignoreHiddenDirs, "*.js", "*.ts", ignoreNonLogs])
    const deleteOps = files.map(f => new Promise((resolve, reject) => {
        try {
            fs.unlinkSync(f)
            resolve()
        } catch (e) {
            reject(e)
        }
    }))
    await Promise.all(deleteOps)
    console.log("All logs deleted")
}

function ignoreHiddenDirs(file, stats) {
    return stats.isDirectory() && path.basename(file).startsWith('.')
}

function ignoreNonLogs(file, stats) {
    return stats.isFile() && path.extname(file) !== EXT
}
