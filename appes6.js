class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");
    // Create tr element
    const row = document.createElement("tr");
    // Insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;
    row.className = "item";
    list.appendChild(row);
  }
  showAlert(message, className) {
    // Create div
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    // Insert Alert
    container.insertBefore(div, form);

    // Timeout after 3s
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }
  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }
  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
  filterItems() {
    // Get form values
    const formInput = document.getElementById("filter-input").value;

    document.querySelectorAll(".item").forEach(function (book) {
      // Checks which filtering option is picked
      var bookDetail;
      if (document.getElementById("title-filter").checked) {
        bookDetail = book.firstElementChild.textContent;
      } else if (document.getElementById("author-filter").checked) {
        bookDetail = book.firstElementChild.nextElementSibling.textContent;
      } else {
        bookDetail = String(
          book.firstElementChild.nextElementSibling.nextElementSibling
            .textContent
        );
      }
      // Searches and shows matches
      if (bookDetail.indexOf(formInput) != -1) {
        book.style.display = "table-row";
      } else {
        book.style.display = "none";
      }
    });
  }
}

// Local Storage Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      const ui = new UI();

      // Add book to UI
      ui.addBookToList(book);
    });
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
// DOM Load Event
document.addEventListener("DOMContentLoaded", Store.displayBooks());

// Event Listener for add book
document.getElementById("book-form").addEventListener("submit", function (e) {
  // Get form values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  // Instantiate book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  // Validate
  if (title === "" || author === "" || isbn === "") {
    // Error alert
    ui.showAlert("Please fill in all fields", "error");
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add to Local Storage
    Store.addBook(book);

    // Show success
    ui.showAlert("Book added", "success");

    // Clear Fields
    ui.clearFields();
  }
  console.log(ui);

  e.preventDefault();
});

// Event Listener for delete
document.getElementById("book-list").addEventListener("click", function (e) {
  // Instantiate UI
  const ui = new UI();

  // Delete Book
  ui.deleteBook(e.target);

  // Remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show message
  ui.showAlert("Book Removed", "success");

  e.preventDefault();
});

// Filter on Typing
document.getElementById("filter-input").addEventListener("keyup", function (e) {
  // Instantiate UI
  const ui = new UI();
  ui.filterItems();
  e.preventDefault();
});
// Filter on option being changed
document.getElementById("title-filter").addEventListener("click", function () {
  // Instantiate UI
  const ui = new UI();
  ui.filterItems();
});
document.getElementById("author-filter").addEventListener("click", function () {
  // Instantiate UI
  const ui = new UI();
  ui.filterItems();
});
document.getElementById("isbn-filter").addEventListener("click", function () {
  // Instantiate UI
  const ui = new UI();
  ui.filterItems();
});
