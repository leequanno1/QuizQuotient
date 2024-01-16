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
    }
    await fetch(newUrl)
    .then(res => res.text())
    .then(rep => {
        let datas = JSON.parse(rep.substring(47).slice(0,-2));
        let datasTranform = datas.table.rows.map((row)=> {
            return row.c.map((element) => {
                if(element == null){
                    return null;
                }
                return element.v;
            })
        });
        sessionStorage.setItem("SheetData", JSON.stringify(datasTranform));
    });
    if(location.hostname === "leequanno1.github.io"){
        location.href = location.origin + "/QuizQuotient/Views/QuizQuotientProcesser.html";
    }else{
        location.href = location.origin + "/Views/QuizQuotientProcesser.html";
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
        sessionStorage.setItem("SheetData", JSON.stringify(rows));
    });
    if(location.hostname === "leequanno1.github.io"){
        location.href = location.origin + "/QuizQuotient/Views/QuizQuotientProcesser.html";
    }else{
        location.href = location.origin + "/Views/QuizQuotientProcesser.html";
    }
})

// https://docs.google.com/spreadsheets/d/1G76lYorHhsBM-ZVDBHdBdP7VwDuNUpQH4ql3Zdr3A-k/edit#gid=0