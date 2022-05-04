// gather student data from session storage
var studentData = JSON.parse(sessionStorage.getItem('student'));
// extract student courselist from student
var studentCourses = studentData.courses;

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready(); 
}

function ready() {
    // end session event listeners
    var end_session = document.getElementById("end-btn");
    end_session.addEventListener("click", endSession); 
    
    // menu toggle function 
    var menu_btn = document.getElementById("menu-btn");
    menuToggle(menu_btn); 

    // display all student courses on load
    displayCourses(studentCourses);
    // addCheckboxListeners for initial course list
    addCheckboxListeners(); 

    // collect button elements
    const discard_btn = document.getElementById("discard-btn");
    const delete_btn = document.getElementById("delete-btn"); 

    // add event listeners
    discard_btn.addEventListener("click", uncheckAll); 
    delete_btn.addEventListener("click", removeCourses)

}

// uncheck all checkboxes on the page
function uncheckAll() {
    // gather all checkbox elements
    var allInputs = document.querySelectorAll('input[type=checkbox]'); 
    
    // loop through all checkboxes, unchecking each
    for (var i = 0; i < allInputs.length; i++) {
        allInputs[i].checked = false; 
    }

    updateCheckCount(); 
}

// add a listener for all checkboxes
function addCheckboxListeners() { 
    var allCheckboxes = document.querySelectorAll('input[type=checkbox]'); 
    allCheckboxes.forEach( (element) => {
        element.addEventListener('change', updateCheckCount); 
    })
}

// add web break to split course code nicely at smaller window sizes
function addCodeBreak(code) {
    // add a web break if the course code has a slash in it -- cross-listed courses
    var slashIndex = code.indexOf('/'); 
    if (slashIndex != -1) {
        return code.slice(0,slashIndex + 1) + "<wbr>" + code.slice(slashIndex+1);
    } else {
        return code; 
    }
}

// display student's courses in the Courselog
function displayCourses(courses) {
    // get results box
    var resultsBox = document.getElementsByClassName("results-box")[0]; 

    // get rid of any prior content in the results box
    resultsBox.innerHTML = ""; 

    // gather html to add
    var resultRowArray = generateRowsHTML(courses); 
    resultRowArray.forEach( (row) => {
        resultsBox.append(row); 
    })
}

// create html elements for each course row in courselog
function generateRowsHTML(courseArray) {
    var resultsContentArray = []; 
    // display no results message if no courses exist
    if (courseArray.length == 0) {
        var noResultsRow = document.createElement("div"); 
        var rowContent = `
            <div class="result-row">
                No courses to display. 
            </div>
        `;
        noResultsRow.innerHTML = rowContent;
        resultsContentArray.push(noResultsRow); 
    } else {
        // otherwise display each course
        courseArray.forEach(course => {
            // define html element and content
            var resultRow = document.createElement("div"); 
            var rowContent = `
            <div class="results-row"> 
                <div class="results-select results-column">
                    <input type="checkbox" name="select-course" id="select-course">
                </div>
                <div class="results-code results-column">${addCodeBreak(course.code)}</div>
                <div class="results-name results-column">${course.name}</div>
                <div class="results-designations results-column">${course.designations}</div>
            </div>
            `;

            // add the course content row to the total results html 
            resultRow.innerHTML = rowContent; 
            resultsContentArray.push(resultRow);
        })
    }

    //return results
    return resultsContentArray; 
}

// updates the displayed counter for checked checkboxes in the add course panel 
function updateCheckCount() {
    const numSelectSpan = document.getElementById("num-selected"); 
    const allCheckboxes = document.querySelectorAll('input[type=checkbox]'); 
    
    //count checked boxes
    var totalChecked = 0; 
    for (var i = 0; i < allCheckboxes.length; i++) {
        if (allCheckboxes[i].checked == true) {
            totalChecked++; 
        }
    }
    
    //update span text content with length of checked boxes array
    numSelectSpan.innerText = totalChecked;  
}

// remove courses that have been selected by checkboxes
function removeCourses() {
    // ask user if they really wish to delete courses
    var warningMessage = "Are you sure you wish to delete the selected courses? You cannot undo this action once it is completed."
    if (window.confirm(warningMessage)) {
        var selectedCourseCodes = collectSelectedCodes();

        // array to store courses removed from courselist
        var removedCourses = []; 

        // iterate through course catalog, removing courses that match the selected course codes
        for (var i = 0; i < studentCourses.length; i++) {
            for (var j = 0; j < selectedCourseCodes.length; j++) {
                if (selectedCourseCodes[j] == studentCourses[i].code) {
                    removedCourses.push(studentCourses[i]); 
                    studentCourses.splice(i, 1); // remove course
                }
            }
        }

        // display success message for deleted courses
        if (removedCourses.length > 0) {
            sessionStorage.setItem('student', JSON.stringify(studentData));
            displayCourses(studentCourses); 
            displayRemoveSuccessMessage(removedCourses); 
        }


        var data = JSON.parse(sessionStorage.getItem('student')); 
    }

    // collect course codes from html and return 
    function collectSelectedCodes() {
        // array to hold collected course codes
        var codes = []; 

        // capture array of all checkbox inputs
        var allCheckboxes = document.querySelectorAll('input[type=checkbox]'); 

        // loop through all checkboxes 
        for (var i = 0; i < allCheckboxes.length; i++) {
            if (allCheckboxes[i].checked == true) {
                codes.push(allCheckboxes[i].parentElement.nextElementSibling.innerText);
            }
        }
        return codes; 
    }

    // create removed courses success message to signal to user courses were successfully removed
    function displayRemoveSuccessMessage(coursesRemoved) {
        var successBox = document.getElementById("success-box"); 
        console.log(successBox);

        // remove successBox from document if it already exists
        if (successBox !== null) {
            successBox.remove(); 
        }

        // create new successBox content
        var boxContent = `
        <div id="success-box">
            <p class="success-message">
        `
        var courseContent = ""
        
        // add content of courses added to box content
        for (var i = 0; i < coursesRemoved.length; i++) {
            courseContent += `<span class="code">${coursesRemoved[i].code}</span>`;

            // add a comma if not last course
            if (i < coursesRemoved.length - 1) {
                courseContent += ", ";
            }
        }

        // add all course codes 
        boxContent += courseContent + " Successfully Removed"; 

        // complete box div
        boxContent += '</div>'

        console.log(boxContent)

        // create a successbox div and add content
        var newSuccessBox = document.createElement("div"); 
        newSuccessBox.innerHTML = boxContent; 
        console.log(boxContent, "j");

        // find div position and add success box to it
        // get parent id
        var parentEl = document.getElementById("courselog-panel-content"); 
        // find reference element to insert before
        var refEl = document.getElementById("courselog-table-header"); 
        // insert into position
        parentEl.insertBefore(newSuccessBox, refEl); 
    }
}
