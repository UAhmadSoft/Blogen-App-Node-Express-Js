const addBtn = document.getElementById('addCat');
const delBtn = document.getElementById('delCat');
const titleBtn = document.getElementById('title');
const summaryBtn = document.getElementById('summary');

window.onload = function doFirst() {
  const alertBox = document.getElementById('alert');
  if (alertBox) {
    $('#addCatAnchor')[0].click();
    setTimeout(function removeAlert() {
      alertBox.parentNode.removeChild(alertBox);
    }, 4000);
  }
};

delBtn.addEventListener('click', function delCategory(e) {
  var url = window.location.pathname.split('/');
  // console.log(url);
  var id = url[2];

  sendDeleteRequest(id);
});

addBtn.addEventListener('click', function addCategory(e) {
  e.preventDefault();

  let title = titleBtn.value;
  let summary = summaryBtn.value;

  if (!title) {
    titleBtn.classList.add('is-invalid');
  } else {
    titleBtn.classList.remove('is-invalid');
  }

  if (!summary) {
    summaryBtn.classList.add('is-invalid');
  } else {
    summaryBtn.classList.remove('is-invalid');
  }

  if (title && summary) {
    var url = window.location.pathname.split('/');
    // console.log(url);
    var id = url[2];

    sendUpdateRequest(title, summary, id);
  }
});

function sendUpdateRequest(tit, sum, id) {
  $.ajax({
    type: 'PATCH',
    url: '/categories',
    data: { title: tit, summary: sum, id },
    success: function (data) {
      //  $('#emailFeed').fadeIn();
      //  $('#divResults').empty().append(data);
      //  alert('data');
      //do something with the data via front-end framework
      // if (data.status == 'fail') {
      location.reload();
      // } else {
      // }
    },
  });
}

function sendDeleteRequest(id) {
  $.ajax({
    type: 'DELETE',
    url: '/categories',
    data: { id },
    success: function (data) {
      if (data.status == 'fail') {
        location.reload();
      } else {
        $(location).attr('href', '/categories');
      }
    },
  });
}
