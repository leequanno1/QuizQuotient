let sheetData = JSON.parse(sessionStorage.getItem("SheetData"));
if (!sheetData){
    if(location.hostname === "leequanno1.github.io"){
        location.href = location.origin + "/QuizQuotient/Views/NotFound.html";
    }else{
        location.href = location.origin + "/Views/NotFound.html";
    }
}

// Render header
let converAscciCode = function(number) {
    if(number == 0 || number > 26){
        return "&#48";
    }
    return `&#${number + 64}`;
}

let getTableHeader = function(number) {
    let headerString = "";
    while(number > 26){
        let reminder = number%26;
        if(reminder === 0){
            number = Math.floor(number/26) - 1;
            headerString = `${converAscciCode(26)}${headerString}`;
        }else{
            number = Math.floor(number/26);
            headerString = `${converAscciCode(reminder)}${headerString}`;
        }
    }
    // if (number > 0){
        headerString = `${converAscciCode(number)}${headerString}`;
    // }
    return headerString.trim();
}

let setTableHeader = function() {
    let collume = sheetData[0].length;
    let headerArray = [];
    for(let i = 1; i <= collume; i++){
        headerArray = [...headerArray, getTableHeader(i)];
    }
    sheetData = [headerArray,...sheetData];
    for(let i = 0; i < sheetData.length; i++){
        // if(i === 0){
        //     sheetData[i] = ["0",...sheetData[i]];
        // }else{
        // sheetData[i] = [i,...sheetData[i]];
        // }
        sheetData[i] = [i,...sheetData[i]];
    }
}

let doomTable = function() {
    let doomElement = sheetData.map((row, indexX) => {
        let tdString = row.map((element, indexY) => {
            let content = element;
            let cell;
            if(element == null){
                content = "";
            }
            if(indexX == 0 || indexY == 0){
                cell = `<th><div class="${indexX}:${getTableHeader(indexY)}" >${content}</div></th>`;
            }else{
                cell = `<td class="${indexX}:${getTableHeader(indexY)}" >${content}</td>`;
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

//Main function()
setTableHeader();
console.log(sheetData);
doomTable();