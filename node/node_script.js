#!/usr/bin/env node

const fs = require('fs')
const { promisify } = require('util')
const promisifiedReadDir = promisify(fs.readdir)
const DIARIES_DIRECTORY = '/home/baptiste/Desktop/diary'

const main = async () => {
	const files = await promisifiedReadDir(DIARIES_DIRECTORY)
	for (const file of files) {
		const readStream = await fs.createReadStream(`${DIARIES_DIRECTORY}/${file}`, 'utf-8')
		console.log(`${DIARIES_DIRECTORY}/${file}`)
		readStream.pipe(process.stdout)
	}
}

main()

/*

	1. What does promisify do?
	2. what does async/await do?

	3. What is a read stream, writitable stream, duplex stream? examples? what is binary data? what is encoding
	4. what does piping mean?
		It is a chain of processing elements arranged in a way that the output of one element is the input of the next one
	5. Event loop and callbacks. Thenable, a promise, generator


	make a course regarding GIT.

	Event loop notes:
		sync tasks are executed rightaway
		async are executed "later" with disctinction between:
			microtasks executed after sync tasks but in the same event loop
			macrotasks executedafter sunc tasks in the next event loop

*/

