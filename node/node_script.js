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
		Converts a callback based function to a promise based one
		See Q5 for details on callback and promise

	2. what does async/await do?
		Async/await: async makes a function always return a promise, await tells a function to wait for the promise to be returned before continuing?

	3. What is a read stream, writitable stream, duplex stream? examples? what is binary data? what is encoding
		Encoding is a system of rules used to convert information. It changes a source code into  symbols, Like UTF-8 in IT or morse code for exemple.

	4. what does piping mean?
		It is a chain of processing elements arranged in a way that the output of one element is the input of the next one
	5. Event loop and callbacks. Thenable, a promise, generator

	Event loop notes:
		sync tasks are executed rightaway
		async are executed "later" with disctinction between:
			microtasks executed after sync tasks but in the same event loop
			macrotasks executedafter sunc tasks in the next event loop
		Callback: from my understanding, it is a mechanism that call the function back in the event loop once the request is completed and output is ready. They can be found in async events
		Promise: used to avoid nesting of callbacks - represent competion or failiure of an async operation. Still not super clear to me
		Thenable:
		Generator: functions that can be suspended and resumed later on - not sure about this one either




*/

