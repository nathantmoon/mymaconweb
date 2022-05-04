/* 
    Create and array indicating a courses requirment designations.
    Value of 1 will indicate that the requirement
    can be filled while 0 indicates it cannot be filled.
    @param courseObject: the course to determine designation array for
    @return requirementArray: an array of booleans representing course designations
*/
function getDesArray(courseObject) {
    // declare and initialize designation array
    var desArray = new Array(22); 
    
    for (var i = 0; i < desArray.length; i++) {
        desArray[i] = 0; 
    }

    // fill des array based on course code 
    if (courseObject.code == "ENGL 185") {
        // set written comm index to 1
        desArray[0] = 1; 
    }

    else if (courseObject.code.indexOf("PHED") !== -1) {
        // set wellness indices to 1
        desArray[20] = 1; 
        desArray[21] = 1; 
    }

    // fill designation array based on designations 
    courseObject.designations.forEach((des) => {
        switch(des) {
            case "CC": 
                // communication in context
                desArray[1] = 1;
                break;  
            case "FL": 
                // foreign language
                // check if course was intermediate
                if (courseObject.code.indexOf("212") !== -1 || courseObject.code.indexOf("215") !== -1) {
                    desArray[2] = 1; 
                } else {
                    // course was not intermediate level
                    desArray[3] = 1; 
                    desArray[4] = 1; 
                }
                break; 
            case "AE": 
                // aesthetic expression 
                desArray[5] = 1;
                break;  
            case "CL": 
                // civic life 
                desArray[6] = 1;
                break;  
            case "GE":
                // global experiences
                desArray[7] = 1;
                break;  
            case "HC": 
                // the human condition
                desArray[8] = 1;
                break;  
            case "QS": 
                // quantitative and symbolic reasoning
                desArray[9] = 1;
                break;  
            case "SP": 
                // the scientific process
                desArray[10] = 1;
                break;  
            case "WA": 
                // writing attentive
                desArray[11] = 1;
                break;  
            case "SA": 
                // speaking attentive
                desArray[12] = 1;
                break;  
            case "SS": 
                // social science
                desArray[13] = 1;
                break;  
            case "HU": 
                // humanities
                desArray[14] = 1;
                break;  
            case "NS": 
                // natural science
                desArray[15] = 1;
                break;  
            case "EL": 
                // experiential learning
                desArray[16] = 1;
                break;  
            case "NW": 
                // non-western learning
                desArray[17] = 1;
                break;  
            case "DI": 
                // diversity and inclusion
                desArray[18] = 1;
                break;  
            case "CS": 
                // capstone experience
                desArray[19] = 1;
                break;  
        }
    })
    return desArray; 
}

/*
    Generate a 2D array of course designation arrays for given courseList. 
    @param courseList: a list of course objects
    @return masterDesArray: a 2D array of all course designation arrays
*/
function getMasterDesArray(courseList) {
    // declare master des array
    var master = new Array(courseList.length);
    console.log('length', master.length) 
    
    // add des array for each course to master
    for (var i = 0; i < courseList.length; i++) {
        master[i] = getDesArray(courseList[i]); 
    }

    // return master des array
    return master; 
}

/*
    Generate a column-based subset of a given master designation array
    @param masterDesArray: 2D array of course designation arrays
    @param s: int index of the start column (inclusive)
    @param e: int index of the end column (non-inclusive)
    value of -1 for e indicates end is last element of array
    @return subsetDesArray: 2D subset of given master designations array
*/
function getSubsetDesArray(masterDesArray, s, e) {
    // declare new subset array
    var subset = new Array(masterDesArray.length); 

    // find subset of each individual course des array and add to final subset 2D array
    for (var i = 0; i < masterDesArray.length; i++) {
        if (e == -1) {
            subset[i] = masterDesArray[i].slice(s); 
        } else {
            subset[i] = masterDesArray[i].slice(s, e); 
        }
    }
    return subset; 
}

/*
    Recursive search attempting to assign a candidate vertex to position vertex.
    @param graph: a 2D array of vertexes to perform the search on.
    @param c: the candidate vertex to attempt to find a match for.
    @param visited: a boolean (0/1) array indicating which position vertices have already
    been tested for a match with given candidate. 
    @param matches: an int array to store the candidate values (index value) matched 
    with each position vertex (index number)
*/
function findMatch(graph, c, visited, matches) {
    // get number of position vertices
    const numPositions = graph[0].length; 

    // iterate over all possible positions to look for match
    for (var p = 0; p < numPositions; p++) {
        /* if candidate can be matches to current position
            and position has not be visited already */
        if (graph[c][p] && !visited[p]) {
            // mark current position vertex as visited 
            visited[p] = true; 

            /* if position p is not matched or the prior match
                has an alternative match */ 
            if (matches[p] < 0 || findMatch(graph, matches[p], visited, matches)) {
                //set match value to current candidate vertex
                matches[p] = c;
                return true; 
            }
        }
    }
    //return false if match not found
    return false; 
}

/* 
    finds a maximum bipartite matching.
    @param graph: a bipartite graph represented by a 2D array
    @return matches: an int array storing final matches. 
    indices of matches will represent position vertices and 
    index values will represent the found candidate vertices. 
    Otherwise, a value of -1 will indicate no match was found.
*/
function findMaxMatch(graph) {
    // initialize number of candidates and positions
    const numCandidates = graph.length; 
    const numPositions = graph[0].length; 

    // create array to store found matches
    var matches = new Array(numPositions); 
    // initialize each index to -1 to indicate no match
    for (var i = 0; i < matches.length; i++) {
        matches[i] = -1; 
    }

    // loop through all candidates to find possible matches
    // where c is the index number of the current candidate
    for (var c = 0; c < numCandidates; c++) {
        // create an array to indicate which positions have been tested previously
        var visited = new Array(numPositions); 
        // fill all visited indices with false value to indicate not visited
        for (var i = 0; i < visited.length; i++) {
            visited[i] = false; 
        }

        // attempt to match candidate to position
        findMatch(graph, c, visited, matches); 
    }
    // return the final matches 
    return matches;
}

/*
    perform maximum matching on a courseList to derive requirement checklist assignments.
    @param courseList: array of course objects to perform the matching on
    @return finalMatch: an array containing all final match arrays
*/
function maxCourseMatch (courseList) {
    // get designation array for all courses
    var masterDesArray = getMasterDesArray(courseList); 

    /* gather subsets of masterDesArray and store in list
       matchings must be performed in subsets of the master to allow
       for both overlapping and non-overlapping requirement sets to exist
    */
    var subsetList = []; 

    // effective communication subset 
    subsetList.push(getSubsetDesArray(masterDesArray, 0, 5)); 
    // pillars of liberal arts subset
    subsetList.push(getSubsetDesArray(masterDesArray, 5, 11));
    // secondary pillar subset
    subsetList.push(getSubsetDesArray(masterDesArray, 11, 16));
    // cross-area subset
    subsetList.push(getSubsetDesArray(masterDesArray, 16, 19));
    // capstone subset 
    subsetList.push(getSubsetDesArray(masterDesArray, 19, 20));
    // wellness subset
    subsetList.push(getSubsetDesArray(masterDesArray, 20, -1));

    // create array to combine subset match maxings
    var finalMaxMatch = []; 

    // perform max matching on each subset
    for (var i = 0; i < subsetList.length; i++) {
        // perform max match function 
        var subsetMaxMatch = findMaxMatch(subsetList[i]); 
        // add the subset match to the final match array
        finalMaxMatch = finalMaxMatch.concat(subsetMaxMatch); 
    }

    // return final match
    return finalMaxMatch
}