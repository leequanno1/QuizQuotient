let showPopup = function (popupId) {
    document.getElementById(popupId).classList.remove("hidden-container");
}

let cancelPopup = function (popupId) {
    console.log(popupId);
    document.getElementById(popupId).classList.add("hidden-container");
}