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

console.log(testingSudokuSet4.length);


var SudokuDataset = function (data) {
    var timeMod = new Date();
    var startTimestamp = timeMod.getTime();


    var originalData = JSON.parse(JSON.stringify(data));
    var internalData = [];


    var inputReformat = function () {
        internalData = [];
        for (var t of originalData){
            if (t){
                internalData.push(t);
            }else{
                internalData.push([1,2,3,4,5,6,7,8,9]);
            }
        }
    };
    inputReformat();

    var outputData = function () {
        var output = [];
        for (var i = 0; i<=80 ; i++){
            var d = getByIndex(i);
            // console.log([i, d]);
            if (Array.isArray(d)){
                output.push("?");
            }else{
                output.push(d.toString())
            }
        }

        var s = "";
        for (var i = 0; i<=80 ; i++){
            s += output[i];
            s += "_";
            if ((i+1)%3 == 0){
                s += '_'
            }
            if ((i+1)%9 == 0){
                s += '\n'
            }
            if ((i+1)%27 == 0){
                s += '\n'
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
        if (i<0 || i>80){
            throw "Invalid index"
        }
        var rowNum, colNum;
        rowNum = parseInt(i/9);
        colNum = Math.round(i%9);

        return [rowNum,colNum]
    };

    var index2row = function (i) {
        return index2coordinates(i)[0]
    };

    var index2col = function (i) {
        return index2coordinates(i)[1]
    };

    var index2block = function (i) {
        var rowNum,colNum,bx,by;
        rowNum = index2coordinates(i)[0];
        colNum = index2coordinates(i)[1];

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

    var getByIndex = function (i) {
        return internalData[i]
    };

    var setDataAtIndex = function (i, x) {
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
        var newDate = new Date();
        var timePassed = -timeMod.getTime()+newDate.getTime();
        timePassed = timePassed/1000;
        timePassed.toString();
        var log = "Solve: " + solved() + "\nCorrect: " + correct() + "\nTime: " + timePassed + "s\nTried: "+ tryTimes + " times";

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
        GUIContainer.innerText = outputData();
    }

    simpleScan();

    if ( !solved() ){
        advancedTry();
    }
    logToHTML();


    resultCheck();




    return {
        simpleScan: simpleScan,
        guessNextOne: guessNextOne,
        logToHTML: logToHTML,
        scanForInvalidValue: scanForInvalidValue,
        debug: debug,
        solved: solved
    }
};


var a = SudokuDataset(testingSudokuSet2);








