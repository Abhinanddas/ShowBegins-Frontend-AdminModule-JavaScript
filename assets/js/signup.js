document.getElementById("signup-form-submit").addEventListener("click", sumbitLoginForm);

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
        'name': document.getElementById('name-field').value,
    };

    callPostApi('signup', params).then((response) => {
        if (response.status === 'success') {
            doLogin(params);
        }
        addToast(response.msg, response.status);
    });

}

