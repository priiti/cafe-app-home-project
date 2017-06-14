exports.menu = [
    { slug: '/cafes', title: 'Kohvikud'},
    { slug: '/top', title: 'Top'},
    { slug: '/add', title: 'Lisa uus'},
];

exports.dump = data => JSON.stringify(data, null, 2);

exports.moment = require('moment');

exports.flashErrorMessages = {
  noUserRights: 'Sul ei ole õigusi kohvikute lisamiseks'
};