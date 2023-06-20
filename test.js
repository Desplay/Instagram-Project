const bcrypt = require('bcrypt');
const saltRounds = 10;

const myPlaintextPassword = 'abcdef';

const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, salt);

console.log(bcrypt.compareSync(myPlaintextPassword, hash));
