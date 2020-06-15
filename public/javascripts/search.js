const searchBtn = document.getElementById('searchBtn');
const elements = document.getElementById('searchBody').children;

searchBtn.addEventListener('keyup', handleSearch);

function handleSearch(e) {
   let searchTxt = searchBtn.value.toLowerCase();

   Array.from(elements).forEach((el) => {
      let eleText = el.children[1].innerText.toLowerCase();
      // console.log(eleText);

      // remove that post whose search NOT Matches
      if (eleText.indexOf(searchTxt) == -1) {
         el.style.display = 'none';
      } else {
         el.style.display = '';
      }
   });
}
