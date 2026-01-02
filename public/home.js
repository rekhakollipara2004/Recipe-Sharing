// Dropdown functionality for the profile menu
document.addEventListener("DOMContentLoaded", function() {
  const profileLink = document.querySelector(".dropdown");
  const dropdownMenu = document.querySelector(".dropdown-content");

  // Toggle dropdown visibility on click
  profileLink.addEventListener("click", function(event) {
    event.stopPropagation(); // Prevents click from closing the dropdown immediately
    dropdownMenu.classList.toggle("show");
  });

  // Close the dropdown if the user clicks outside of it
  document.addEventListener("click", function(event) {
    if (!profileLink.contains(event.target)) {
      dropdownMenu.classList.remove("show");
    }
  });
});
