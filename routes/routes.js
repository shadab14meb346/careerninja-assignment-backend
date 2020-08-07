const express = require('express');
const {
	listBattleLocations,
	battleCount,
	search,
	populateDB,
	query
} = require('../controllers/controllers');

const router = express.Router();

router.get('/battle-location/list', listBattleLocations);
router.get('/battle/count', battleCount);
router.get('/battle/search', search);
router.get('/populate-db', populateDB);
router.get('/query', query);
module.exports = router;
