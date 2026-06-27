const { MongoClient } = require('mongodb');

async function test() {
  const uri = 'mongodb+srv://admin:admin@cluster0.ac1fznk.mongodb.net';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('voltariadb');
  
  const content = await db.collection('cms_page_content').find({path: /products/}).toArray();
  console.log("CMS Content Paths:");
  console.log(content.map(x => x.path));
  
  const routes = await db.collection('cms_routes').find({path: /products/}).toArray();
  console.log("CMS Routes Paths:");
  console.log(routes.map(x => x.path));
  
  client.close();
}

test();
