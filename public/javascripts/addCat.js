// Add Category elements
const addBtn = document.getElementById('addCat');
const titleBtn = document.getElementById('title');
const summaryBtn = document.getElementById('summary');

// Functions Definition

function sendRequestCat(tit, sum) {
  $.ajax({
    type: 'POST',
    url: '/categories',
    data: { title: tit, summary: sum },
    success: function (data) {
      location.reload();
    },
  });
}

// function sendRequest(tit, bod, cat) {
//   $.ajax({
//     type: 'POST',
//     url: '/posts',
//     data: { title: tit, body: bod, category: cat },
//     success: function (data) {
//       location.reload();
//     },
//   });
// }

window.onload = function doFirst() {
  const alertBox = document.getElementById('alert');
  if (alertBox) {
    $('#addCatAnchor')[0].click();
    setTimeout(function removeAlert() {
      alertBox.parentNode.removeChild(alertBox);
    }, 6000);
  }
};

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
    sendRequestCat(title, summary);
  }
});
