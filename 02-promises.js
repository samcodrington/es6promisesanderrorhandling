//PROMISES - A NEW WAY TO HANDLE ASYNC

//Promises are handled slightly differently from normal javascript code by Node
//NodeJs is single-threaded, meaning every line of code is processed by the same thread (as opposed to multi-threaded langauges such as C++, Java, or Go)
//This is by design, and is helpful as it means that a thread of processing power is not wasted idling waiting for a network call. 
//However this means if you design your code poorly, that the entire program is stuck idling if there is nothing given for it to do.
//Promises are treated as a type of object by NodeJs and can be operated on while the promise is pending.
let promiseLand = () => {
    let p = new Promise((resolve, reject) => {
        //resolve after a bit
        setTimeout(resolve, 5);
    });
    console.log(`P stringified is ${p}. Type of p is ${typeof p}`);
};
//promiseLand();

//promises can either be resolved or rejected using handler functions passed to their constructor
promiseLand = () => {
    let p = new Promise((resolve, reject) => {
        //*reject* after a bit
        setTimeout(reject, 5);
    });
    console.log(`P stringified is ${p}. Type of p is ${typeof p}`);
};
//this will fail with an UnhandledPromiseRejectionWarning
// promiseLand(); 

//In order to indicate code intended to be performed after a promise is resolved or rejected, .then() and .catch() blocks are included for every promise
let asyncFuncWithPromises = (rejectMe) => {
    return new Promise((resolve, reject) => {
        rejectMe? setTimeout(reject, 5): setTimeout(resolve, 5);
    });
}
//here is a .then() block in action - indicating a successful Promise completion
promiseLand = () => {
    asyncFuncWithPromises(false).then(() => {
        console.log('Executed after promise is resolved');
    });
}
// promiseLand();
//here is a .catch block in action - indicating a successful Promise rejection
promiseLand = () => {
    asyncFuncWithPromises(true).catch(() => {
        console.log('Executed after promise is rejected');
    });
}
// promiseLand();

//.catch blocks also catch thrown errors like in normal javascript 
let rejectByThrowingError = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            //when timeout is finished throw new error
            throw new Error("From promise");
        }, 5);
    });
} 
promiseLand = () => {
    rejectByThrowingError().catch(() => {
        console.log('Executed after promise is rejected');
    });
}
// promiseLand();

//Wait a second?? If you ran the above code snippet, node fails fail with an error.

//I was being intentionally misleading to illustrate a counterintuitive feauture of promises: they are executed in a seperate call stack than the code that initializes them.
//Ordinarily this quirk of the language could be omitted for most readers but I believe it is worth noting because it can present itself at the worst possible time, during an unexpected error.
//Therefore, I'd like to briefly touch on the event loop of nodeJs