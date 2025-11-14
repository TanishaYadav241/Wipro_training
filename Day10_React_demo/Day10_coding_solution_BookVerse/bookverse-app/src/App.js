// App.js
// Main file - displays the BookList component

import React from "react";
import BookList from "./components/BookList";

function App() {
  return (
    <div>
      <h1>📖 Welcome to BookVerse</h1>
      <BookList /> {/* Display list of books */}
    </div>
  );
}

export default App;
