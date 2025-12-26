
const arrCon = document.getElementById("array_container");

const sortBtn = document.getElementById("sort");
const resetBtn = document.getElementById("reset");
const pauseBtn = document.getElementById("pause");
const parallelBtn = document.getElementById("parallel");

const mergeBtn = document.getElementById("merge");
const quickBtn = document.getElementById("quick");
const heapBtn = document.getElementById("heap");
const bubbleBtn = document.getElementById("bubble");
const selectionBtn = document.getElementById("selection");

const speed_slider = document.getElementById("speed_slider");
const arrLen = document.getElementById("arrLen");

class Animations {
    constructor() {
        this.steps = [];
    }
    compare(i, j) {
        this.steps.push({
            type: "compare",
            indices: [i, j]
        });
    }
    overwrite(i, value) {
        this.steps.push({
            type: "overwrite",
            indices: [i],
            values: [value]
        });
    }
    swap(i, j) {
        this.steps.push({
            type: "swap",
            indices: [i, j]
        });
    }
}
let animations = new Animations();

let array = [];
let arrlen = 100;
let speed = speed_slider.value;
let isPaused = false;
let isSorting = false;

function resetArray() {
    animations.steps = [];
    array.length = 0;

    const min = 10;
    const max = 450;
    const step = (max - min) / (arrlen - 1);

    for (let i = 0; i < arrlen; i++) {
        array.push(Math.round(min + i * step));
    }
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    console.log(array);
}

function renderBars(arr) {
    arrCon.innerHTML = "";

    arr.forEach(value => {
        const bar = document.createElement("div");
        bar.style.height = (value) + "px";
        bar.style.width = ((1050 / arrlen) - 2) + "px";
        bar.classList.add("bar");
        arrCon.appendChild(bar);
    });
}

async function runSort(sortFn, btn) {
    if (isSorting) return;

    btn.style.borderColor = "#4d50ff"
    animations.steps = [];
    isPaused = false;

    const result = sortFn(array);
    await playAnimations(speed, result);

    btn.style.borderColor = "#333333";
}

async function playAnimations(speed, result) {
    const bars = document.getElementsByClassName("bar");

    isSorting = true;
    isPaused = false;
    for (const step of animations.steps) {
        if (!isSorting) break;
        while (isPaused) {
            await sleep(25);
        }
        if (step.type === "compare") {
            const [i, j] = step.indices;
            bars[i].style.backgroundColor = "white";
            bars[j].style.backgroundColor = "white";

            await sleep(speed);

            bars[i].style.backgroundColor = "#ff4da6";
            bars[j].style.backgroundColor = "#ff4da6";
        }

        if (step.type === "overwrite") {
            const [i] = step.indices;
            const value = step.values[0];

            bars[i].style.height = value + "px";

            await sleep(speed);
        }

        if (step.type === "swap") {
            const [i, j] = step.indices;
            let temp = bars[i].style.height;
            bars[i].style.height = bars[j].style.height;
            bars[j].style.height = temp;

            await sleep(speed);
        }
    }

    if (isSorting) {
        let i = 0;
        for (let bar of bars) {
            const barValue = parseInt(bar.style.height);
            if (barValue == result[i++])
                bar.style.backgroundColor = "green";
            await sleep(15);
        }
    }else return;
}

function stopAnimations() {
    isPaused = false;
    pauseBtn.textContent = "Pause"
    isSorting = false;
    animations.steps = [];
}

function sleep() {
    return new Promise(resolve => setTimeout(resolve, speed));
}

sortBtn.addEventListener("click", () => {
    document.body.classList.add("active");
    resetArray();
    renderBars(array);
});

parallelBtn.addEventListener("click", () => {
    //make six diff containers with maybe 10 20 bars and each show diff sorting types
});

resetBtn.addEventListener("click", () => {
    stopAnimations();
    resetArray();
    renderBars(array);
    pauseBtn.style.borderColor = "#333333";
});

pauseBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    //console.log(isPaused);
    if (isPaused) {
        pauseBtn.textContent = "Resume";
        pauseBtn.style.borderColor = "#4d50ff";
    } else {
        pauseBtn.textContent = "Pause";
        pauseBtn.style.borderColor = "#333333";
    }
});

mergeBtn.addEventListener("click", () => runSort(mergeSort, mergeBtn));
bubbleBtn.addEventListener("click", () => runSort(bubbleSort, bubbleBtn));
quickBtn.addEventListener("click", () => runSort(quickSort, quickBtn));
selectionBtn.addEventListener("click", () => runSort(selectionSort, selectionBtn));
heapBtn.addEventListener("click", () => runSort(heapSort, heapBtn));

speed_slider.addEventListener("input", () => {
    speed = (251 - speed_slider.value);
    // console.log("Speed: " + speed + "ms");
});

arrLen.addEventListener("input", () => {
    if (arrLen.value <= 475)
        arrlen = arrLen.value;
    else alert("Under 475 please!");
    resetArray();
    renderBars(array);
});
