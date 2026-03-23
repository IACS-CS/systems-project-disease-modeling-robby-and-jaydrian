/* Main game file: main.js */
/* Game: [Your Game Name Here] */
/* Authors: Robby and Jaydrien */
/* Description: [Quarantine Simulation] */
/* Citations: [List any resources, libraries, tutorials, etc you used here] */
/* AI used in creating the graph and probability events.*/
/* Mark AI-generated sections: // AI-generated: ... // end AI-generated   */

import "./style.css";
import { GameInterface } from "simple-canvas-library";

let gi = new GameInterface();

/* --- STATE ------------------------------------------------------------ */

let infectionRate = 0.5;
let quarantineRate = 0.65;
let quarantine = 0;
let population = [];
let roundCount = 0;
let infectedPerRound = [];
let quarantinedPerRound = [];

/* --- SIMULATION LOGIC -------------------------------------------------
 *
 * Write functions to update your population each round.
 * Your CREATE task function must have a parameter that affects
 * its behavior, sequencing, selection (if/else), iteration (loop),
 * and an explicit call with arguments somewhere in your code.
 *
 * --- NOTEWORTHY -------------------------------------------------
 *  goodPerson is a boolean that determines whether an infected person will quarantine, and therefore, not get anyone else sick.
 * bad people will not quarantine, so they risk infecting others.
 * --- COLOR LEGEND -------------------------------------------------
 *   - Green: Healthy person
 *   - Red: Infected person
 *   - Gray: Infected person who is quarantining
 */

//repeat until higher then inital population
function generatePopulation(size) {
  // YOUR CODE HERE
  // Example: create an array of "person" objects with random positions
  population = [];
  infectedPerRound = [];
  quarantinedPerRound = [];
  roundCount = 0;

  let gridDist = 5;
  if (size > 380) {
    gridDist = 2;
  }
  const perRow = 100 / gridDist;
  for (let i = 0; i < size; i++) {
    // repeat size times...
    let x = (i % perRow) * gridDist + gridDist / 2;
    let y = Math.floor(i / perRow) * gridDist + gridDist / 2;
    // add to the population
    let goodPerson = Math.random() < quarantineRate;
    if (i < 1) {
      goodPerson = false; // first person will never be a good person, they are the patient zero
    }
    population.push({
      x,
      y,
      goodPerson,
      exposed: false,
      infected: i < 1 /* only the first person is infected */,
    });
  }
}
// Code to update the population each round goes here. goodPerson chance and infection chance update every round
function nextRound() {
  // YOUR CODE HERE
  for (let person of population) {
    if (person.infected && !person.goodPerson) {
      // this person is infected and not quarantining, so they can infect others
      for (let other of population) {
        if (!other.infected) {
          // this other person is healthy, so they can get infected
          let distance = Math.hypot(person.x - other.x, person.y - other.y);
          if (distance < 10) {
            // this other person is close enough to get infected
            if (Math.random() < infectionRate) {
              other.exposed = true; // mark them as exposed
            }
          }
        }
      }
    }
  }
  for (let person of population) {
    if (person.exposed) {
      person.infected = true; // they become infected
      person.exposed = false; // reset exposed status
    }
  }
}
/* --- DRAWING CODE BELOW --- */

/* --- COORDINATE HELPER ------------------------------------------------
 *
 * Positions in your simulation are "percent coordinates": x and y
 * run from 0 to 100, where (0,0) is the top-left of any region.
 * percentToPixels() converts those to actual canvas pixels for a
 * given bounds object: { top, bottom, left, right }
 *
 * Examples (bounds = { top:0, bottom:400, left:0, right:800 }):
 *   percentToPixels(  0,   0, bounds) --> { x:   0, y:   0 }
 *   percentToPixels(100, 100, bounds) --> { x: 800, y: 400 }
 *   percentToPixels( 50,  50, bounds) --> { x: 400, y: 200 }
 *
 * @param {number} x
 * @param {number} y
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 * @returns {{x:number, y:number}}
 */
function percentToPixels(x, y, bounds) {
  return {
    x: bounds.left + (x / 100) * (bounds.right - bounds.left),
    y: bounds.top + (y / 100) * (bounds.bottom - bounds.top),
  };
}

/* --- DRAWING: SIMULATION ----------------------------------------------
 *
 * Draw your agents inside the simulation area.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 * @param {number} elapsed - ms since simulation started
 */
function drawSimulation(ctx, bounds, elapsed) {
  // Draw a border around the simulation area...
  let topLeft = percentToPixels(0, 0, bounds);
  let bottomRight = percentToPixels(100, 100, bounds);
  ctx.strokeStyle = "orange";
  ctx.lineWidth = 2;
  ctx.strokeRect(
    topLeft.x,
    topLeft.y,
    bottomRight.x - topLeft.x,
    bottomRight.y - topLeft.y,
  );

  // Example: utility function to draw a person as a circle
  function drawPerson(person) {
    let { x, y } = percentToPixels(person.x, person.y, bounds);
    if (person.infected) {
      // infected people are red, healthy people are green
      if (person.goodPerson) {
        ctx.fillStyle = "gray";
      } else {
        ctx.fillStyle = "red";
      }
    } else {
      ctx.fillStyle = "green";
    }
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Now we draw some people...
  // (in your real code you'll replace this with a loop)
  // like...
  for (let person of population) {
    drawPerson(person);
  }

  // YOUR CODE HERE
}

/* --- DRAWING: GRAPH ---------------------------------------------------
 *
 * Draw a bar chart in the graph area.
 * infectedData[] and quarantinedData[] are lists of values by round.
 * dataMax is the largest possible value (e.g. population.length).
 *
 * This is a good CREATE task candidate -- try calling it with
 * fake data to see how changing the arguments changes the output.
 * @param {number} dataMax
 * @param {CanvasRenderingContext2D} ctx
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 */
function drawGraph(infectedData, quarantinedData, dataMax, ctx, bounds) {
  // Axes
  let topLeft = percentToPixels(0, 0, bounds);
  let bottomLeft = percentToPixels(0, 100, bounds);
  let bottomRight = percentToPixels(100, 100, bounds);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(bottomLeft.x, bottomLeft.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.stroke();


  if (infectedData.length === 0) return;
  let numRounds = infectedData.length;
  let barWidth = (bounds.right - bounds.left) / (numRounds * 2);
  let height = bounds.bottom - bounds.top;
  for (let i = 0; i < numRounds; i++) {
    let infectedPct = (infectedData[i] / dataMax) * 100;
    let quarantinedPct = (quarantinedData[i] / dataMax) * 100;
    let x1 = bounds.left + i * 2 * barWidth;
    let x2 = x1 + barWidth;
    let infectedHeight = (infectedPct / 100) * height;
    ctx.fillStyle = "red";
    ctx.fillRect(x1, bounds.bottom - infectedHeight, barWidth, infectedHeight);
    let quarantinedHeight = (quarantinedPct / 100) * height;
    ctx.fillStyle = "gray";
    ctx.fillRect(
      x2,
      bounds.bottom - quarantinedHeight,
      barWidth,
      quarantinedHeight,
    );
  }

}

/* --- DRAWING: HUD -----------------------------------------------------
 *
 * Optional text overlay. Delete if you don't need it.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
function drawHUD(ctx, width, height) {
  // YOUR CODE HERE
  ctx.textAlign = "left";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "red";
  let text = `Simulation - Infection Rate: ${infectionRate.toFixed(2)}`;
  ctx.font = "16pt sans-serif";
  ctx.strokeText(text, 15, 25);
  ctx.fillText(text, 15, 25);
}

/* --- REGISTERED DRAWING CALLBACKS -------------------------------------
 * You shouldn't need to change these.
 * Adjust the bounds values if you want to resize the regions.
 */

gi.addDrawing(function ({ ctx, width, height, elapsed }) {
  let simBounds = {
    top: 30,
    bottom: height / 2 - 10,
    left: 10,
    right: width - 10,
  };
  drawSimulation(ctx, simBounds, elapsed);
});

gi.addDrawing(function ({ ctx, width, height }) {
  let graphBounds = {
    top: height / 2 + 10,
    bottom: height - 50,
    left: 50,
    right: width - 50,
  };
  drawGraph(
    infectedPerRound,
    quarantinedPerRound,
    population.length,
    ctx,
    graphBounds,
  );
});

gi.addDrawing(function ({ ctx, width, height }) {
  drawHUD(ctx, width, height);
});

/* --- CONTROLS --------------------------------------------------------- */

let topBar = gi.addTopBar();

topBar.addButton({
  text: "Next Round",
  onclick: function () {
    nextRound();
    roundCount += 1;
    let infectedCount = 0;
    let quarantinedCount = 0;
    for (let person of population) {
      if (person.infected) {
        infectedCount++;
        if (person.goodPerson) {
          quarantinedCount++;
        }
      }
    }
    infectedPerRound.push(infectedCount);
    quarantinedPerRound.push(quarantinedCount);
  },
});

topBar.addSlider({
  label: "Infection Rate",
  min: 0,
  max: 1,
  step: 0.01,
  value: infectionRate,
  oninput: function (value) {
    infectionRate = value;
  },
});

topBar.addSlider({
  label: "Quarantine Rate",
  min: 0,
  max: 1,
  step: 0.01,
  value: quarantineRate,
  oninput: function (value) {
    quarantineRate = value;
    generatePopulation(population.length); // regenerate population to update goodPerson values
  },
});

topBar.addSlider({
  label: "Initial Population",
  min: 16,
  max: 2048,
  oninput: function (value) {
    generatePopulation(value);
  },
});

topBar.addButton({
  text: "Reset",
  onclick: function () {
    generatePopulation(population.length);
  },
});

// TODO: add sliders or inputs for your own parameters here

gi.run();
