const { getPublishedContent, getCmsVal } = require('./lib/cms-service.js');
const { getDb } = require('./lib/mongodb.js');
require('dotenv').config({ path: '.env.local' });

async function test() {
  // Mock env
  process.env.MONGODB_URI = 'mongodb+srv://admin:admin@cluster0.ac1fznk.mongodb.net';
  process.env.MONGODB_DB = 'voltariadb';

  const content = await getPublishedContent('/products/fans');
  if (!content) {
    console.log("No content found!");
    return;
  }
  
  // Try to get a value
  const val1 = getCmsVal(content, 'Sweep Size');
  const val2 = getCmsVal(content, 'Sweep Size\u200B');
  const val3 = getCmsVal(content, 'Power');
  
  console.log("Sweep Size ->", val1);
  console.log("Sweep Size (zero width) ->", val2);
  console.log("Power ->", val3);
  
  // See what is actually in content.sections
  const firstSection = content.sections.find(s => s.sectionId === 'product_1');
  if (firstSection) {
    console.log("Product 1 fields keys:", Object.keys(firstSection.fields).join(", "));
    console.log("Product 1 original values:", Object.values(firstSection.fields).map(f => f.originalValue).join(", "));
  }
  
  const db = await getDb();
  await db.client.close();
}

test();
