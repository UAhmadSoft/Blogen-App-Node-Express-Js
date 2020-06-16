// Getting Elements
var submitBtn = document.getElementById('submit');
var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');

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

  var password = passwordInput.value;
  var email = emailInput.value;

  // Checking if email and password syntax is valid
  let invalids = 0;
  patterns.email.test(email)
    ? emailInput.classList.remove('is-invalid')
    : (emailInput.classList.add('is-invalid'), invalids++);

  password.length < 8
    ? (passwordInput.classList.add('is-invalid'), invalids++)
    : passwordInput.classList.remove('is-invalid');

  // console.log(invalids);

  // Sending POST Request with email and password to server
  if (invalids === 0) {
    email = email.toLowerCase();
    sendRequest(email, password);
    passwordInput.value = '';
    emailInput.value = '';
  }
}

function sendRequest(email, password) {
  $.ajax({
    type: 'POST',
    url: '/login',
    data: { email, password },
    success: function (data) {
      // $('#emailFeed').fadeIn();
      //do something with the data via front-end framework
      if (data.status == 'fail') {
        location.reload();
      } else {
        $(location).attr('href', '/');
      }
    },
  });
}
