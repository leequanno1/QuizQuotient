let sheetData = JSON.parse(sessionStorage.getItem("SheetData"));
let selectedQue = [];

// Script check for session
if (!sheetData){
    if(location.hostname === "leequanno1.github.io"){
        location.href = location.origin + "/QuizQuotient/Views/NotFound.html";
    }else{
        location.href = location.origin + "/Views/NotFound.html";
    }
}

//Render selectedQue 
let renderSelectedQue = function() {
    for(let i = 0; i < selectedQue.length; i++){
        let cell = document.querySelector(`.${selectedQue[i]}`)
        if(cell){
            cell.classList.add("cell-selected");
        }
    }
}

//Reset selectedQue 
let resetSelectedQue = function() {
    for(let i = 0; i < selectedQue.length; i++){
        let cell = document.querySelector(`.${selectedQue[i]}`);
        if(cell){
            cell.classList.remove("cell-selected");
        }
    }
}

// render selected for only one cell
let renderSlectedCell = function(cell){
    resetSelectedQue();
    selectedQue = [];
    selectedQue.push(cell.toUpperCase())
    renderSelectedQue()
}

// render selected for multiple cells
let renderMultipleSlectedCells = function(rangeX,rangeY){
    resetSelectedQue();
    selectedQue = [];
    for(let i = rangeX[0]; i <= rangeX[1]; i++){
        let col = converAscciCodeToString(i);
        for(let j = rangeY[0]; j <= rangeY[1]; j++){
            let cell = col+j.toString();
            selectedQue.push(cell);
        }
    }
    renderSelectedQue();
}

//Format in range X
let formatInRangeX = function(number){
    if(number <= 0){
        return 1;
    }
    if(number >= sheetData[0].length){
        return sheetData[0].length-1;
    }
    return number;
}

//Format in range Y
let formatInRangeY = function(number){
    if(number <= 0){
        return 1;
    }
    if(number >= sheetData.length){
        return sheetData.length-1;
    }
    return number;
}

// Render header
let converAscciCodeToString = function(number) {
    if(number == 0 || number > 26){
        return "0";
    }
    return String.fromCharCode(number + 64);
}

// Convert char to ascci code
let convertCharToAscci = function(character) {
    return character.charCodeAt(0) - 64;
}

// Convert String like "AAA" into index number
let converStringToNumber = function(character) {
    let res = 0;
    for(let i = 0; i < character.length; i++){
        res += convertCharToAscci(character.charAt(i).toUpperCase()) * 26**i;
    }
    return res;
}

// Get the character at the "number" position
let getTableHeader = function(number) {
    let headerString = "";
    while(number > 26){
        let reminder = number%26;
        if(reminder === 0){
            number = Math.floor(number/26) - 1;
            headerString = `${converAscciCodeToString(26)}${headerString}`;
        }else{
            number = Math.floor(number/26);
            headerString = `${converAscciCodeToString(reminder)}${headerString}`;
        }
    }
    headerString = `${converAscciCodeToString(number)}${headerString}`;
    return headerString.trim();
}

// Generate a first row (header) for the table
let setTableHeader = function() {
    let collume = sheetData[0].length;
    let headerArray = [];
    for(let i = 1; i <= collume; i++){
        headerArray = [...headerArray, getTableHeader(i)];
    }
    sheetData = [headerArray,...sheetData];
    for(let i = 0; i < sheetData.length; i++){
        sheetData[i] = [i,...sheetData[i]];
    }
}

// Slip Digit and Latters
let splitDigitsAndLetters = function (chuoi) {
    var ketQua = chuoi.match(/(\d+|\D+)/g);
    return ketQua || [];
}

// Get form data and return an object
let getFormData = function(){
    return {
        catalog_start: splitDigitsAndLetters(document.getElementById("txtCatalogArea").value.toUpperCase().split(":")[0]),
        catalog_end: splitDigitsAndLetters(document.getElementById("txtCatalogArea").value.toUpperCase().split(":")[1]),
        question_quantity: document.getElementById("txtquestionQuantity").value,
    };
}

// Doom table cell
let doomTable = function(tableData = null) {
    if (!tableData){
        tableData = sheetData;
    }
    let doomElement = tableData.map((row, indexX) => {
        let tdString = row.map((element, indexY) => {
            let content = element;
            let cell;
            if(element == null){
                content = "";
            }
            if(indexX == 0 || indexY == 0){
                cell = `<th><div class="${getTableHeader(indexY)}${indexX}" >${content}</div></th>`;
            }else{
                cell = `<td class="${getTableHeader(indexY)}${indexX}" >${content}</td>`;
            }
            return cell;
        }).join(" ");
        if(indexX === 0){
            tdString = `<tr class="${indexX} tr-0">${tdString}</tr>`
        }else{
            tdString = `<tr class="${indexX}">${tdString}</tr>`
        }
        return tdString;
    }).join(" ");

    document.getElementById("contentSheet").innerHTML = doomElement;
}

// Get selected cell bettwen 2 cell
let selectCells = function(cell1, cell2 = null){
    if(!(cell1 && cell2)){
        if(cell1){
            renderSlectedCell(cell1);
            return;
        }
        if(cell2){
            renderSlectedCell(cell2);
            return;
        }
        resetSelectedQue();
        selectedQue = [];
    }
    cell1 = splitDigitsAndLetters(cell1);
    cell2 = splitDigitsAndLetters(cell2);
    let rangeX = [formatInRangeX(converStringToNumber(cell1[0])),formatInRangeX(converStringToNumber(cell2[0]))];
    let rangeY = [formatInRangeY(parseInt(cell1[1],10)),formatInRangeY(parseInt(cell2[1],10))];
    if(rangeX[0] > rangeX[1]){
        let temp = rangeX[1];
        rangeX[1] = rangeX[0];
        rangeX[0] = temp;
    }
    if(rangeY[0] > rangeY[1]){
        let temp = rangeY[1];
        rangeY[1] = rangeY[0];
        rangeY[0] = temp;
    }
    renderMultipleSlectedCells(rangeX,rangeY);
}

document.getElementById("txtCatalogArea").addEventListener('input', debounce((e) => {
    let inputValue = e.target.value;
    let cells = [...inputValue.split(":")];
    selectCells(cells[0],cells[1]);
},300))

document.getElementById("btnGennerate").addEventListener("click", () => {
    let formData = getFormData();
    let questionQue = gennerateQue(1,formData.question_quantity);
    let sheetDataClone = new Array(sheetData.length);
    // clone sheet datas
    for(let i = 0; i < sheetData.length; i++){
        sheetDataClone[i] = [...sheetData[i]];
    }
    sheetDataClone[0].push(getTableHeader(sheetDataClone[0].length));
    for(let i = 1; i < sheetDataClone.length; i++){
        if(i >= formData.catalog_start[1] && i <= formData.catalog_end[1]){
            if(questionQue.length == 0){
                questionQue = gennerateQue(1,formData.question_quantity);
            }
            let randomNumber = Math.floor(Math.random() * questionQue.length)
            sheetDataClone[i].push(questionQue[randomNumber]);
            questionQue.splice(randomNumber, 1);
        }else{
            sheetDataClone[i].push(undefined);
        }
    }
    if(formData.catalog_start[1] == 1){
        console.log("equal 1")
        sheetDataClone.splice(1,0,new Array(sheetDataClone[0].length).fill(undefined));
        sheetDataClone[1][sheetData[0].length] = "Câu hỏi";
        for(let i = 1; i < sheetDataClone.length; i++){
            sheetDataClone[i][0] = i;
        }
    }else{
        sheetDataClone[formData.catalog_start[1]-1][sheetData[0].length] = "Câu hỏi";
    }
    doomTable(sheetDataClone);
})

//Main function() all script excute in it.
let Main = function() {
    setTableHeader();
    doomTable();
}

Main();
