// File: aggregation_pipelines.js
// Purpose: aggregation pipelines for User Story 2
// How to run: mongosh --file aggregation_pipelines.js (or copy-paste into 
// mongosh)
// 1) Calculate the average rating per book using $unwind, $group, $avg
print('--- Average rating per book ---');
printjson(db.Books.aggregate([
{ $unwind: '$ratings' },
{ $group: {
_id: '$_id',
title: { $first: '$title' },
avgRating: { $avg: '$ratings.score' },
totalRatings: { $sum: 1 }
} },
{ $project: { _id: 1, title: 1, avgRating: { $round: ['$avgRating', 2] },
totalRatings: 1 } }
]).toArray());
// 2) Retrieve the top 3 highest-rated books (by average rating)
print('--- Top 3 highest-rated books ---');
printjson(db.Books.aggregate([

{ $unwind: '$ratings' },
{ $group: { _id: '$_id', title: { $first: '$title' }, avgRating: { $avg:
'$ratings.score' } } },
{ $sort: { avgRating: -1 } },
{ $limit: 3 },
{ $project: { _id: 1, title: 1, avgRating: { $round: ['$avgRating', 2] } } }
]).toArray());
// 3) Count the number of books published per genre
print('--- Number of books per genre ---');
printjson(db.Books.aggregate([
{ $group: { _id: '$genre', count: { $sum: 1 } } },
{ $project: { genre: '$_id', count: 1, _id: 0 } },
{ $sort: { count: -1 } }
]).toArray());
// 4) Find authors who have more than 2 books published
print('--- Authors with more than 2 books ---');
printjson(db.Books.aggregate([
{ $group: { _id: '$authorId', booksCount: { $sum: 1 } } },
{ $match: { booksCount: { $gt: 2 } } },
{ $lookup: {
from: 'Authors',
localField: '_id',
foreignField: '_id',
as: 'authorInfo'
} },
{ $unwind: '$authorInfo' },
{ $project: { authorId: '$_id', name: '$authorInfo.name', booksCount: 1, _id:
0 } }
]).toArray());
// 5) Display the total reward points (sum of all ratings) received by each user author
print('--- Total reward points per author (sum of all ratings) ---');
printjson(db.Books.aggregate([
{ $unwind: '$ratings' },
{ $group: { _id: '$authorId', totalRewardPoints: { $sum:
'$ratings.score' } } },
{ $lookup: { from: 'Authors', localField: '_id', foreignField: '_id', as:
'authorInfo' } },
{ $unwind: '$authorInfo' },
{ $project: { authorId: '$_id', authorName: '$authorInfo.name',
totalRewardPoints: 1, _id: 0 } },
{ $sort: { totalRewardPoints: -1 } }
]).toArray());
// End of file
