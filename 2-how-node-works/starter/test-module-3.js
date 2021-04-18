// only loaded once as module only called once
console.log("Hello from module");

// logged 3 times from the cache as the module/file was only called once
module.exports = () => console.log("Log this!!!");
