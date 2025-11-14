Purpose: Step-by-step Atlas setup, import commands, and Node.js connection
snippet
Save this file as atlas_connection_and_import.md or read it in this document.
1) Create a free cluster in MongoDB Atlas
 - Sign in to https://cloud.mongodb.com and create a new project.
 - In the project, click "Build a Cluster" and choose the free-tier (M0)
cluster.
 - Wait for the cluster to provision (usually a few minutes).
2) Create a database named BookVerseCloudDB
 - In the Atlas UI, go to "Collections" -> "Create Database".
 - Database Name: BookVerseCloudDB
 - Collection Name: (you can create Authors, Books, Users or import them)
3) Export your local collections and import into Atlas
 Option A — Using mongoexport / mongoimport (recommended for JSON collections)
 - Export local collection to JSON
 mongodump --db LocalBookVerseDB --out ./dump
 OR (single collection to json)
 mongoexport --db LocalBookVerseDB --collection Books --out Books.json --
jsonArray
 - Import into Atlas using mongoimport (use the Atlas connection string from
UI):
 mongoimport --uri "<YourAtlasConnectionString>/BookVerseCloudDB" --
 collection Books --file Books.json --jsonArray
 - Repeat for Authors and Users collections.
 Option B — Use MongoDB Compass
 - Open Compass, connect to your local instance and to Atlas cluster (use
connection string).
 - In Atlas Collections view click "ADD DATA" -> "Import File" and import the
JSON files.
4) Connect from Node.js (example script)
 - Save this snippet as connect_to_atlas.js and replace <username>,
<password>, <cluster-url>
```javascript
// File: connect_to_atlas.js
// Run: node connect_to_atlas.js
const { MongoClient } = require('mongodb');
async function main() {
 const uri = 'mongodb+srv://<username>:<password>@<cluster-url>/
BookVerseCloudDB?retryWrites=true&w=majority';
 const client = new MongoClient(uri);
 try {
 await client.connect();
 console.log('Connected to Atlas cluster');
 const db = client.db('BookVerseCloudDB');
 const books = await db.collection('Books').find().limit(3).toArray();
 console.log('Sample books:', books);
 } finally {
 await client.close();
 }
}
main().catch(console.error);