// Add Post Elements
const postTitleBtn = document.getElementById('postTitle');
const postCatBtn = document.getElementById('postCat');
const postBodyBtn = document.getElementById('postBody');
const addPost = document.getElementById('addPost');

addPost.addEventListener('click', function addCategory(e) {
  e.preventDefault();

  let title = postTitleBtn.value;
  let body = postBodyBtn.value;
  let category = postCatBtn.value;

  if (!title) {
    postTitleBtn.classList.add('is-invalid');
  } else {
    postTitleBtn.classList.remove('is-invalid');
  }

  if (!body) {
    postBodyBtn.classList.add('is-invalid');
  } else {
    postBodyBtn.classList.remove('is-invalid');
  }

  if (title && body) {
    postTitleBtn.value = '';
    postBodyBtn.value = '';
    // postTitleBtn.value= "";
    sendRequestPost(title, body, category);
  }
});

function sendRequestPost(tit, bod, cat) {
  $.ajax({
    type: 'POST',
    url: '/posts',
    data: { title: tit, body: bod, category: cat },
    success: function (data) {
      location.reload();
    },
  });
}
