const filterBtn = document.getElementById('filterBtn');
const upArrows = document.getElementsByClassName('up');

// Array.from(upArrows).forEach((el) => {
//   el.addEventListener('click', function (e) {
//     // console.log(e.target);
//     let i = e.target.children[0];
//     console.log(e.target.children[0]);

//     console.log(e.target.children[0].style);

//     if (i.style.backgroundColor === 'darkcyan') {
//       console.log('haha');
//       i.style.backgroundColor = 'transparent';
//       i.style.border = '0px solid red';
//       // i.style.border = '0px solid red';
//     } else {
//       i.style.backgroundColor = 'darkcyan';
//       i.style.border = '1px solid';
//       i.style.borderColor = 'currentColor';

//       console.log('hehe');
//     }
//   });
// });

filterBtn.addEventListener('click', function filterResults(e) {
  e.preventDefault();

  let fromYear = document.getElementById('fromYear').value;
  let fromMonth = document.getElementById('fromMonth').value;
  let toYear = document.getElementById('toYear').value;
  let toMonth = document.getElementById('toMonth').value;
  let catFilter = document.getElementById('catFilter').value;
  let postFilter = document.getElementById('postFilter').value;
  let postByBtns = document.querySelectorAll('input[name=postBy]');
  let query = `from=${fromYear},${fromMonth}&to=${toYear},${toMonth}`;

  // console.log(catFilter);
  if (catFilter) {
    query += `&cat=${catFilter}`;
  }
  if (postFilter) {
    query += `&pos=${postFilter}`;
  }

  // Posts By Filer
  let postBy;

  Array.from(postByBtns).forEach((el) => {
    if (el.checked) {
      postBy = el.value;
    }
  });

  if (postBy !== 'all') {
    query += `&postBy=${postBy}`;
  }

  // console.log(postBy);

  // console.log(fromYear, fromMonth, toYear, toMonth);

  // console.log(query);

  $(location).attr('href', `/posts?${query}`);
});
