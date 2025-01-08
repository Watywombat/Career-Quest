const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const darkMode = document.querySelector('.dark-mode');

document.addEventListener("DOMContentLoaded", function() {
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const mainIframe = document.getElementById("mainIframe");

    sidebarItems.forEach(item => {
        item.addEventListener("click", function(event) {
            event.preventDefault();

            // Remove the active class from all sidebar items
            sidebarItems.forEach(i => i.classList.remove("active"));

            // Add the active class to the clicked item
            this.classList.add("active");

            // Get the page URL from the data-page attribute and update the iframe source
            const pageUrl = this.getAttribute("data-page");
            mainIframe.src = pageUrl;
        });
    });
});

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
});

document.addEventListener("DOMContentLoaded", function() {
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const mainIframe = document.getElementById("mainIframe");

    sidebarItems.forEach(item => {
        item.addEventListener("click", function(event) {
            event.preventDefault();
            sidebarItems.forEach(i => i.classList.remove("active")); // Remove the active class from all items
            this.classList.add("active"); // Add the active class to the clicked item

            const targetPage = this.getAttribute("data-target"); // Get the target page from data-target attribute
            if (targetPage) {
                mainIframe.src = targetPage; // Change the iframe's src to the target page
            }
        });
    });
});



