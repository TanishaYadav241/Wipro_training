// BookCard.js
// Child component to show one book’s details

import React from "react";

function BookCard({ title, author, price, view }) {
  // Style changes depending on view (Grid or List)
  const cardStyle = {
    border: "1px solid gray",
    borderRadius: "8px",
    padding: "10px",
    margin: "10px",
    width: view === "Grid" ? "180px" : "100%",
  };

  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <p>Author: {author}</p>
      <p>Price: ₹{price}</p>
    </div>
  );
}

export default BookCard;
