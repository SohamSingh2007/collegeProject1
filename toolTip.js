const dropdown = document.querySelector(".menuDropdown");
const menuBtn = document.querySelector(".menu");

show = function show() {
    dropdown.classList.toggle("active");
}

document.addEventListener("click", (event) => {
    if (dropdown.classList.contains("active") && !dropdown.contains(event.target) && !menuBtn.contains(event.target)) {
        dropdown.classList.remove("active");
    }
});