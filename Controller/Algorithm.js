let debounce = (cb, delay = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args);
        },delay)
    }
}

let gennerateQue = function (start, end){
    let que = [];
    for(let i = start; i <= end; i++){
        que.push(i);
    }
    return que;
}