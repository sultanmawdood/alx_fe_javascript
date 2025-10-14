let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";

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

  quotes.push({ text: newText, category: newCategory });
  localStorage.setItem("quotes", JSON.stringify(quotes));

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  populateCategories(); 
  showRandomQuote();

  alert("New quote added successfully!");
}


function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  
  filter.innerHTML = `<option value="all">All Categories</option>`;


  categories.forEach(cat => {
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
