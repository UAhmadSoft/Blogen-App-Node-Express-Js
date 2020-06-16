class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  sort() {
    if (this.queryString.sort) {
      // ?sort=date,user
      // sort='date user'
      // console.log(this.queryString);

      let sort = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sort);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  filterByDate() {
    const { from, to } = this.queryString;

    if (from && to) {
      const [fromYear, fromMonth] = from.split(',');
      const [toYear, toMonth] = to.split(',');

      if (fromYear) {
        this.query = this.query.find({
          date: {
            $gte: new Date(`${fromYear}-${fromMonth}-01`),
            $lte: new Date(`${toYear}-${toMonth}-31`),
          },
        });
      } else {
        this.query = this.query.find({
          date: {
            $lte: new Date(`${toYear}-${toMonth}-31`),
          },
        });
      }
    }

    // const posts = await this.query;

    return this;
  }
  async filterByCat() {
    const { cat } = this.queryString;

    const regex = new RegExp(cat, 'g');
    // console.log(cat);
    // console.log(regex);

    // const posts = await this.query.find({
    //   'category.title': 'MERN Stack Development  ',
    // });
    // console.log(posts);

    // this.query = this.query.find({
    //   'category.title': { $regex: /MERN/ },
    //   // {
    //   //   $regex: new RegExp(cat, 'i'),
    //   // },
    // });

    return this;
  }
}

module.exports = APIFeatures;
