// Array of quotes (each with text and category)
const quotes = [
  { text: "The future belongs to those who believe in their dreams.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "Happiness depends upon ourselves.", category: "Happiness" },
];

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>Category: ${randomQuote.category}</small>
  `;
}

// Add click event to button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Function to create form dynamically (DOM Manipulation)
function createAddQuoteForm() {
  const formDiv = document.createElement("div");
  formDiv.style.marginTop = "20px";

  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";
  inputText.id = "newQuoteText";
  inputText.style.marginRight = "10px";

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";
  inputCategory.id = "newQuoteCategory";
  inputCategory.style.marginRight = "10px";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";

  // Event for adding quote
  addBtn.addEventListener("click", () => {
    const text = inputText.value.trim();
    const category = inputCategory.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      alert("✅ New quote added!");
      inputText.value = "";
      inputCategory.value = "";
    } else {
      alert("⚠️ Please enter both text and category!");
    }
  });

  // Append elements to form
  formDiv.appendChild(inputText);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(addBtn);

  // Append form to the body
  document.body.appendChild(formDiv);
}

// Initialize form when page loads
createAddQuoteForm();
