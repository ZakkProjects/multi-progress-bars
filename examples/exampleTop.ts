import { MultiProgressBars } from '../';
import * as chalk from 'chalk';

let timerId: NodeJS.Timeout, timeoutId: NodeJS.Timeout;

const main = async () => {

    const task1 = 'Task 1';
    const task2 = chalk.yellow('Task 2');
    const taskInf = 'Task \u221e';
    const mpb = new MultiProgressBars({
        initMessage: '$ node build-stuff.js',
        anchor: 'top',
        persist: true,
        // border: false,
    });

    (process as NodeJS.Process).on('SIGINT', () => {
        clearInterval(timerId);
        clearTimeout(timeoutId);
        process.exit();
    });

    mpb.addTask(task1, { type: 'percentage', percentage: 0.2, barColorFn: chalk.yellow, message: 'I move slowwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww' });
    mpb.addTask(task2, { type: 'percentage', barColorFn: chalk.blue, message: chalk.blue('I move fasterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr') });
    mpb.addTask(taskInf, { type: 'indefinite', barColorFn: chalk.magenta, message: 'I go forever until stopped' });

    let timerCount = 0;
    timerId = setInterval(() => {
        if (timerCount % 2 === 0) {
            mpb.incrementTask(task1);
            console.log("Console log:", timerCount);
        }
        if (timerCount % 8 === 0) {
            console.log("Long log! ".repeat(20));
        }
        if (timerCount % 16 === 0) {
            console.log("Multiline comment!\nSecond Line\nThird Line");
        }
        mpb.incrementTask(task2);
        timerCount++;
    }, 50);

    timeoutId = setTimeout(() => {
        mpb.done(taskInf);
        timeoutId = setTimeout(() => {
            // or mpb.restart or mpb.addTask with same name;
            mpb.updateTask(taskInf, { message: 'Restarted indefinite task.' });
            timeoutId = setTimeout(() => {
                mpb.done(taskInf);
            }, 3000);
        }, 2000);
    }, 5000);

    await mpb.promise;
    clearInterval(timerId);
    mpb.close();
    console.log("Final Status Message!");
};

const main2 = () => {
    let count = 0;
    timerId = setInterval(() => {
        process.stdout.write(count + '\n' + count + '\n');
        count++
    }, 500);

    timeoutId = setTimeout(() => {
        clearInterval(timerId);
    }, 5000);
};

const main3 = async () => {
    const mpb = new MultiProgressBars({
        initMessage: ' whoa ',
        anchor: 'top',
        persist: true,
        // border: false,
    });

    let count = 0;
    const addTaskTimerId = setInterval(() => {
        const taskName = 'Task ' + count;
        mpb.addTask(taskName, { type: 'percentage', percentage: 0 });
        const innerTimerId = setInterval(() => {
            mpb.incrementTask(taskName, { percentage: 0.05 });
            if (mpb.isDone(taskName)) {
                // mpb.removeTask(taskName);
                clearInterval(innerTimerId);
            }
        }, 100);
        count++;
        if (count == 50) {
            clearInterval(addTaskTimerId);
        }
    }, 500);

    // while (count < 40) {
    //     mpb.addTask('Task ' + count, { type: 'percentage', percentage: 1.0 });
    //     count++;
    // }
    // count = 0;
    // while (count < 40) {
    //     mpb.done('Task ' + count);
    //     count++;
    // }

    // mpb.addTask('Task 40', { type: 'percentage' });
    // timerId = setInterval(() => {
    //     mpb.incrementTask('Task 40', { percentage: 0.01, message: 'A'.repeat(200) });
    // }, 33);
    await mpb.promise;
    // clearInterval(timerId);
    mpb.close();
}

main3();

// main2();

// main();