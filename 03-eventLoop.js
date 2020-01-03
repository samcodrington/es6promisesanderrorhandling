//A BRIEF LOOK AT THE NODE EVENT LOOP 
//Node, as I've noted previously, is a single threaded langauge.

//Node executes all the lines of code it has available to it in order during the **TODO insert phase** of the event loop.
let eventLoop = () => {
    console.log('statement 1');
    console.log('statement 2');
    console.log('statement 3... all in order');
}
// eventLoop();

//Synchronously executed code, therefore, will have a (relatively) neat call stack. 
//Look at the top lines of the error stack logged by this code, you can see the line (and column) of where the error was thrown!
let errorFunc = () => {throw new Error('I have a call stack that makes sense!')};
eventLoop = () => {
    console.log('Start event loop');
    try {
        errorFunc();
    } catch(e) {
        console.log('Caught error: ' + e.message + '\nCall Stack:\n' + e.stack);
    }
}
// eventLoop();


//This is especially helpful in the case of debugging code that throws an error and is caught by the function calling it
//This call stack persists however deeply an error is nested in the code
eventLoop = () => {
    console.log('Start event loop');
    let funcA = () => {
        console.log('do stuff');
        funcB();
    }
    let funcB = () => {
        console.log('Do more stuff');
        funcC();
    }
    let funcC = () => {
        console.log('fail with an error');
        throw new Error();
    }
    
    try {
        funcA();
    } catch(e) {
        console.log('Caught error: ' + e.message + '\nCall Stack:\n' + e.stack);
    }
}
// eventLoop();

//It is worth noting that the error is not caught if you wrap the instantiation of the function in try/catch
eventLoop = () => {
    try {
        let funcA = () => {
            console.log('do stuff');
            funcB();
        }
        let funcB = () => {
            console.log('Do more stuff');
            funcC();
        }
        let funcC = () => {
            console.log('fail with an error');
            throw new Error();
        }
    } catch(e) {
        // We will never reach this code
        console.log('Handling error!');
    }
    
    
    funcA(); //This will fail
}
// eventLoop();

//It is also practical to know that try/catch blocks will not catch a rejected promise.
eventLoop = () => {
    try{
        Promise.reject(); //Promise.reject() creates then immediately rejects a promise
    } catch(e){
        // We will never reach this code
        console.log('Handling error!');
    }
}
// eventLoop(); //this will fail with an UnhandledPromiseRejectionWarning

//The UnhandledPromiseRejectionWarning log that NodeJs provides is a symptom which is very unhelpful at describing the source of the error (Not what you want during a production error).
//Node can only tell you that a promise was rejected, not where it originated from.
//This is because //TODO why is this??

//Try/Catch blocks will also do nothing to catch asynchronous code, as illustrated by setTimeout();
let asyncFuncThatThrowsError = () => {
    setTimeout(() => {throw new Error('HI')}, 5);
}
eventLoop = () => {
    try {
        asyncFuncThatThrowsError();
    } catch(e) {
        // We will never reach this code
        console.log("Handling error!")
    }
}
// eventLoop();

//This is because SetTimeout (and more importantly, Promises handlers) are executed in a seperate *call stack* //TODO check that call stack is the right term
//Basically when an asynchronous call is executed, it leaves a little note for the nodeJs engine that it has more code to run... eventually, and that the engine should execute any other available code in the meantime.
//When the call is resolved the node engine will trigger a hook, indicating it will execute the code in that promise handler or callback function as soon as it's done executing available code.

let asyncFuncThatEventuallyResolves = () => {
    return new Promise((resolve) => {
        let startTime = new Date();
        setTimeout(() =>{
            console.log('The promise is now resolved');
            resolve(startTime); //this returns the value of the startTime to the promise
        }, 30);
    });
}
eventLoop = () => {
    console.log('Started!')
    let p = asyncFuncThatEventuallyResolves().then(() => {
        console.log('the promise resolved and the .then block executed');
    });
    console.log('This will run in the meantime');
}
// eventLoop();


//As an aside this hook is only run one NodeJs runs out of synchronous code it is expected to execute, see what happens with the while loop is being executed
eventLoop = () => {
    let i = 0;
    var exitCondition = false;
    console.log('Promise started')
    let p = asyncFuncThatEventuallyResolves().then((startTime) => {
        console.log('The .then block is executed!')
        exitCondition = true;
        console.log(`Took ${new Date() - startTime}ms for the promise to resolve, because the while loop was keeping the engine busy`);
    });
    console.log('This code will run while the promise is still pending: ' + p);
    while(exitCondition == false && i < 50000000) {
        i++;
    }
    console.log(`The while loop counted to ${i}!`);
    console.log(p); //Promise { <pending> }
    console.log('Now that the engine has run out of code, the promise will now resolve');
}
// eventLoop();

//Because asynchronous code is executed on a different call stack then where it is called this can lead to a very unhelpful stack trace 
let asyncFuncThatRejectsAfterRandomAmountOfTime = () => {
    return new Promise((resolve,reject) => {
        let randTime = Math.random()*1000;
        let string = [];
        setTimeout(() => {
            string.split();
        }, randTime);
    });
}

eventLoop = () => {
    let funcA = () => {
        try {
            console.log('Run Async A');
            asyncFuncThatRejectsAfterRandomAmountOfTime();
        } catch(e) {
            // We will never reach this code
            console.log('Handling error from Async A!');
        }
    }
    let funcB = () => {
        try {
            console.log('Run Async B');
            asyncFuncThatRejectsAfterRandomAmountOfTime();
        } catch(e) {
            // We will never reach this code
            console.log('Handling error from Async B!');
        }
    }
    let funcC = () => {
        try {
            console.log('Run Async C');
            asyncFuncThatRejectsAfterRandomAmountOfTime();
        } catch(e) {
            // We will never reach this code
            console.log('Handling error from Async C!');
        }
    }
    try{
        funcA();
        funcB();
        funcC();
    } catch(e) {
        // We will never reach this code
        console.log('Handling error from one of the async calls!');
    }
    
}
// eventLoop(); //this will fail with a console log similar to the following
/*
$ node 03-eventLoop.js
Run Async A
Run Async B
Run Async C
C:\dev\projects\es6PromisesErrorHandling\03-eventLoop.js:154
            string.split();
                   ^

TypeError: string.split is not a function
    at Timeout._onTimeout (C:\dev\projects\es6PromisesErrorHandling\03-eventLoop.js:154:20)
    at listOnTimeout (internal/timers.js:531:17)
    at processTimers (internal/timers.js:475:7)
*/

//the call stack that is listed skips right to the error and doesn't tell us whether call A, B or C failed
//See the following case where an error is thrown due to a string being passed to a function expecting an array
let getLengthFromObject = (obj) => {
    let rand = Math.random() * 1000;
    return new Promise((resolve,reject) => {
        setTimeout(() => { resolve(obj.arr[4].length)},rand);
    });
};

eventLoop = () => {
    let obj1 = {
        arr: [1,2,3,4]
    };
    let obj2 = {
        arr: {
            4: 'string'
        }
    }
    let obj3 = {
        Arr: {
            4: {
                length: null
            }
        } 
    }
    try {
        //none of the catch blocks do anything
        getLengthFromObject(obj1).catch((e) => console.log('1 failed due with' + e.message));
        getLengthFromObject(obj2).catch((e) => console.log('2 failed due with' + e.message));
        getLengthFromObject(obj3).catch((e) => console.log('3 failed due with' + e.message));
    } catch(e) {
        //this won't help you either
        console.log('1, 2 or 3 failed with ' + e.message);
    }
    
}
// eventLoop();
//Which call failed??
//It is in exactly these kind of unexpected errors that NodeJS's event loop doesn't help you!