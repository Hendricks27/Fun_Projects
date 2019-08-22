"use strict";

var GUIContainer = document.getElementById("GUI");

/*
* 0 7 8  0 0 0  0 0 0
* 0 0 1  0 0 3  0 0 0
* 0 0 0  0 9 0  5 6 0
*
* 0 8 9  1 0 0  4 3 7
* 0 1 0  0 2 9  0 0 0
* 5 4 6  0 0 0  2 9 0
*
* 1 6 3  0 4 0  0 8 0
* 8 9 4  5 0 7  6 0 3
* 7 2 5  8 3 6  1 4 0
* */

// Simple
var testingSudokuSet = [undefined, 7, 8, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, 1, undefined, undefined, 3, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, 9, undefined, 5, 6, undefined,
    undefined, 8, 9, 1, undefined, undefined, 4, 3, 7,
    undefined, 1, undefined, undefined, 2, 9, undefined, undefined, undefined,
    5, 4, 6, undefined, undefined, undefined, 2, 9, undefined,
    1, 6, 3, undefined, 4, undefined, undefined, 8, undefined,
    8, 9, 4, 5, undefined, 7, 6, undefined, 3,
    7, 2, 5, 8, 3, 6, 1, 4, undefined
];

// Hard, 12s
var testingSudokuSet2 = [
    undefined,undefined,undefined,8,3,5,undefined,undefined,1,
    undefined,9,undefined,undefined,undefined,2,undefined,undefined,undefined,
    undefined,undefined,6,undefined,undefined,undefined,undefined,undefined,3,
    undefined,undefined,undefined,undefined,undefined,3,7,undefined,undefined,
    undefined,undefined,undefined,5,9,undefined,1,undefined,2,
    9,undefined,undefined,undefined,undefined,6,8,undefined,undefined,
    undefined,5,1,2,undefined,undefined,3,undefined,6,
    8,undefined,4,undefined,undefined,undefined,undefined,7,undefined,
    undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
];

// Hard, 5s
var testingSudokuSet3 = [
    undefined,undefined,undefined,undefined,7,undefined,undefined,undefined,undefined,
    9,undefined,undefined,3,undefined,undefined,6,8,undefined,
    6,1,undefined,4,undefined,undefined,3,undefined,undefined,
    5,undefined,undefined,undefined,3,undefined,7,undefined,undefined,
    1,7,undefined,undefined,undefined,undefined,undefined,undefined,2,
    undefined,undefined,6,7,undefined,2,undefined,1,undefined,
    undefined,undefined,undefined,undefined,undefined,4,undefined,undefined,undefined,
    7,4,1,8,undefined,3,undefined,5,6,
    3,undefined,9,5,undefined,7,undefined,4,undefined
];

// Hard takes a long time
var testingSudokuSet4 = [
    undefined,undefined,undefined,7,undefined,undefined,8,undefined,undefined,
    undefined,undefined,undefined,undefined,4,undefined,undefined,3,undefined,
    undefined,undefined,undefined,undefined,undefined,9,undefined,undefined,1,
    6,undefined,undefined,5,undefined,undefined,undefined,undefined,undefined,
    undefined,1,undefined,undefined,3,undefined,undefined,4,undefined,
    undefined,undefined,5,undefined,undefined,1,undefined,undefined,7,
    5,undefined,undefined,2,undefined,undefined,6,undefined,undefined,
    undefined,3,undefined,undefined,8,undefined,undefined,9,undefined,
    undefined,undefined,7,undefined,undefined,undefined,undefined,undefined,2
];

var t = [
    8,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
    undefined,undefined,3,6,undefined,undefined,undefined,undefined,undefined,
    undefined,7,undefined,undefined,9,undefined,2,undefined,undefined,

    undefined,5,undefined,undefined,undefined,7,undefined,undefined,undefined,
    undefined,undefined,undefined,undefined,4,5,7,undefined,undefined,
    undefined,undefined,undefined,1,undefined,undefined,undefined,3,undefined,

    undefined,undefined,1,undefined,undefined,undefined,undefined,6,8,
    undefined,undefined,8,5,undefined,undefined,undefined,1,undefined,
    undefined,9,undefined,undefined,undefined,undefined,4,undefined,undefined,
];

var SudokuDataset = function () {

    // Basic function
    var getTime = function () {
        var timeMod = new Date();
        var timestamp = timeMod.getTime();

        return timestamp
    };
    var startTimestamp = getTime();
    var timePassed;


    // Display part

    // display div ID
    var GUIID = "";
    var root = "";
    var statusBar;
    var vues = [];

    var indexToDomID = function (i) {
        return GUIID + "_unit_" + i;
    };

    var GUIInit = function (id) {
        root = document.getElementById(id);
        vues = [];

        var inputField = document.createElement("div");
        inputField.setAttribute("style", "");
        root.appendChild(inputField);

        for (var i=0; i<81; i++){
            var unit = document.createElement("input");
            var domID = indexToDomID(i);
            // unit.setAttribute("", "");
            unit.setAttribute("type", "text");
            unit.setAttribute("min", "1");
            unit.setAttribute("max", "9");
            unit.setAttribute("step", "1");
            unit.setAttribute("maxlength", "1");

            unit.setAttribute("id", domID);
            //unit.setAttribute("align", "center");

            unit.setAttribute("v-model", "num");

            if ([0,2,4,6,8].includes(index2block(i))){
                unit.setAttribute("style", "background-color: orange; color: white; " +
                    "width: 30px; height: 30px; border-color: white;" +
                    "font-size: 18px; text-align: center;"
                );
            }
            else{
                unit.setAttribute("style", "background-color: grey; color: white; " +
                    "width: 30px; height: 30px; border-color: white;" +
                    "font-size: 18px; text-align: center;"
                );
            }

            // unit.setAttribute("v-bind", "");


            inputField.appendChild(unit);

            if ((i+1)%9 === 0){
                inputField.appendChild(document.createElement("br"));
            }

            var vueApp = new Vue({
                el: "#"+domID,
                data: {
                    "num": undefined
                }
            });
            vues.push(vueApp)

        }

        var button = document.createElement("button");
        button.innerText = "Calculate!";
        // button.setAttribute("", "");
        button.setAttribute("style", "");
        button.onclick = calculate;



        function testCase(x, name) {
            var button2 = document.createElement("button");
            button2.innerText = "Test case: "+name;
            // button.setAttribute("", "");
            button2.setAttribute("style", "");
            button2.onclick = function () {
                setData(x);
            };
            root.appendChild(button2);
        }
        testCase(testingSudokuSet, "Simple");
        testCase(testingSudokuSet3, "Moderate");
        testCase(testingSudokuSet4, "Hard");
        root.appendChild(document.createElement("br"));


        root.appendChild(button);

        statusBar = document.createElement("p");

        statusChange("Fill partially and try calculate!");
        root.appendChild(statusBar);

    };

    var statusChange = function (msg) {
        statusBar.innerText = msg;
    };

    var calculate = function () {
        logToHTML();
        var temp = outputAllData2Array();
        if (temp.filter(x => x == undefined).length > 60){
            alert("Please provide more values");
            return false
        }

        autofill();
    };

    var setVueDataAtIndex = function (i,d) {
        vues[i].num = d;
    };

    var getVueDataAtIndex = function (i) {
        var a = vues[i].num;
        a = parseInt(a);

        if ([1,2,3,4,5,6,7,8,9].includes(a)){
            return a
        }
        else{
            return undefined
        }

    };

    var outputAllData2Array = function () {
        var res = [];
        for (var i=0; i<81; i++){
            res.push(getVueDataAtIndex(i));
        }
        return res
    };






    // Calculation part
    var originalData = [];
    var internalData = [];

    var setData = function (x) {
        var data;
        if (x){
            data = JSON.parse(JSON.stringify(x))
        }else{
            data = outputAllData2Array();
        }
        originalData = JSON.parse(JSON.stringify(data));
        internalData = [];
        inputReformat();
    };


    var inputReformat = function () {
        internalData = [];
        var i = 0;
        for (var t of originalData){
            if (t){
                internalData.push(t);
                setVueDataAtIndex(i, t)
            }else{
                internalData.push([1,2,3,4,5,6,7,8,9]);
                setVueDataAtIndex(i, "?")
            }
            i+=1;
        }
    };

    var outputData = function () {
        var output = [];
        for (var i = 0; i<=80 ; i++){
            var d = getByIndex(i);
            // console.log([i, d]);
            if (Array.isArray(d)){
                output.push("?");
            }else if(d == undefined)
            {
                output.push("?");
            }
            else
                {
                output.push(d.toString())
            }
        }

        var s = "";
        for (var i = 0; i<=80 ; i++){
            s += output[i];

            if ((i+1)%27 == 0){
                s += '<br><br>'
            }
            else if ((i+1)%9 == 0){
                s += '<br>'
            }
            else if ((i+1)%3 == 0){
                s += '&nbsp&nbsp&nbsp&nbsp';
            }
            else{
                s += "_";
            }



        }
        return s
    };



    // index and coordinate translation

    /* 0 <= int(i) <= 80       */
    /* 0 <= int(rowNum) <= 8   */
    /* 0 <= int(colNum) <= 8   */
    /* 0 <= int(blockNum) <= 8 */

    var index2coordinates = function (i) {
        return [index2row(i), index2col(i)]
    };

    var index2row = function (i) {
        if (i<0 || i>80){
            throw "Invalid index"
        }
        return parseInt(i/9);
    };

    var index2col = function (i) {
        if (i<0 || i>80){
            throw "Invalid index"
        }
        return Math.round(i%9);
    };

    var index2block = function (i) {
        var rowNum,colNum,bx,by;
        rowNum = index2row(i);
        colNum = index2col(i);

        bx = parseInt(rowNum/3);
        by = parseInt(colNum/3);

        return bx*3+by
    };

    var coordinates2index = function (coordinate) {
        var rowNum, colNum;
        rowNum = coordinate[0];
        colNum = coordinate[1];
        if (rowNum<0 || colNum <0 || rowNum >8 || colNum >8){
            throw "Invalid coordinate"
        }
        return rowNum*9+colNum

    };

    // Access the data
    // By colNum, rowNum, blockNum
    var getRow = function (rowNum) {
        var res = [];
        for (var colNum of [0,1,2,3,4,5,6,7,8]){
            var i = coordinates2index([rowNum, colNum]);
            res.push(internalData[i]);
        }
        return res
    };

    var eachRow = function () {
        var res = [];
        for (var rowNum of [0,1,2,3,4,5,6,7,8]){
            res.push(getRow(rowNum))
        }
        return res
    };

    var getCol = function (colNum) {
        var res = [];
        for (var rowNum of [0,1,2,3,4,5,6,7,8]){
            var i = coordinates2index([rowNum, colNum]);
            res.push(internalData[i]);
        }
        return res
    };

    var eachColumn = function () {
        var res = [];
        for (var colNum of [0,1,2,3,4,5,6,7,8]){
            res.push(getCol(colNum))
        }
        return res
    };

    var getBlock = function (blockNum) {
        var res = [];
        for (var i=0;i<=80;i++){
            if (index2block(i) == blockNum){
                res.push(internalData[i])
            }
        }
        return res
    };

    var eachBlock = function () {
        var res = [];
        for (var blockNum of [0,1,2,3,4,5,6,7,8]){
            res.push(getBlock(blockNum))
        }
        return res
    };

    var getByIndexOLD = function (i) {
        return internalData[i]
    };

    var setDataAtIndexOLD = function (i, x) {
        internalData[i] = x;
    };

    var getByIndex = function (i) {
        return internalData[i]
    };

    var setDataAtIndex = function (i, x) {

        if (Array.isArray(x)){
            setVueDataAtIndex(i, "?")
        }else {
            setVueDataAtIndex(i, x)
        }
        internalData[i] = x;
    };

    var removeImpossibleValueAtIndex = function (i, x) {
        var dataAtI = internalData[i];
        if (Array.isArray(dataAtI)){
            if (dataAtI.includes(x)){
                for( var index = 0; index < dataAtI.length; index++){
                    if ( dataAtI[index] === x) {
                        dataAtI.splice(index, 1);
                        break;
                    }
                }
            }
        }
    };

    var convertJustOneOnlyPossibleValueToInt = function () {
        for (var i = 0; i<=80; i++){
            if (Array.isArray(getByIndex(i))){
                if (getByIndex(i).length === 1){
                    setDataAtIndex(i, getByIndex(i)[0]);
                    return true
                }
            }
        }
        return false
    };

    var convertAllOnlyPossibleValueToIntOld = function () {
        var count = 0;
        while (convertJustOneOnlyPossibleValueToInt()){
            count+=1;
        }
        return count
    };

    var convertAllOnlyPossibleValueToInt = function () {
        var changed = false;
        for (var i = 0; i<=80; i++){
            if (Array.isArray(getByIndex(i))){
                if (getByIndex(i).length === 1){
                    setDataAtIndex(i, getByIndex(i)[0]);
                    changed = true;
                }
            }
        }
        return changed
    };

    var reduceImpossibleValueAtIndexI = function (i) {
        var rowNum = index2row(i);
        var colNum = index2col(i);
        var blockNum = index2block(i);

        var row = getRow(rowNum);
        var col = getCol(colNum);
        var block = getBlock(blockNum);
        var all = row.concat(col).concat(block);

        for (var value of all){
            if (Array.isArray(value)){

            }
            else{
                removeImpossibleValueAtIndex(i, value)
            }
        }
    };

    var reduceAllImpossibleValue = function () {
        for (var i = 0; i<=80; i++){
            reduceImpossibleValueAtIndexI(i);
        }
        //convertAllOnlyPossibleValueToInt();
    };

    var scanForInvalidValue = function () {
        for (var i = 0; i<=80; i++){
            if (Array.isArray(getByIndex(i))){
                if (getByIndex(i).length === 0){
                    return true
                }
            }
        }
        return false
    };

    var solved = function () {
        for (var i = 0; i<=80; i++){
            if (Array.isArray(getByIndex(i))){
                if (getByIndex(i).length === 1){

                }else{
                    return false
                }
            }
        }
        return true
    };

    var correct = function () {
        for (var i = 0; i<=80; i++){
            var d = getByIndex(i);
            if (!Array.isArray(d)){
                var rowNum = index2row(i);
                var colNum = index2col(i);
                var blockNum = index2block(i);

                if (getRow(rowNum).filter(x => x==d).length > 1){
                    // console.log([rowNum, colNum]);
                    return false
                }

                if (getCol(colNum).filter(x => x==d).length > 1){
                    // console.log([rowNum, colNum]);
                    return false
                }

                if (getBlock(blockNum).filter(x => x==d).length > 1){
                    // console.log([rowNum, colNum]);
                    return false
                }
            }
        }

        return true
    };

    var simpleScan = function () {
        for (var i =0; i<80; i++){
            reduceAllImpossibleValue();
            convertAllOnlyPossibleValueToInt();
        }
    };

    var moveLevel = 0;
    var currentMoves = [];
    var invalidMoves = {};

    var getShortestOption = function () {
        var shortestOption = 9;
        for (var i = 0; i<=80; i++){
            var d = getByIndex(i);
            if (Array.isArray(d)){
                if (d.length == 0 ){
                    console.log("...");
                }
                if (d.length < shortestOption){
                    shortestOption = d.length;
                }
            }
        }
        return shortestOption
    };


    var guessNextOne = function (shortestOption, chooseIndex) {

        for (var i = 0; i<=80; i++){
            var d = getByIndex(i);
            if (Array.isArray(d)){
                if (d.length === shortestOption){

                    setDataAtIndex(i, d[chooseIndex]);
                    break;
                }
            }
        }
        return i
    };

    var tryTimes = 0;
    var level = 0;
    var advancedTry = function () {
        //console.log([tryTimes, level]);

        if (solved()){
            if (correct()){
                // console.log("Nail it");
                return true
            }
            return false
        }
        else if (scanForInvalidValue()){
            return false
        }
        else {
            tryTimes += 1;
            if (tryTimes > 5000){
                // console.log("Too many wrong attempt");
                // return true;
                throw "Too many wrong attempt"
            }

            simpleScan();

            var thisTimeInitialData = JSON.stringify(internalData);
            var len = getShortestOption();
            level += 1;

            for (var i=0; i<len; i++){
                var x = guessNextOne(len, i);
                simpleScan();

                // console.log([x,": " ,i,"/",len]);
                var res = advancedTry();
                if (res){
                    return true
                }else{
                    internalData = JSON.parse(thisTimeInitialData)
                }
            }

            level -= 1;
            // console.log("hmmmm");
            return false
        }
    };

    var resultCheck = function () {

        timePassed = -startTimestamp+getTime();
        timePassed = timePassed/1000;
        timePassed.toString();
        var log = "Solve: " + solved() + "\nCorrect: " + correct() + "\nTime: " + timePassed + "s\nGuessed: "+ tryTimes + " times";

        console.log(log);
    };

    var debug = function () {
        var c = 1;
        var x = [];
        for (var i = 0; i<=80; i++){
            var d = getByIndex(i);
            console.log([i,d]);
            if (Array.isArray(d)){
                c = c * d.length;
                x.push(d.length);
            }
        }
        // console.log(x);
    };

    function logToHTML() {
        GUIContainer.innerHTML = outputData();
    }

    var autofill = function (){
        statusChange("Calculating...");

        startTimestamp = getTime();

        simpleScan();

        setTimeout(autofillPart2, 1);
    };

    var autofillPart2 = function () {
        if ( !solved() ){
            advancedTry();
        }

        resultCheck();
        statusChange("Done, it took " + timePassed + "s to calculate");
        logToHTML();
    };



    return {
        GUIInt: GUIInit,
        setData: setData,
        simpleScan: simpleScan,
        guessNextOne: guessNextOne,
        logToHTML: logToHTML,
        scanForInvalidValue: scanForInvalidValue,
        debug: debug,
        solved: solved,
        autofill: autofill
    }
};


var a = SudokuDataset();
a.GUIInt("sudoku");

// a.logToHTML();
// a.setData(testingSudokuSet3);





