// File: indexes_and_explain.js
// Purpose: create indexes, run explain before/after, drop an index
// How to run: mongosh --file indexes_and_explain.js (or copy-paste into mongosh)
// 1) Identify frequently queried fields: genre, authorId, ratings.score
// Sample collections: Books, Authors, Users
// Explain a sample query BEFORE index creation
print('--- Explain BEFORE index creation: find books by genre "Fantasy" ---');
printjson(db.Books.find({ genre: 'Fantasy' }).explain('executionStats'));
// Create indexes
print('--- Creating indexes ---');
// Single-field indexes
db.Books.createIndex({ genre: 1 });
db.Books.createIndex({ authorId: 1 });
// If ratings is an array of objects with field score: create index on
ratings.score
// Example: ratings: [ { userId: ..., score: 4 }, ... ]
db.Books.createIndex({ 'ratings.score': -1 });
// Compound index (bonus)
db.Books.createIndex({ genre: 1, publicationYear: -1 });
print('--- Explain AFTER index creation: find books by genre "Fantasy" ---');
printjson(db.Books.find({ genre: 'Fantasy' }).explain('executionStats'));
// Compare an aggregation explain example (optional)
print('--- Aggregation explain AFTER index creation (sample): top rated books---');
printjson(db.Books.aggregate([
{ $unwind: '$ratings' },
{ $group: { _id: '$_id', avgRating: { $avg: '$ratings.score' }, title: {
    $first: '$title' } } },
{ $sort: { avgRating: -1 } },
{ $limit: 3 }
]).explain('executionStats'));
// Drop an unnecessary index (example: drop the compound index if not useful)
print('--- Dropping compound index { genre: 1, publicationYear: -1 } ---');
try {
db.Books.dropIndex({ genre: 1, publicationYear: -1 });
print('Dropped compound index successfully');
} catch (e) {
print('Error dropping index (it may not exist): ' + e);
}
// Re-run explain after drop to observe impact
print('--- Explain AFTER dropping index: find books by genre "Fantasy" ---');
printjson(db.Books.find({ genre: 'Fantasy' }).explain('executionStats'));
// End of file
