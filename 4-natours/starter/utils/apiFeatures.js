class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1. Filtering
    const queryObj = { ...this.queryString }; // create shallow copy
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // Loop over obj and deleted excluded fields
    excludedFields.forEach((el) => delete queryObj[el]);

    console.log(this.queryString, queryObj);

    // ADVANCED FILTERING - add $ in front for mongoose filtering
    let queryStr = JSON.stringify(queryObj);
    // regex to find "gte, gt, lte, lt"
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this; // we need to return this otherwise we can not chain other methods like sort()
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = +this.queryString.page || 1; // or default value: page 1
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;
    // page=2&limit=10 page1: 1-10, page2: 11-20...
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
