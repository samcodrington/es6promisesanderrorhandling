//THE LAND BEFORE PROMISES - CALLBACKS
//Before promises, callbacks passed as function parameters were a way for asynchronous operations to indicate their completion.
let asyncFunc = (serviceName, cb) => {
    let latency = Math.random() * 1000;
    console.log(`${serviceName} begun`);
    //setTimeout is being used to mimic network call
    setTimeout(() => {
        console.log(`${serviceName} completed`);
        cb();
    }, latency);
}

//this led to the annoyance termed "callback hell" where it became disorganized and difficult to determine which callback belonged where.
let callbackHell = () => {
    console.log('Start of callback hell');
    //start a server
    asyncFunc('Start Server', () => {
        //once server has been started call three backend services sequentially
        asyncFunc('Call Service 1', () => {
            asyncFunc('Call Service 2', () => {
                asyncFunc('Call Service 3', () => {
                  console.log('Services called!'); 
                })
            });
        });
    });
}
//callbackHell();

//this simple case is hugely exacerbated if there is any synchronous work done
callbackHell = () => {
    console.log('Start of callback hell');
    //start a server
    asyncFunc('Start Server', () => {
        console.log('2')
        //once server has been started call three backend services sequentially
        asyncFunc('Call Service 1', () => {
            console.log('4');
            asyncFunc('Call Service 2', () => {
                console.log('6');
                asyncFunc('Call Service 3', () => {
                
                    console.log('8'); 
                });
                console.log('7');
            });
            console.log('5');
        });
        console.log('3')
    });
    console.log('this will run first of all?? Starting with 1')
};
//callbackHell();

//never mind the counterintuitive behaviour if calls are executed at the same time (as they ought to be to avoid wasted CPU time!)
callbackHell = () => {
    console.log('start of callback hell');
    //start a server
    asyncFunc('Start Server', () => {
        //once server has been started call three backend services in parallel
        asyncFunc('Call Service 1', () => {
            console.log('Now work can be done on the results of the call to Service 1');
        });
        asyncFunc('Call Service 2', () => {
            console.log('Now work can be done on the results of the call to Service 2');
        });
        asyncFunc('Call Service 3', () => {
            console.log('Now work can be done on the results of the call to Service 3');
        });
    });
    console.log('This code will run before despite being written at the end!');
}

callbackHell();

//this sort of disorgnization makes maintenance and debugging difficult to do, and so to avoid this problem, promises were introduced in ES6 //TODO Check the version