//Await a Minute! Async/Await and a new syntax for Promises

//The await and async keywords have been added to javascript to indicate asynchronous functions and they have the following effects:
//By adding the async keyword, you make the result of that function a Promise, even if it would normally be completed synchronously.
let returnRandNumAsync = async () => {
    return Math.random()*35;
}
let return35 = () => {
    return Math.random()*35;
}

let asyncAwaitPlayground = () => {
    console.log(returnRandNumAsync());
    console.log(return35());
}
// asyncAwaitPlayground();

//If you try to perform normal operations on the result of an async function, you must remember to treat it as a Promise!
asyncAwaitPlayground = () => {
    let sum = return35() + return35();
    console.log(sum);
    let asyncSum = returnRandNumAsync() + returnRandNumAsync();
    console.log(asyncSum);
}
// asyncAwaitPlayground();

//Because the results of async functions are Promises, you can use a .then block
//PS. remember the order from 03-eventLoop!
asyncAwaitPlayground = () => {
    let res = returnRandNumAsync().then(res => console.log(`This will happen next: ${res}`));
    console.log(`This will happen first ${res}`);
}
// asyncAwaitPlayground();

//However this is eerily reminiscent of the callback hell we wish to avoid.
//If our asynchronous code should be handled synchronously, you should use await!
//Await pauses the event loop that an asynchronous function or Promise is called in until it is resolved or rejected!!
//(Await can only be used in an async function, not in normally declared functions or top-level code)
//This has two huge effects!
//1.) It is a lot clearer to write Promise-based code, without the use of long .then blocks
asyncAwaitPlayground = async () => {
    let res = await returnRandNumAsync();
    console.log(`This will happen first ${res}`);
}
//2.) Because the event loop is halted, an error is handled at its expected place in the call stack!
//It can therefore be caught by a normal try/catch block!
let errorThrowingAsyncFunction = async () => {
    throw new Error('I am an error');
}

asyncAwaitPlayground = async () => {
    try {
        console.log("I'm about to throw an error!");
        await errorThrowingAsyncFunction();
    } catch (e) {
        console.log(`Caught and handled error: ${e.message}`);
    }
}
// asyncAwaitPlayground();

//You can also use a .catch block with or without the await keyword, however non-await code will still execute in that strange callback hell-ish way we don't like
asyncAwaitPlayground = async () => {
    try {
        console.log("1");
        errorThrowingAsyncFunction().catch(e => {
            console.log("3");
        })
        console.log("2");
        await errorThrowingAsyncFunction();
    } catch (e) {
        console.log(`4`);
    }
    console.log('5');
}
// asyncAwaitPlayground();

//For most circumstances, if you are using async/await and try/catch blocks, it's my opinion that it's needlessly confusing to use .catch blocks also.
//However!!! You should be careful to await any async functions you use: an error from an async function will be treated as a Promise rejection!
//Therefore it will log a Promise rejection warning!
asyncAwaitPlayground = async () => {
    try {
        console.log('we will get here');
        errorThrowingAsyncFunction()
        console.log("we will even get here");
    } catch (e) {
        console.log('We will never get here');
    }
}
// asyncAwaitPlayground();

//The await keyword can be applied to any Promise, notably even after it's instantiated!
asyncAwaitPlayground = async () => {
    let p = returnRandNumAsync();
    console.log('P is just a Promise right now: ' + p);
    await p;
    console.log('P but after awaiting it has a value: ' + p);
}
// asyncAwaitPlayground();
//Another counterintuitive behaviour!! The await keyword does not wait for the Promise stored in p to resolve?
//Why is this??

asyncAwaitPlayground = async () => {
    let p = returnRandNumAsync();
    console.log('P is just a Promise right now: ' + p);
    let val = await p;
    console.log('P after awaiting and adding 1 to its value: ' + (p + 1) + '\nBut after assigning its value: ' + val);
}
asyncAwaitPlayground();

// p was actually resolved in the previous example but it is still treated as a Promise as in the console log. 
// However, assigning the awaited Promise to a value will pass the value of the resolved Promise the way we'd expect.
// This final quirk is worth noting if your Promise is awaiting a value as opposed to just the resolution of the Promise.
