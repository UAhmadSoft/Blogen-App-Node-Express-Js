// Reset Password Buttons
const changeBtn = document.getElementById('changeBtn');
const password1 = document.getElementById('password1');
const password2 = document.getElementById('password2');
const password3 = document.getElementById('password3');
const confirmFeedback = document.getElementById('confirmFeedback');

window.onload = function () {
  try {
    // If any alert exists, then show Modal which contains
    document.getElementById(passAlert);
    $('#togglePasswordModal')[0].click();
  } catch (err) {}
};

changeBtn.addEventListener('click', function reset(e) {
  let err = 0;
  let url;

  let password2Value = password2.value;
  let password3Value = password3.value;

  password2Value.length >= 8
    ? password2.classList.remove('is-invalid')
    : (password2.classList.add('is-invalid'), err++);

  password3Value.length >= 8
    ? password3.classList.remove('is-invalid')
    : (password3.classList.add('is-invalid'), err++);

  const classes = ['border', 'border-danger'];

  let password1Value;
  if (password1) {
    password1Value = password1.value;
    password1Value.length >= 8
      ? password1.classList.remove('is-invalid')
      : (password1.classList.add('is-invalid'), err++);

    url = '/updatePassword';
  } else {
    password1Value = undefined;
    url = location.href;
  }

  if (err < 1) {
    if (password2Value === password3Value) {
      resetPassword(password1Value, password2Value, password3Value, url);
      password2.classList.remove(...classes);
      password3.classList.remove(...classes);
      confirmFeedback.style.display = 'none';
    } else {
      password2.classList.add(...classes);
      password3.classList.add(...classes);
      confirmFeedback.style.display = 'block';
    }
  }
});

function resetPassword(password1, password2, password3, url) {
  $.ajax({
    type: 'PATCH',
    url,
    data: {
      passwordCurrent: password1,
      password: password2,
      passwordConfirm: password3,
    },
    success: function (data) {
      //do something with the data via front-end framework
      if (data.status == 'success') {
        $(location).attr('href', '/login');
      } else {
        document.getElementById('errorAlert').style.display = 'block';
        // location.reload();
      }
    },
  });
}
