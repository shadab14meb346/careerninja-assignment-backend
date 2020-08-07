const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {battlesCollection} = require('../config/db');
const battleDataInMongoDBFormat = require('../utils/battleDataInMongoDBFormat.json');
// @desc      Get all locations battles were fought
// @route     GET /battle-location/list
// @access    Public
exports.listBattleLocations = asyncHandler(async (req, res, next) => {
	const battle = battlesCollection();
	const response = await battle
		.aggregate([
			{
				$group: {_id: '$location'}
			},
			{
				$project: {
					location: '$_id',
					_id: 0
				}
			},
			{$sort: {location: 1}}
		])
		.toArray();
	res.send(
		JSON.stringify({
			success: true,
			count: response.length,
			data: response.map(({location}) => location)
		})
	);
});
// @desc      Get counts of all battle happened
// @route     GET /battle/count
// @access    Public
exports.battleCount = asyncHandler(async (req, res, next) => {
	const battle = battlesCollection();
	const allBattles = await battle.find({}).toArray();
	res.send({
		success: true,
		count: allBattles.length
	});
});
// @desc      		Get counts of all battle happened
// @route     		GET /battle/search
// @query params	name,year,battle_number,attacker_king,defender_king,attacker_1,attacker_2,attacker_3,attacker_4,defender_1,defender_2,defender_3,defender_4,attacker_outcome,battle_type,major_death,major_capture,attacker_size,defender_size,attacker_commander,defender_commander,summer,location,region
// @access    		Public
exports.search = asyncHandler(async (req, res, next) => {
	const searchParams = {};
	for (const [param, value] of Object.entries(req.query)) {
		if (value) {
			searchParams[param] = isNaN(value) ? value : Number(value);
		}
	}
	const battle = battlesCollection();
	const response = await battle.find(searchParams).toArray();
	res.send({
		success: true,
		data: response,
		count: response.length
	});
});

// @desc      Populate DB from the xl details.
// @route     GET /populate-db
// @access    It will be private
exports.populateDB = asyncHandler(async (req, res, next) => {
	const battle = battlesCollection();
	const response = await battle.insertMany(battleDataInMongoDBFormat.battles);
	if (response.result.ok === 1) {
		res.send({
			success: true,
			data: 'successfully pushed all data'
		});
	}
});

// @route     GET /query
// @access    Public
exports.query = asyncHandler(async (req, res, next) => {
	const battle = battlesCollection();
	const response = await battle.find({$text: {$search: req.query.q}}).toArray();
	res.send({
		success: true,
		data: getDataInRequiredFormat(response, req.query.q),
		count: response.length
	});
});
const getDataInRequiredFormat = (data, query) => {
	const requiredResult = data.map((completeObj) => {
		const values = Object.values(completeObj);
		const suggestionArray = values.filter((value) => {
			if (typeof value === 'string') {
				return value.includes(query);
			}
			return false;
		});
		return {
			completeObj,
			suggestionArray: [...new Set(suggestionArray)]
		};
	});
	return requiredResult;
};
