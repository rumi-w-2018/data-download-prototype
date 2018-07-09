//https://github.com/d-reinhold/async-priority-queue/blob/master/src/async_priority_queue.js
const defer = require('promise-defer');

const AsyncPriorityQueue = (config = {}) => {
    const {debug, maxParallel, processingFrequency} = Object.assign({debug: true, maxParallel: 2, processingFrequency: 30}, config);
    let q = [], interval; //active = []
    const active = {};
    //debug && console.log(`instantiating AsyncPriorityQueue with max parallelism of ${maxParallel} and processingFrequency of ${processingFrequency} ms`);

    const cleanup = (task) => () => {
        //debug && console.log('removing resolved task from the active task list');
        active.splice(active.indexOf(task));
    };

    return {
        start() { interval = setInterval(this.processQueue, processingFrequency); },
        stop() { interval && clearInterval(interval); },
        clear() { q = []; },
        enqueue(task) { q && q.unshift(task) || console.error('Error setting queueing the task'); },
        processQueue() {
            //debug && console.log('processing task queue');
            //debug && console.log('active:', active.length);
            if (active.length <= maxParallel) {
                debug && console.log(`length: ${q.length}`);

                const activeTask = q.pop();
                if (activeTask) {
                    //debug && console.log('executing new task');
                    active.push(activeTask);
                    activeTask.execute().then(cleanup(activeTask), cleanup(activeTask));
                }
            }
        }
    };
};

const AsyncTask = (config = {}) => {

    const {callback} = Object.assign(config);
    const deferred = defer();
    return {
        promise: deferred.promise,
        execute() {
            return callback().then((data) => deferred.resolve(data), (data) => deferred.reject(data));
        }
    };
};

module.exports = {AsyncPriorityQueue, AsyncTask};