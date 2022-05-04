// gather student data from session storage
var studentData = JSON.parse(sessionStorage.getItem('student'));
// extract student courselist from student data
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
    
    // toggle menu position 
    var menu_btn = document.getElementById("menu-btn");
    menuToggle(menu_btn); 

    // display all courses on load
    displaySearchResults("ALL", "ALL"); 
    // checkbox listeners for initial load
    addCheckboxListeners(); 

    // collect button elements
    const search_btn = document.getElementById("search-submit");
    const discard_btn = document.getElementById("discard-btn");
    const add_btn = document.getElementById("add-btn");

    // add event listeners 
    search_btn.addEventListener("click", searchBtnHandler); 
    search_btn.addEventListener("click", displaySearchParams);
    discard_btn.addEventListener("click", uncheckAll);
    add_btn.addEventListener('click', addCourses);
}

// perform a search and display the results
function displaySearchResults(desVal, deptVal) {
    // create array to store matched courses 
    const courseMatches = []; 

    // find matches 
    courseCatalog.courses.forEach(element => {
        var matchFound = isSearchMatch(element, desVal, deptVal); 
        if (matchFound == true) {
            courseMatches.push(element); 
        }
    });

    if (courseMatches.length > 0) {
        //console.log(formatResultRow(courseMatches[0])); 
    } else { console.log("no results")}
    console.log("done")

    var resultsBox = document.getElementsByClassName("results-box")[0];

    //get rid of any previous items in the search
    resultsBox.innerHTML = ""; 

    //gather html to add
    var resultRowArray = generateRowsHTML(courseMatches);
    resultRowArray.forEach( (row) => {
        resultsBox.append(row);
    })
}

// handler for when search button is clicked
function searchBtnHandler () {
    // get select elements
    const des_select = document.getElementById("designation-select");
    const dept_select = document.getElementById("department-select"); 

    // capture input values 
    var desSelectVal = des_select.options[des_select.selectedIndex].value;
    var deptSelectVal = dept_select.options[dept_select.selectedIndex].value; 

    //perform a search
    displaySearchResults(desSelectVal, deptSelectVal); 

    //add checkbox listeners on search results
    addCheckboxListeners(); 
}

// updates the showing results paragraph in the search result panel
function displaySearchParams() {
    // get locations to display parameters
    var desParam = document.getElementById("desParam"); 
    var deptParam = document.getElementById("deptParam"); 
    console.log(desParam);
    console.log(deptParam); 

    // get select elements
    const des_select = document.getElementById("designation-select");
    const dept_select = document.getElementById("department-select"); 

    // capture input values 
    var desSelectVal = des_select.options[des_select.selectedIndex].text;
    var deptSelectVal = dept_select.options[dept_select.selectedIndex].text; 

    // replace text in params with selected values
    desParam.innerHTML = desSelectVal; 
    deptParam.innerHTML = deptSelectVal; 
    console.log(deptSelectVal); 
}

// determines whether a course matches the search criteria
function isSearchMatch(element, reqSelectVal, deptSelectVal) {
    var isMatch = false; 

    // test for matches 
    if (deptSelectVal == element.department || deptSelectVal == "ALL") {
        // check requirement filters 
        element.designations.forEach(designation => {
            if (designation == reqSelectVal || reqSelectVal == "ALL") {
                isMatch = true; 
            }
        })
    }
    // return boolean indicating if element matched search parameters
    return isMatch; 
}

// generate the html for each course/row in the search results
function generateRowsHTML(courseArray) {
    var resultsContentArray = []; 
    // content for search with no results
    if (courseArray.length == 0) {
        var noResultsRow = document.createElement("div"); 
        var rowContent = `
            <div class="result-row">
                No Search Results.
            </div>
        `;
        noResultsRow.innerHTML = rowContent;
        resultsContentArray.push(noResultsRow); 
    } else {
        // content for search results
        courseArray.forEach(course => {
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

// add web break in course code for better display of cross-listed course codes
function addCodeBreak(code) {
    var slashIndex = code.indexOf('/'); 
    if (slashIndex != -1) {
        return code.slice(0,slashIndex + 1) + "<wbr>" + code.slice(slashIndex+1);
    } else {
        return code; 
    }
}

// add the selected courses to student courselog
function addCourses() {
    var selectedCourseCodes = collectSelectedCodes(); 
    
    // array to store classes successfully added
    var newCourses = []; 

    // iterate through course catalog, add course objects matching selected
    // course codes to the student course list
    for (var i = 0; i < courseCatalog.courses.length; i++) {
        for (var j = 0; j < selectedCourseCodes.length; j++) {
            if (selectedCourseCodes[j] == courseCatalog.courses[i].code) {
                console.log(courseCatalog.courses[i].code)
                if (!isDupeCourse(courseCatalog.courses[i], studentCourses)) {
                    studentCourses.push(courseCatalog.courses[i]);
                    newCourses.push(courseCatalog.courses[i]);
                }
            }
            else {
                console.log("courses not added")
            }
        }
    }

    // add courses to session storage and display success 
    // message if newCourses list not empty
    if (newCourses.length > 0) {
        sessionStorage.setItem('student', JSON.stringify(studentData));
        displayAddSuccessMessage(newCourses);
    }

    // uncheck boxes of added courses
    uncheckAll(); 

}

// check if course code already exists in list of student courses 
function isDupeCourse(course, courseList) {
    // boolean indicating whether course in course list
    var isDupe = false; 

    // iterate through course list to determine if given course is a dupe
    courseList.forEach((courseListItem) => {
        console.log("1: ", courseListItem);
        console.log("2 : ", course); 
        if (isEqualCourse(courseListItem, course)) {
            isDupe = true; 
        }
    })
    return isDupe; 
}

/* 
    check if course objects are equal.
    @param course: the course object to check for equality against
    @param other: the other course object to check for equality
    @return: a boolean indicating equality
*/ 
function isEqualCourse(course, otherCourse) {
    // check if course code is the same
    if (course.code == otherCourse.code) {
        // check if department is the same
        if (course.department == otherCourse.department) {
            // check each designation for equality
            var numEqual = 0;
            for (var i = 0; i < course.designations.length; i++) {
                if (course.designations[i] == otherCourse.designations[i]) {
                    numEqual++; 
                }
            }
            // return true if all designations matched
            if (numEqual == course.designations.length) {
                return true; 
            }
        }
    }
    return false; 
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

// display a success message if courses added to courselog
function displayAddSuccessMessage(coursesAdded) {
    var successBox = document.getElementById("success-box"); 
    console.log(successBox);

    // remove successBox from document if it already exists
    if (successBox !== null) {
        successBox.remove(); 
    }

    // create new successBox content
    var boxContent = '<div id="success-box">'

    // add content of courses added to box content
    coursesAdded.forEach( (course) => {
        var courseContent = `
        <p class="success-message">
            <span class="code">${course.code}</span> Successfully Added
        </p>
        `
        // add course content to successBox content
        boxContent += courseContent; 
    })

    boxContent += '</div>'

    // create a successbox div and add content
    var newSuccessBox = document.createElement("div"); 
    newSuccessBox.innerHTML = boxContent; 
    console.log(boxContent, "j");

    // find parent div and add success box to it
    var parentEl = document.getElementById("add-panel-content"); 
    parentEl.append(newSuccessBox); 

}
