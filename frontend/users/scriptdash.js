    import * as display from "../display.js";

    const sideMenu = document.querySelector('aside');
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const darkMode = document.querySelector('.dark-mode');

    document.addEventListener("DOMContentLoaded", function() {
        const sidebarItems = document.querySelectorAll(".sidebar-item");
        const mainIframe = document.getElementById("mainIframe");
        display.populateUserProfile()

        sidebarItems.forEach(item => {
            item.addEventListener("click", function(event) {
                event.preventDefault();

                sidebarItems.forEach(i => i.classList.remove("active"));
                this.classList.add("active");

                const targetPage = this.getAttribute("data-target");
                if (targetPage) {
                    mainIframe.src = targetPage;
                }
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


