const buttons = document.querySelectorAll(".card-btn");
const popups = document.querySelectorAll(".popup");

buttons.forEach(button => {
    button.onclick = () => {
        const popupId = button.getAttribute("data-popup");
        const popup = document.getElementById(popupId);
        popup.classList.toggle("show");
    };
});


/*
overlay.addEventListener('click', function() {
    applicationModal.style.display = 'none';
    overlay.style.display = 'none';
});
*/