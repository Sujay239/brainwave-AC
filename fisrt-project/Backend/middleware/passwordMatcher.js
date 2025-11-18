const bcrypt = require('bcrypt');

const passwordMatcher = (async (raw,hash) => {
       await bcrypt.compare(raw, hash) ? true : false;
});

module.exports = passwordMatcher;