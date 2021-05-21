document.getElementById("login-form-submit").addEventListener("click", sumbitLoginForm);

function sumbitLoginForm(e) {

    e.preventDefault();
    let formElements = this.closest('form').elements;
    let isValidForm = validateForm(formElements);

    if (!isValidForm) {
        addToast('Please submit valid input!', 'error');
        return;
    }
    let params = {
        'email': document.getElementById('email-field').value,
        'password': document.getElementById('password-field').value,
    };

    callPostApi('login', params).then((response) => {
        if (response.status === 'success') {
            handleLoginSuccess(response.data)
        } else {
            addToast(response.msg, response.status);
        }
    });

}

function handleLoginSuccess(data) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user_data', JSON.stringify(data.user_data));
    window.location = 'dashboard.html';

}

