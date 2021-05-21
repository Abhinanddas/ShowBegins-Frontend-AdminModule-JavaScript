const apiRoute = 'http://127.0.0.1:8000/api/';

document.addEventListener("load", onPageLoad());

async function onPageLoad() {
    let urlArray = window.location.href.split('/');
    let path = urlArray[urlArray.length - 1];

    let accessToken = localStorage.access_token;
    if (accessToken && path == 'login.html') {
        window.location = 'dashboard.html';
    }

    if (!accessToken && path != 'login.html') {
        window.location = 'login.html';
    }
}

function validateForm(formElements) {
    let isFormValid = true;
    for (let i = 0; i < formElements.length - 1; i++) {
        if (!formElements[i].checkValidity()) {
            isFormValid = false;
            break;
        }
    }
    return isFormValid;
}

function addToast(content = '', theme = 'moon', time = 3000, autohide = true, position = 'topRight', animation = 'fade') {
    let toastr = new Toastr({
        theme: fetchToastrTheme(theme),
        position: position,
        animation: animation,
        timeout: time,
        autohide: autohide,
    });
    toastr.show(content);
}

// moon, sun, ocean, grassland, rainbow
function fetchToastrTheme(theme) {

    if (theme === 'success') {
        theme = 'basic';
        return theme;
    }

    if (theme === 'info') {
        theme = 'moon';
        return theme;
    }

    if (theme === 'error') {
        theme = 'sun';
        return theme;
    }

    if (theme === 'warning') {
        theme = 'ocean';
        return theme;
    }

    return 'grassland';

}

function callGetApi(api) {
    let url = apiRoute + api;
    return fetch(url, {
        method: 'GET',
        headers: fetchAPIHeaders(),
    }).then(response => {
        let statusCode = response.status;
        if (statusCode != 200) {
            handleAPIStatusCodes(statusCode);
        }
        return response.json();
    }).then(data => {
        return data;
    }).catch(function (response) {
        addToast("Some error happened", "error");
        return false;
    });
}

function callPostApi(api, params) {
    let url = apiRoute + api;
    return fetch(url, {
        method: 'post',
        headers: fetchAPIHeaders(),
        body: JSON.stringify(params),
    }).then(response => {
        let statusCode = response.status;
        if (statusCode != 200) {
            handleAPIStatusCodes(statusCode);
        }
        return response.json();
    }).then(data => {
        console.log(data)
        return data;
    }).catch(response => {
        addToast("Some error happened", "error");
        return false;
    });
}


function fetchAPIHeaders() {
    let headers = {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'ShowBegins-APP-Key': 'base64:S2wgFrGsp81CHpMbtKV6dMjAcFakrV5b1qWPzNG5+ss=',
        'ShowBegins-APP-Secret': 'SHOW_BEGINS_APP_SECRET',
    };

    if (localStorage.accessToken) {
        headers.access_token = 'Bearer' + localStorage.accessToken;
    }
    return headers;
}

function handleAPIStatusCodes(statusCode) {
    addToast("Some error happened", "error");
}