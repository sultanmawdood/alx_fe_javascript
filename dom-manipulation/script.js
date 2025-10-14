let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { id: 2, text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { id: 3, text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const NOTIFICATION_DIV = document.createElement("div");
NOTIFICATION_DIV.id = "notification";
NOTIFICATION_DIV.style.position = "fixed";
NOTIFICATION_DIV.style.bottom = "20px";
NOTIFICATION_DIV.style.right = "20px";
NOTIFICATION_DIV.style.background = "#333";
NOTIFICATION_DIV.style.color = "white";
NOTIFICATION_DIV.style.padding = "10px 15px";
NOTIFICATION_DIV.style.borderRadius = "8px";
NOTIFICATION_DIV.style.display = "none";
document.body.appendChild(NOTIFICATION_DIV);

function showNotification(message) {
  NOTIFICATION_DIV.textContent = message;
  NOTIFICATION_DIV.style.display = "block";
  setTimeout(() => (NOTIFICATION_DIV.style.display = "none"), 4000);
}

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const { text, category } = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${text}"</p><small>Category: ${category}</small>`;
}

function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category!");
    return;
  }

  const newQuote = { id: Date.now(), text: newText, category: newCategory };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  showRandomQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  showNotification("New quote added locally ✅");
  syncQuoteToServer(newQuote);
}

async function syncQuoteToServer(quote) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      showNotification("Quote synced successfully with server!");
    }
  } catch (error) {
    showNotification("⚠️ Failed to sync with server");
  }
}
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const serverQuotes = data.slice(0, 3).map((item, index) => ({
      id: index + 1,
      text: item.title,
      category: "ServerSync",
    }));

    handleConflict(serverQuotes);
  } catch (error) {
    console.error("Server fetch failed:", error);
  }
}

function handleConflict(serverQuotes) {
  const localIDs = quotes.map((q) => q.id);
  let conflicts = [];

  serverQuotes.forEach((sQuote) => {
    const index = localIDs.indexOf(sQuote.id);
    if (index !== -1) {
      quotes[index] = sQuote;
      conflicts.push(sQuote.text);
    } else {
      quotes.push(sQuote);
    }
  });

  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  showRandomQuote();

  if (conflicts.length > 0) {
    showNotification(`⚡ Conflicts resolved using server data (${conflicts.length})`);
  } else {
    showNotification("✅ Data synced with server");
  }
}

async function syncQuotes() {
  showNotification("🔄 Syncing with server...");
  await fetchQuotesFromServer();
  showNotification("✅ Sync complete!");
}

function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map((q) => q.category))];
  filter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selectedCategory) option.selected = true;
    filter.appendChild(option);
  });
}

function filterQuotes() {
  const filter = document.getElementById("categoryFilter");
  selectedCategory = filter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
populateCategories();
showRandomQuote();

setInterval(syncQuotes, 10000);
