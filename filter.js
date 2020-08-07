const data = require('./filter.json');
const query = 'Robb Stark';

const getDataInRequiredFormat = (data, query) => {
	const requiredResult = data.search.map((completeObj) => {
		const values = Object.values(completeObj);
		const suggestionArray = values.filter((value) => {
			if (isNaN(value)) return value.includes(query);
			return false;
		});
		return {
			completeObj,
			suggestionArray: [...new Set(suggestionArray)]
		};
	});
	return requiredResult;
};
console.log(getDataInRequiredFormat(data, query));
