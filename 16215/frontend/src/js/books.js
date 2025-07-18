// Make sure config.js is loaded before this script in HTML
const booksList = document.getElementById('booksList');
const booksError = document.getElementById('booksError');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const token = localStorage.getItem('token');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const feedbackForm = document.getElementById('feedbackForm');
const feedbackInput = document.getElementById('feedbackInput');
const feedbackMessage = document.getElementById('feedbackMessage');

async function fetchBooks(query = '') {
  booksList.innerHTML = '<div>Loading books...</div>';
  booksError.textContent = '';
  let url = `${API_BASE_URL}/books?`;
  if (query) {
    url += `search=${encodeURIComponent(query)}&`;
  }
  if (categoryFilter && categoryFilter.selectedOptions.length > 0 && Array.from(categoryFilter.selectedOptions).some(opt => opt.value)) {
    const selectedCategories = Array.from(categoryFilter.selectedOptions).map(opt => opt.value).filter(Boolean);
    if (selectedCategories.length > 0) {
      url += `category=${encodeURIComponent(selectedCategories.join(','))}&`;
    }
  }
  url = url.replace(/&$/, '');
  try {
    const res = await fetch(url);
    let books = await res.json();
    if (!Array.isArray(books)) {
      booksList.innerHTML = '';
      booksError.textContent = books.message || 'Failed to load books.';
      return;
    }
    // Populate category filter options
    if (categoryFilter) {
      const categoryMap = {};
      books.forEach(b => {
        if (b.category) {
          const key = b.category.trim().toLowerCase();
          if (!categoryMap[key]) categoryMap[key] = b.category.trim();
        }
      });
      const uniqueCategories = Object.values(categoryMap).sort((a, b) => a.localeCompare(b));
      categoryFilter.innerHTML = uniqueCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
      categoryFilter.onchange = null;
    }
    // Sort books
    if (sortFilter && sortFilter.value) {
      if (sortFilter.value === 'title') books.sort((a, b) => a.title.localeCompare(b.title));
      if (sortFilter.value === 'author') books.sort((a, b) => a.author.localeCompare(b.author));
      if (sortFilter.value === 'year') books.sort((a, b) => (b.publishedYear || 0) - (a.publishedYear || 0));
      if (sortFilter.value === 'available') books.sort((a, b) => (b.availableCopies || 0) - (a.availableCopies || 0));
    }
    if (books.length === 0) {
      booksList.innerHTML = '<div>No books found.</div>';
      return;
    }
    booksList.innerHTML = books.map(book => `
      <div class="book-card">
        <div class="book-cover">
          <img src="${book.coverUrl || 'https://via.placeholder.com/120x180?text=Book'}" alt="${book.title} cover">
        </div>
        <div class="book-info">
          <div class="book-title">${book.title}</div>
          <div class="book-author">by ${book.author}</div>
          <div class="book-actions">
            <button class="view-details-btn" onclick='viewBookDetails(${JSON.stringify(book)})'>View Details</button>
            ${token && book.availableCopies > 0 ? `<button class="request-btn" onclick="requestBook('${book._id}')">Request Book</button>` : ''}
            ${token && book.availableCopies === 0 ? `<button class="reserve-btn" onclick="reserveBook('${book._id}')">Reserve</button>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    booksList.innerHTML = '';
    booksError.textContent = 'Network error. Please try again.';
  }
}

searchForm.addEventListener('submit', function(e) {
  e.preventDefault();
  fetchBooks(searchInput.value.trim());
});

if (sortFilter) {
  sortFilter.addEventListener('change', function() {
    fetchBooks(searchInput.value.trim());
  });
}
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', function() {
    searchInput.value = '';
    if (categoryFilter) Array.from(categoryFilter.options).forEach(opt => opt.selected = false);
    if (sortFilter) sortFilter.value = '';
    fetchBooks();
  });
}

// Initial load
fetchBooks();

window.requestBook = async function(bookId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to request a book.');
    window.location.href = 'login.html';
    return;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/borrow/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ bookId })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || 'Could not request book.');
      return;
    }
    alert('Book request sent successfully!');
  } catch (err) {
    alert('Network error. Please try again.');
  }
}

window.reserveBook = async function(bookId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to reserve a book.');
    window.location.href = 'login.html';
    return;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/borrow/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ bookId })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || 'Could not reserve book.');
      return;
    }
    alert(data.message || 'Reservation successful!');
  } catch (err) {
    alert('Network error. Please try again.');
  }
}

// Add modal HTML to the page if not present
if (!document.getElementById('bookDetailsModal')) {
  const modal = document.createElement('div');
  modal.id = 'bookDetailsModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" id="closeModalBtn">&times;</span>
      <div id="modalBookContent"></div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('closeModalBtn').onclick = function() {
    modal.style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

window.viewBookDetails = function(book) {
  const modal = document.getElementById('bookDetailsModal');
  const content = document.getElementById('modalBookContent');
  const token = localStorage.getItem('token');
  // Show more details and reservation/request status
  let statusMsg = '';
  if (book.availableCopies === 0) {
    statusMsg = '<span style="color:#d32f2f;font-weight:600;">Not Available</span>';
  } else if (book.availableCopies > 0) {
    statusMsg = '<span style="color:#388e3c;font-weight:600;">Available</span>';
  }
  content.innerHTML = `
    <div class="modal-book-details">
      <div class="modal-book-cover">
        <img src="${book.coverUrl || 'https://via.placeholder.com/120x180?text=Book'}" alt="${book.title} cover">
      </div>
      <div class="modal-book-info">
        <h2>${book.title}</h2>
        <h4>by ${book.author}</h4>
        <p><strong>Category:</strong> ${book.category || 'N/A'}</p>
        <p><strong>Year:</strong> ${book.publishedYear || 'N/A'}</p>
        <p><strong>ISBN:</strong> ${book.isbn || 'N/A'}</p>
        <p><strong>Location:</strong> ${book.location || 'N/A'}</p>
        <p><strong>Available:</strong> ${book.availableCopies || 0} / ${book.totalCopies || 0} ${statusMsg}</p>
        <p><strong>Description:</strong><br>${book.description || 'No description.'}</p>
        ${token && book.availableCopies > 0 ? `<button class='request-btn' onclick="requestBook('${book._id}')">Request Book</button>` : ''}
        ${token && book.availableCopies === 0 ? `<button class='reserve-btn' onclick="reserveBook('${book._id}')">Reserve</button>` : ''}
      </div>
    </div>
  `;
  modal.style.display = 'block';
};

if (feedbackForm) {
  feedbackForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    feedbackMessage.textContent = '';
    feedbackMessage.classList.remove('error-message');
    const feedback = feedbackInput.value.trim();
    const name = document.getElementById('feedbackName')?.value.trim();
    const email = document.getElementById('feedbackEmail')?.value.trim();
    const type = document.getElementById('feedbackType')?.value;
    if (!feedback) {
      feedbackMessage.textContent = 'Please enter your feedback or suggestion.';
      feedbackMessage.classList.add('error-message', 'animated-message');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, name, email, type })
      });
      const data = await res.json();
      if (!res.ok) {
        feedbackMessage.textContent = data.message || 'Failed to submit feedback.';
        feedbackMessage.classList.add('error-message', 'animated-message');
        return;
      }
      feedbackMessage.textContent = '✅ Thank you for your feedback!';
      feedbackMessage.classList.remove('error-message');
      feedbackMessage.classList.add('animated-message');
      feedbackForm.reset();
      setTimeout(() => { feedbackMessage.textContent = ''; }, 3000);
    } catch (err) {
      feedbackMessage.textContent = 'Network error. Please try again.';
      feedbackMessage.classList.add('error-message', 'animated-message');
    }
  });
}

// Example: Show payment button for pending requests
function renderBookRequests(requests) {
  const container = document.getElementById('bookRequestsContainer');
  container.innerHTML = '';
  requests.forEach(req => {
    const div = document.createElement('div');
    div.className = 'book-request';
    div.innerHTML = `
      <div><strong>Book:</strong> ${req.book.title}</div>
      <div><strong>Status:</strong> ${req.status}</div>
      <div><strong>Payment:</strong> ${req.paymentStatus === 'paid' ? 'Paid' : 'Pending'}</div>
      <div class="request-actions"></div>
      <div class="request-message"></div>
    `;
    if (req.status === 'pending' && req.paymentStatus !== 'paid') {
      const payBtn = document.createElement('button');
      payBtn.textContent = 'Pay for Request';
      payBtn.className = 'btn btn-pay';
      payBtn.onclick = async function() {
        payBtn.disabled = true;
        const res = await fetch(`${API_BASE_URL}/borrow/pay-request/${req._id}`, {
          method: 'PUT',
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        });
        const data = await res.json();
        const msgDiv = div.querySelector('.request-message');
        if (res.ok) {
          msgDiv.textContent = 'Payment successful! Waiting for admin approval.';
          payBtn.remove();
        } else {
          msgDiv.textContent = data.message || 'Payment failed.';
          payBtn.disabled = false;
        }
      };
      div.querySelector('.request-actions').appendChild(payBtn);
    }
    container.appendChild(div);
  });
} 