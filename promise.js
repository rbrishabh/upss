const promise = new Promise(function (resolve, reject) {
    var no = Math.random();
    console.log(no);

        resolve(10);
        resolve(20);


});

console.log('Before Promise')
promise.then(console.log).catch(console.log);
console.log('After Promise')










