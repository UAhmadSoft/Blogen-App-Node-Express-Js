// Elements for liking post
const likeBtn = document.getElementById('like');
const postTitle = document.getElementById('postTitle').textContent;

// Elements for Commenting post
const commentBody = document.getElementById('commentBody');
const commentBtn = document.getElementById('commentBtn');

// Elements for deleting Comment
const delComment = document.getElementsByClassName('delComment');

// Element for deleting Post
const delPost = document.getElementById('delPost');

if (delPost) {
  delPost.addEventListener('click', function () {
    // e.preventDefault();
    deletePost();
  });
}

function deletePost() {
  const urlLike = $(location).attr('href');
  $.ajax({
    type: 'DELETE',
    url: urlLike,
    data: {},
    success: function (data) {
      if (data.status == 'fail') {
        // location.reload();
        $(location).attr('href', '/posts');
      } else {
        // location.reload();
        $(location).attr('href', '/posts');
      }
    },
  });
}

Array.from(delComment).forEach((el) => {
  el.addEventListener('click', function deleteComment(e) {
    e.preventDefault();
    let commentId = el.children[1].textContent.trim();
    sendDeleteCommentReq(commentId);
  });
});

commentBtn.addEventListener('click', function commentPost(e) {
  // e.preventDefault();

  console.log('====================================');
  console.log('hrrrrr');
  console.log('====================================');
  let comment = commentBody.value;
  let err = 0;

  comment.length < 1
    ? (commentBody.classList.add('is-invalid'), (err = 1))
    : (commentBody.classList.remove('is-invalid'), (err = 0));

  if (err === 0) {
    sendCommentRequest(comment);
  }
});

likeBtn.addEventListener('click', function likePost(e) {
  e.preventDefault();
  console.log(postTitle);

  //   toggleAppearance();
  sendRequest(postTitle);
});

function toggleAppearance() {
  likeBtn.innerHTML.startsWith('Like')
    ? (likeBtn.innerHTML = 'Unlike <i class="fa fa-thumbs-down pl-2"></i>')
    : (likeBtn.innerHTML = 'Like <i class="fa fa-thumbs-up pl-2"></i>');
}

function sendRequest(postTitle) {
  const urlLike = $(location).attr('href');
  $.ajax({
    type: 'PATCH',
    url: urlLike + '/like',
    data: { title: postTitle, like: true },
    success: function (data) {
      if (data.status == 'fail') {
        location.reload();
      } else {
        location.reload();
        // $(location).attr('href', '/categories');
      }
    },
  });
}

function sendCommentRequest(comment) {
  const urlLike = $(location).attr('href');
  $.ajax({
    type: 'POST',
    url: urlLike + '/comment',
    data: { comment },
    success: function (data) {
      if (data.status == 'fail') {
        location.reload();
      } else {
        location.reload();
        // $(location).attr('href', '/categories');
      }
    },
  });
}

function sendDeleteCommentReq(id) {
  const urlLike = $(location).attr('href');
  $.ajax({
    type: 'DELETE',
    // url: urlLike + '/comment',
    url: 'comments/' + id,
    data: {},
    success: function (data) {
      if (data.status == 'fail') {
        location.reload();
      } else {
        location.reload();
        // $(location).attr('href', '/categories');
      }
    },
  });
}
