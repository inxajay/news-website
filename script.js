const apiKey = "feeca79a36f34b2988d15705cd1f97b5";
const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loader = document.getElementById("loader");
const categories = document.querySelectorAll(".category");

// 🔁 Default load: latest news
window.addEventListener("load", () => {
  fetchNews("latest"); // 👈 Now using 'latest' keyword instead of top-headlines
});

// 🔍 Search button click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchNews(query);
  }
});

// 🔘 Category buttons click
categories.forEach((btn) => {
  btn.addEventListener("click", () => {
    const topic = btn.textContent.trim();
    fetchNews(topic); // 🔍 Search by topic
  });
});

// 📡 Fetch news function
async function fetchNews(query = "latest") {
  loader.style.display = "block";
  newsContainer.innerHTML = "";

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}&pageSize=12&sortBy=publishedAt`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    loader.style.display = "none";

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = "<p>No news found.</p>";
      return;
    }

    data.articles.forEach((article) => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <img src="${article.urlToImage || 'https://via.placeholder.com/300x180'}" alt="News Image"/>
        <div class="content">
          <h3>${article.title}</h3>
          <p>${article.description || 'No description available.'}</p>
          <a href="${article.url}" target="_blank">Read More</a>
        </div>
      `;
      newsContainer.appendChild(card);
    });
  } catch (error) {
    loader.style.display = "none";
    newsContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    console.error("Fetch error:", error);
  }
}
