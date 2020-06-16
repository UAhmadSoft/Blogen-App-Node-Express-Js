// Getting Elements
var submitBtn = document.getElementById('submit');
var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');
var passwordConfirmInput = document.getElementById('passwordConfirm');
var nameInput = document.getElementById('name');
var bioInput = document.getElementById('bio');

// defining Variables
const patterns = {
  email: /^([\w\.-]+)@([\w-]+)(\.[A-Za-z]{2,8})([\.a-zA-Z]{2,8})?$/,
};

window.onload = function doFirst() {
  // console.log('reloaded');

  var alertBox = document.getElementById('alert');
  if (alertBox) {
    setTimeout(function removeAlert() {
      alertBox.parentNode.removeChild(alertBox);
    }, 4000);
  }
};

// ? Optional in regex e.g /[a-z]9?/   9 is optional
// + -> minimum 1 character long in regex
// . means any character
// \. means '.' character

// Hook up Event Listeners
submitBtn.addEventListener('click', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  // console.log(e);

  var name = nameInput.value;
  var email = emailInput.value;
  var password = passwordInput.value;
  var passwordConfirm = passwordConfirmInput.value;
  var bio = bioInput.value;

  // Checking if all fields syntax syntax is valid
  let invalids = 0;

  patterns.email.test(email)
    ? emailInput.classList.remove('is-invalid')
    : (emailInput.classList.add('is-invalid'), invalids++);

  password.length < 8
    ? (passwordInput.classList.add('is-invalid'), invalids++)
    : passwordInput.classList.remove('is-invalid');

  password != passwordConfirm || passwordConfirm.length === 0
    ? (passwordConfirmInput.classList.add('is-invalid'), invalids++)
    : passwordConfirmInput.classList.remove('is-invalid');

  name.length === 0
    ? (nameInput.classList.add('is-invalid'), invalids++)
    : nameInput.classList.remove('is-invalid');

  bio.length < 30
    ? (bioInput.classList.add('is-invalid'), invalids++)
    : bioInput.classList.remove('is-invalid');

  // console.log(invalids);

  // Sending POST Request with email and password to server
  if (invalids === 0) {
    // console.log(email);

    email = email.toLowerCase();
    sendRequest(name, email, password, passwordConfirm, bio);
    passwordInput.value = '';
    emailInput.value = '';
    nameInput.value = '';
    passwordConfirmInput.value = '';
    bioInput.value = '';
  }
}

function sendRequest(name, email, password, passwordConfirm, bio) {
  $.ajax({
    type: 'POST',
    url: '/signUp',
    data: { name, email, password, passwordConfirm, bio },
    success: function (data) {
      // $('#emailFeed').fadeIn();
      //do something with the data via front-end framework
      if (data.status == 'fail') {
        location.reload();
      } else {
        location.reload();
        // $(location).attr('href', `/confirmMail/${email}`);
      }
    },
  });
}
