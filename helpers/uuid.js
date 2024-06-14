//Export a function that generates a random alphanumeric string.


module.exports = () =>
    console.log('uuid made'); 
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);