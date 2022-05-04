
// extract student data from session storage
const studentData = JSON.parse(sessionStorage.getItem('student')); 

// extract individual data catagories from student object
const studentName = studentData.name; 
const studentCourses = studentData.courses; 
const studentTrackers = studentData.trackers; 

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready(); 
}

function ready() {
    // end session event listeners
    var end_session = document.getElementById("end-btn");
    end_session.addEventListener("click", endSession); 

    // toggle menu size
    var menu_btn = document.getElementById("menu-btn");
    menuToggle(menu_btn); 

    // perform a maximum matching on student courses
    if (studentCourses.length > 0) {
        const matches = maxCourseMatch(studentCourses); 
        updateTrackers(matches); 
        updateProgressBars(); 
        placeMatches(matches); 
        placeElectives(matches);
    }

    // place username in title
    document.getElementById("username").innerText = studentName; 

    // add links to dashboard welcome buttons
    document.getElementById("dash-add-btn").addEventListener("click", () => {
        window.location.href = "./search.html"; 
    })
    document.getElementById("dash-edit-btn").addEventListener("click", () => {
        window.location.href = "./courselog.html"; 
    })

}

// place matches identified in match array in the checklist
function placeMatches(matchArray) {

    // loop through match array to place all matches in checklist
    for (var i = 0; i < matchArray.length; i++) {
        if (matchArray[i] !== -1) {
            // location to place match
            var locationId; 
            
            // determine location based on index
            switch(i) {
                case 0: 
                    locationId = "wc-course-list";
                    break;
                case 1:
                    locationId = "cc-course-list";
                    break;
                case 5: 
                    locationId = "ae-course-list";
                    break;
                case 6: 
                    locationId = "cl-course-list";
                    break;
                case 7: 
                    locationId = "ge-course-list";
                    break;
                case 8:
                    locationId = "hc-course-list";
                    break;  
                case 9:
                    locationId = "qs-course-list";
                    break;  
                case 10:
                    locationId = "sp-course-list";
                    break;  
                case 11:
                    locationId = "wa-course-list";
                    break; 
                case 12:
                    locationId = "sa-course-list";
                    break;  
                case 13:
                    locationId = "ss-course-list";
                    break;  
                case 14:
                    locationId = "hu-course-list";
                    break;  
                case 15:
                    locationId = "ns-course-list";
                    break;  
                case 16:
                    locationId = "el-course-list";
                    break;  
                case 17:
                    locationId = "nw-course-list";
                    break;  
                case 18:
                    locationId = "di-course-list";
                    break;  
                case 19:
                    locationId = "cs-course-list";
                    break;  
            }

            // create content string 
            var contentString = ""; 

            console.log(i, studentCourses[matchArray[i]]);

            contentString += `
            <div class="checklist-row course-row">
                <span class="status-icon"><i class="far fa-check-circle"></i></span>
                <span class="course-code">${studentCourses[matchArray[i]].code}</span>
                <span class="course-name">${studentCourses[matchArray[i]].name}</span>
            </div>
            `;

            // place inside inner html
            document.getElementById(locationId).innerHTML = contentString; 
        
        }
    }
}

// place elective courses in checklist
function placeElectives(matchArray) {
    // holds electives html
    var contentString = ""; 

    // loop through student courses to find unmatched courses
    for (var i = 0; i < studentCourses.length; i++) {
        console.log("here")
        if (!matchArray.includes(i)) {
            console.log(i); 
            contentString += `
            <div class="checklist-row course-row">
                <span class="status-icon"><i class="far fa-check-circle"></i></span>
                <span class="course-code">${studentCourses[i].code}</span>
                <span class="course-name">${studentCourses[i].name}</span>
            </div>
            `;
        }
    }

    // add back an empty elective line if no electives were found
    if (contentString == "") {
        contentString = `
        <div class="checklist-row empty-row">
            <span class="status-icon"><i class="far fa-times-circle"></i></span>
            <span class="underline-empty"></span>
        </div>
        `
    }

    // add to electives courselist
    document.getElementById("elective-course-list").innerHTML = contentString; 
}

//update the progress tracker values according to the match
function updateTrackers (matchArray) {
    // variables to hold num completed for each tracker type
    var numEffComm = 0; 
    var numPillars = 0; 
    var numPillarsSecond = 0; 
    var numCrossArea = 0; 
    var numWellness = 0; 
    var numOverall = 0; 

    // count fulfilled requirements
    for (var i = 0; i < matchArray.length; i++) {
        // only count matches (indices not equal to -1)
        if (matchArray[i] !== -1) {
            if (i == 0 || i == 1) {
                numEffComm++; 
            }
            else if (i == 2) {
                numEffComm += 2;
            }
            else if ((matchArray[2] == -1) && (i == 3 || i == 4)) {
                numEffComm++; 
            }
            else if (5 <= i && i <= 10) {
                numPillars++; 
            }
            else if (11 <= i && i <= 15) {
                numPillarsSecond++; 
            }
            else if (16 <= i && i <= 19) {
                numCrossArea++; 
            }
            else if (20 <= i && i <= 21) {
                numWellness++; 
            }
        }
    }

    // determine overall tracker counts
    numOverall = numEffComm + numPillars + numPillarsSecond + numCrossArea + numWellness; 

    // place updated counts in trackers
    studentTrackers.forEach((tracker) => {
        if (tracker.title == 'effComm') {
            tracker.numComplete = numEffComm;
        } else if (tracker.title == 'pillars') {
            tracker.numComplete = numPillars;
        } else if (tracker.title == 'pillars-second') {
            tracker.numComplete = numPillarsSecond;
        } else if (tracker.title == 'cross-area') {
            tracker.numComplete = numCrossArea;
        } else if (tracker.title == 'overall') {
            tracker.numComplete = numOverall;
        }
    })
}

// update percentages and size of progress bars 
function updateProgressBars() {
    // get percentage from trackers
    studentTrackers.forEach( (tracker) => {
        var percent = Math.round((tracker.numComplete/tracker.numTotal) * 100); 

        // place percentage in document
        var percentLabel;
        var progressBar; 
        if (tracker.title == "effComm") {
            percentLabel = document.getElementById("effComm-percent");
            progressBar = document.getElementById("progress-bar-effComm");
        }
        else if (tracker.title == "pillars") {
            percentLabel = document.getElementById("pillars-percent");
            progressBar = document.getElementById("progress-bar-pillars");
        }
        else if (tracker.title == "pillars-second") {
            percentLabel = document.getElementById("pillarsSecond-percent");
            progressBar = document.getElementById("progress-bar-pillarsSecond");
        }
        else if (tracker.title == "cross-area") {
            percentLabel = document.getElementById("cross-area-percent");
            progressBar = document.getElementById("progress-bar-crossArea");
        }
        else if (tracker.title == "wellness") {
            percentLabel = document.getElementById("wellness-percent");
            progressBar = document.getElementById("progress-bar-wellness");
        }
        else if (tracker.title == "overall") {
            percentLabel = document.getElementById("overall-percent");
            progressBar = document.getElementById("progress-bar-overall");
        }

        // write percent in text
        percentLabel.innerHTML = percent + "%";

        // progress bar percent -- should always show a bit of progress bar for visual aide
        if (percent == 0) {
            percent = 5; 
        }
        // update progress bar length 
        progressBar.style.width = percent.toString() + "%"; 
    })
}