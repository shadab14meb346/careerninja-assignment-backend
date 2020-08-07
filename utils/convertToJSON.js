const excelToJson = require('convert-excel-to-json');
const rawJSONData = require('./battleData.json');
const fs = require('fs');
const path = require('path');
const XL_FILE_PATH = '../battles.xlsx';
const JSON_FILE_PATH = './battleData.json';

function convertXlToJson(xlFilePath, JSONFilePath) {
	const battleXlFilePath = path.join(__dirname, xlFilePath);
	const battleJSONDataFilePath = path.join(__dirname, JSONFilePath);
	const result = excelToJson({
		source: fs.readFileSync(battleXlFilePath)
	});
	fs.writeFileSync(battleJSONDataFilePath, JSON.stringify(result));
}
convertXlToJson(XL_FILE_PATH, JSON_FILE_PATH);

function convertRawDataToMongoDBFormat(rawJSONData) {
	const {battles} = rawJSONData;
	const [titleObject, ...rest] = battles;
	const battleDataInMongoDBFormat = {};
	battleDataInMongoDBFormat.battles = rest.map((battle) => {
		const resultObj = {};
		for (const [cell, value] of Object.entries(battle)) {
			const title = titleObject[cell];
			resultObj[title] = value;
		}
		return resultObj;
	});
	fs.writeFileSync(
		path.join(__dirname, './battleDataInMongoDBFormat.json'),
		JSON.stringify(battleDataInMongoDBFormat)
	);
}

convertRawDataToMongoDBFormat(rawJSONData);
