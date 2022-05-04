// toggle the size of the menu
function menuToggle(menu_btn) {
    menu_btn.addEventListener('click', toggleMenu); 
    function toggleMenu() {
        document.querySelector("body").classList.toggle("active");
    }
}

// end session, allow user to save a copy of courselog
function endSession() {
    if (window.confirm("Would you like to save a copy of your Courselog?")) {
        var data = sessionStorage.getItem('student');

        var blob = new Blob([data], {type: "text/json"});

        saveAs(blob, "file.gen"); 
    }
   
    // clear session data and redirect to welcome page
    sessionStorage.clear(); 
    window.location.href = "./index.html"
}