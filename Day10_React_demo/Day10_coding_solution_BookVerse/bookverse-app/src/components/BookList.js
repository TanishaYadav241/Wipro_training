// BookList.js
// Parent component that holds all books and handles search + view toggle

import React, { useState } from "react";
import BookCard from "./BookCard";

function BookList() {
  // Sample books data
  const books = [
    { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 499 },
    { id: 2, title: "Atomic Habits", author: "James Clear", price: 599 },
    { id: 3, title: "Ikigai", author: "Héctor García", price: 399 },
    { id: 4, title: "The Power of Now", author: "Eckhart Tolle", price: 699 },
  ];

  // State for search box and view mode
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("Grid");

  // Filter books according to search text
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ textAlign: "center" }}>
      <h2> Featured Books</h2>

      {/* Controlled input (search bar) */}
      <input
        type="text"
        placeholder="Search by title or author..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Buttons to switch view */}
      <div style={{ margin: "10px" }}>
        <button onClick={() => setView("Grid")}>Grid View</button>
        <button onClick={() => setView("List")}>List View</button>
      </div>

      {/* Show BookCards */}
      <div
        style={{
          display: view === "Grid" ? "flex" : "block",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {filteredBooks.map((book) => (
          <BookCard key={book.id} {...book} view={view} />
        ))}
      </div>
    </div>
  );
}

export default BookList;
