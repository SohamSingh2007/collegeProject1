// Load content dynamically
async function loadPage(page) {
  try {
    const response = await fetch(`pages/${page}.html`);
    const data = await response.text();
    document.getElementById("content").innerHTML = data;

    // Update active link
    document.querySelectorAll(".sidebar a").forEach(link => {
      link.classList.remove("active");
      if(link.dataset.route === page) {
        link.classList.add("active");
      }
    });
  } catch (error) {
    document.getElementById("content").innerHTML = "<h2>Page not found</h2>";
  }
}

// Handle route change
function handleRoute() {
  const hash = window.location.hash.substring(1) || "1st"; // default = 1st.html
  loadPage(hash);
}

// Listen for hash change
window.addEventListener("hashchange", handleRoute);

// Load default page on startup
window.addEventListener("load", handleRoute);
