// Elements for liking post
const likeBtn = document.getElementById('like');
const postTitle = document.getElementById('postTitle').textContent;
const numlikes = document.getElementById('numLikes');

// Elements for Commenting post
const commentBody = document.getElementById('commentBody');
const commentBtn = document.getElementById('commentBtn');
const commentsSec = document.getElementById('commentsSec');
const numComments = document.getElementById('numComments');

// Elements for deleting Comment
let delComment = Array.from(document.getElementsByClassName('delComment'));
delComment.forEach((el) => {
  el.addEventListener('click', function deleteComment(e) {
    e.preventDefault();
    let commentId = el.children[1].textContent.trim();

    sendDeleteCommentReq(commentId);
  });
});

// Element for deleting Post
const delPost = document.getElementById('delPost');

var socket = io.connect('ws://localhost:3000', { transports: ['websocket'] });

socket.on('connect', () => {
  console.log('connected');
  console.log(socket.id);
});

socket.on('broadcast', function (data) {
  console.log('broad cast received here');
});
socket.on('commentMade', function (data) {
  console.log(' Comment made broad cast received here');
});

socket.on('comment', function (data) {
  // console.log(data);
  if (data.socketId === socket.id) {
    console.log('this is sender');
  } else {
    console.log('this is NOT sender');
  }
  let condition;
  const email = document.getElementById('email').innerText;
  if (data.author === email) {
    // Add Comment
    condition =
      `<button class="btn-danger btn btn-sm delComment">
                  Delete Comment <i class="fas fa-trash"></i>
                    <span class="sr-only">` +
      `${data.id}` +
      `</span>
                </button>`;
  } else {
    condition = ``;
  }
  commentsSec.classList.remove('sr-only');
  // Making new Comment Element
  var newComment = htmlToElement(
    `<div class="row my-0 py-0" id="${data.id}">
          <div class="col-md-6 py-3">
            <div class="card" style="background: #2effab;">
              <div class="card-header">
                <i class="fas fa-user"></i>` +
      `${data.user}` +
      `</div>
              <div class="card-body">
                <p class="card-text"> ` +
      `${data.comment}` +
      `</p>
              </div>
              <div
                class="card-footer text-muted d-flex justify-content-between align-items-start"
              >
                <div>
                 ` +
      `${data.date}` +
      `
                </div>

               ` +
      `${condition}` +
      `
              </div>
            </div>
          </div>
        </div>`
  );

  commentsSec.appendChild(newComment);
  if (data.author === true) {
    let delBtn = commentsSec.getElementsByClassName('delComment')[
      delComment.length
    ];
    delBtn.addEventListener('click', function deleteComment(e) {
      e.preventDefault();
      let commentId = delBtn.children[1].textContent.trim();

      sendDeleteCommentReq(commentId);
    });
  }

  // Change no of COmments
  numComments.innerHTML = ` ${data.comments} Comments`;
});

socket.on('postDeleted', (data) => {
  if (socket.id !== data.socketId) {
    // receiver
    $(location).attr('href', '/posts');
  }
});

socket.on('likedPost', function (data) {
  const liked = document.getElementById('like');
  console.log('like is ', data.like);
  const email = document.getElementById('email').innerText;
  // Only toogle button of use who click it
  console.log('email is', email);
  console.log('data.email is', data.email);
  if (email == data.email) {
    // Toggle Like Button
    if (data.like === false) {
      console.log('making thumb up');
      liked.innerHTML = `Like  <i class="fa fa-thumbs-up pl-2"></i>`;
    } else {
      console.log('making thumb down');
      liked.innerHTML = `UnLike  <i class="fa fa-thumbs-down pl-2"></i>`;
    }
  }

  // Change No of likes
  numlikes.innerHTML = `${data.likes} Likes`;
});

socket.on('commentDeleted', function (data) {
  // Delete deleted comment
  const deletedComment = document.getElementById(`${data.id}`);
  console.log('deleted comment is', deletedComment);

  deletedComment.parentNode.removeChild(deletedComment);
  // Change no of COmments
  numComments.innerHTML = ` ${data.comments} Comments`;
});

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
    data: { socketId: socket.id },
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

commentBtn.addEventListener('click', function commentPost(e) {
  // e.preventDefault();

  let comment = commentBody.value;
  let err = 0;

  comment.length < 1
    ? (commentBody.classList.add('is-invalid'), (err = 1))
    : (commentBody.classList.remove('is-invalid'), (err = 0));

  if (err === 0) {
    commentBody.value = '';
    sendCommentRequest(comment);
  }
});

likeBtn.addEventListener('click', function likePost(e) {
  e.preventDefault();
  // console.log(postTitle);

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
        // location.reload();
      } else {
        // location.reload();
        // $(location).attr('href', '/categories');
      }
    },
  });
}

function sendCommentRequest(comment) {
  const urlLike = $(location).attr('href');
  $('#commentModal').modal('hide');
  $.ajax({
    type: 'POST',
    url: urlLike + '/comment',
    data: { comment, socketId: socket.id },
    success: function (data) {
      if (data.status == 'fail') {
        // location.reload();
      } else {
        // location.reload();
        // $(location).attr('href', '/categories');
      }
    },
  });
}

function sendDeleteCommentReq(id) {
  const postIdUrl = $(location).attr('href').split('/')[4];
  const urlLike = $(location).attr('href');
  $.ajax({
    type: 'DELETE',
    // url: urlLike + '/comment',
    url: 'comments/' + id,
    data: { postId: postIdUrl },
    success: function (data) {
      if (data.status == 'fail') {
        // location.reload();
      } else {
        // location.reload();
        // $(location).attr('href', '/categories');
      }
    },
  });
}

function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}
