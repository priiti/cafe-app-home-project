exports.menu = [
  { slug: '/cafes', title: 'Kohvikud'},
  { slug: '/top', title: 'Top 10'},
  { slug: '/add', title: 'Lisa uus'},
];

exports.dump = (obj) => JSON.stringify(obj, null, 2);

exports.moment = require('moment');