const MongoClient = require('mongodb').MongoClient;
const dbName = 'careerninja';
const collectionName = 'battles';
let battlesCollection;
const connectDB = async () => {
	const client = await MongoClient.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	const db = await client.db(dbName);
	battlesCollection = await db.collection(collectionName);
	console.log('MongoDB Connected'.cyan.underline.bold);
	return battlesCollection;
};
module.exports = {connectDB, battlesCollection: () => battlesCollection};
