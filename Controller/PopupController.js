let showPopup = function (popupId) {
    document.getElementById(popupId).classList.remove("hidden-container");
}

let cancelPopup = function (popupId) {
    console.log(popupId);
    document.getElementById(popupId).classList.add("hidden-container");
}

document.getElementById("submitSheetLink").addEventListener("click", async ()=>{
    let urlData = document.getElementById("txtSheetUrl").value;
    let newUrl = "";
    if (!urlData){
        cancelPopup("SheetURLContainer");
        document.getElementById("txtSheetUrl").value = "";
        return;
    }else{
        newUrl = urlData.split('/edit#gid')[0] + "/gviz/tq";
        // Log for debug
        // console.log(newUrl)
    }
    await fetch(newUrl)
    .then(res => res.text())
    .then(rep => {
        let datas = JSON.parse(rep.substring(47).slice(0,-2));
        sessionStorage.setItem("SheetURLData", JSON.stringify(datas.table.rows));
    });
    if(location.origin === "leequanno1.github.io"){
        location.href = location.origin + "/QuizQuotient/Views/QUIZQUOTIENT_SheetURL.html";
    }else{
        location.href = location.origin + "/Views/QUIZQUOTIENT_SheetURL.html";
    }

})

document.getElementById("fileSheet").addEventListener("change", async (event)=> {
    let sheetFile = event.target.files[0];
    if(!sheetFile){
        alert("No file");
        return;
    }
    await readXlsxFile(sheetFile)
    .then((rows) => {
        sessionStorage.setItem("SheetFileData", JSON.stringify(rows));
    });
    if(location.origin === "leequanno1.github.io"){
        location.href = location.origin + "/QuizQuotient/Views/QUIZQUOTIENT_SheetFile.html";
    }else{
        location.href = location.origin + "/Views/QUIZQUOTIENT_SheetFile.html";
    }
})

// https://docs.google.com/spreadsheets/d/1G76lYorHhsBM-ZVDBHdBdP7VwDuNUpQH4ql3Zdr3A-k/edit#gid=0