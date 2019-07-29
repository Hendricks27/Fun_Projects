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
console.log(testingSudokuSet2.length);


var SudokuDataset = function (data) {

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
            console.log([i, d]);
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

    var convertAllOnlyPossibleValueToInt = function () {
        var count = 0;
        while (convertJustOneOnlyPossibleValueToInt()){
            count+=1;
        }
        return count
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

    var simpleScan = function () {
        for (var i =0; i<70; i++){
            reduceAllImpossibleValue();
            convertAllOnlyPossibleValueToInt();
        }
    };

    function logToHTML() {
        GUIContainer.innerText = outputData();
    }

    //logToHTML();
    simpleScan();

    setDataAtIndex(0,2);
    simpleScan();



    logToHTML();


    // Code testing
    var t1 = coordinates2index([4,5]);
    var t2 = index2coordinates(t1);

    return {

    }
};


SudokuDataset(testingSudokuSet2);








