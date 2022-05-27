const fs = require("fs")
const path = require("path")

let dir = process.argv[2]

if (!dir)
	console.log(`directory not provided`), process.exit(1)

let absDir = path.resolve(".", dir)
console.log(`processing dir ${absDir}`)

function recursiveReadDir(dir)
{
	let files = fs.readdirSync(dir)
	let result = []
	files.forEach(file =>
	{
		let filePath = path.join(dir, file)
		let stat = fs.statSync(filePath)
		if (stat.isDirectory())
		{
			result = result.concat(recursiveReadDir(filePath))
		} else
		{
			result.push(filePath)
		}
	})
	return result
}

let files = recursiveReadDir(absDir)

let nnbFiles = files.filter(file => path.extname(file) == ".nnb")

console.log(`found ${nnbFiles.length} nnb files`)
// console.log(nnbFiles)

function convertNnbToMd(nnbFileContents)
{
	return nnbFileContents.cells.map(x => x.source).join('\n\n')
}

nnbFiles.forEach(file =>
{
	let contents = fs.readFileSync(file, "utf8")
	let md = convertNnbToMd(JSON.parse(contents))
	let mdFile = file + ".md"
	fs.writeFileSync(mdFile, md)
})
