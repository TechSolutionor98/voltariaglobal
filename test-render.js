const { getPublishedContent, getCmsVal } = require('./lib/cms-service.js');
const { getDb } = require('./lib/mongodb.js');
require('dotenv').config({ path: '.env.local' });

async function test() {
  process.env.MONGODB_URI = 'mongodb+srv://admin:admin@cluster0.ac1fznk.mongodb.net';
  process.env.MONGODB_DB = 'voltariadb';

  const content = await getPublishedContent('/products/fans');
  const t = (val) => getCmsVal(content, val);
  
  console.log("Name:", t("Voltaria AeroBreeze Ceiling Fan"));
  console.log("Image:", t("/images/voltaria-fan.png"));
  
  const db = await getDb();
  await db.client.close();
}
test();
