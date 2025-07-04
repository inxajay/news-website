const apiKey = "49c2b97a550159af5f80734b5ffa5bd8"; // your Mediastack key
const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loader = document.getElementById("loader");
const categories = document.querySelectorAll(".category");

// Default load
window.addEventListener("load", () => {
  fetchNews("india");
});

// Search
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchNews(query);
});

// Category click
categories.forEach((btn) => {
  btn.addEventListener("click", () => {
    fetchNews(btn.textContent.trim());
  });
});

// ✅ Fetch news using CORS proxy
async function fetchNews(query = "latest") {
  loader.style.display = "block";
  newsContainer.innerHTML = "";

  const base = `http://api.mediastack.com/v1/news?access_key=${apiKey}&languages=en&keywords=${encodeURIComponent(query)}&limit=12`;
  const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(base)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    loader.style.display = "none";

    if (!data.data || data.data.length === 0) {
      newsContainer.innerHTML = "<p>No news found.</p>";
      return;
    }

    data.data.forEach((article) => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <img src="${article.image || 'https://via.placeholder.com/300x180?text=No+Image'}" />
        <div class="content">
          <h3>${article.title}</h3>
          <p>${article.description || 'No description available.'}</p>
          <a href="${article.url}" target="_blank">Read More</a>
        </div>
      `;
      newsContainer.appendChild(card);
    });
  } catch (err) {
    loader.style.display = "none";
    newsContainer.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    console.error("Fetch error:", err);
  }
}
