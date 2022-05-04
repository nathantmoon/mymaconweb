if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready(); 
}

function ready() {
    // get buttons and add event listeners
    var new_btn = document.getElementById("create-new-btn");
    var upload_btn = document.getElementById("upload-btn");

    // get form elements
    var form_new = document.getElementById("input-new");
    var form_upload = document.getElementById("input-upload");

    // add event listeners
    new_btn.addEventListener("click", () => {toggleInputFields("create-new-btn")});
    upload_btn.addEventListener("click", () => {toggleInputFields("upload-btn")}); 
    form_new.addEventListener("submit", newSubmitHandler);
    form_upload.addEventListener("submit", uploadSubmitHandler); 
}

// toggle the form fields that are displayed on the page
function toggleInputFields(btnId) {
    // get input fields
    var field1 = document.getElementById("input-new"); 
    var field2 = document.getElementById("input-upload"); 

    // toggle the display values
    if (btnId == "create-new-btn") {
        // change display types
        field1.style.display = "block"; //new
        field2.style.display = "none"; //upload

    }
    if (btnId == "upload-btn") {
        field1.style.display = "none"; //new-input
        field2.style.display = "block"; //upload-input
    }
}


// handle the new user event - prevent default submit function and 
// create new student object
function newSubmitHandler(event) {
    event.preventDefault(); 

    // create new student object with
    // get name from input field
    var name = document.getElementById("name-input").value; 
    var formattedName = name[0].toUpperCase() + name.slice(1);
    
    // create student object
    var newStudent = new Object(); 
    newStudent.name = formattedName; 
    newStudent.courses = [];

        newStudent.trackers = [
            {
                "title": "effComm",
                "numComplete": 0, 
                "numTotal": 3
            }, 
            {
                "title": "pillars",
                "numComplete": 0, 
                "numTotal": 6
            },
            {
                "title": "pillars-second",
                "numComplete": 0, 
                "numTotal": 5
            },
            {
                "title": "cross-area",
                "numComplete": 0, 
                "numTotal": 4
            },
            {
                "title": "wellness",
                "numComplete": 0, 
                "numTotal": 2
            },
            {
                "title": "overall",
                "numComplete": 0, 
                "numTotal": 20
            }
        ];
    
    // place student object in session storage
    sessionStorage.setItem('student', JSON.stringify(newStudent)); 
    
    // direct the page to dashboard
    window.location.href = "./dash.html"; 
}

// handle upload submit event - prevent default and read in supplied saved courselog data
function uploadSubmitHandler(event) {
    
    event.preventDefault(); 
    const input = document.querySelector('input[type="file"]');

    const reader = new FileReader();

    // read contents 
    if (input.files.length > 0) {
        reader.onload = function() {
            console.log(reader.result);
            const studentData = reader.result;
            // set result as student object
            sessionStorage.setItem('student', studentData); 

            window.location.href = "./dash.html"; 
        }
        reader.readAsText(input.files[0]);
    }
}