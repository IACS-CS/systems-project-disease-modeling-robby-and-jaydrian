[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/EBxfFiOT)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=23081318)
# Disease Spread Simulation

## Overview

We started this unit with a simple physical experiment: the handshake game. You shook hands with classmates and eventually found out who "infected" who. That gave us an intuition for how disease spreads — but it had obvious limits. It was slow, we couldn't rerun it, we couldn't change the rules, and we couldn't scale it up.

A computer simulation lets us do all of those things. In this project you will build an **agent-based model** of disease spread: a canvas full of individual agents (people), each with their own state, moving around and interacting according to rules you define. You will then use your model to investigate how changing one or more variables affects the outcome of an outbreak.

This is real epidemiological modeling — it's the same fundamental approach used to study COVID-19, influenza, and other diseases.

---

## Learning Goals

By the end of this project you should be able to:

- Represent a collection of things in code using a **list** and access them with a **loop**
- Write a **procedure (function)** that takes parameters and uses sequencing, selection, and iteration
- Use **`Math.random()`** to model probabilistic events
- Explain the difference between what a simulation models and what it leaves out
- Describe how changing a variable in your model affects the results, and why

---

## The Model

Your simulation will represent a population of agents. Each agent has at least these properties:

- A position on the canvas (x, y)
- A **state**: one of `"susceptible"`, `"infected"`, or `"recovered"` (you may add more — see below)
- Any additional properties needed for the complicating factor you choose

Each frame of the simulation, your model should:

1. **Move** each agent
2. **Check for interactions** between agents (who is close enough to who?)
3. **Update state** based on the rules of your disease

---

## Requirements

### 1. Working simulation

Your simulation must run without errors and visually show the spread of disease through a population over time. Agents should be distinguishable by state (e.g. color).

### 2. At least one complicating factor

A basic model has agents that are either susceptible or infected. Your model must add **at least one** complicating factor from the list in the [reference section](#reference-complicating-factors) below. Your choice should be deliberate — pick something that connects to a real disease or intervention you find interesting.

### 3. At least one adjustable parameter

Your simulation must expose **at least one parameter** the user can adjust (e.g. transmission probability, population size, vaccination rate). This should be wired to a slider or number input in the UI. Changing the parameter should visibly affect how the outbreak unfolds.

### 4. A function of your own design — CREATE task requirement

You must write **at least one function** that satisfies **both** of the following:

#### Part A — Define the function

Your function must:

- **Accept at least one parameter** that actually affects what the function does or returns — not a parameter that is accepted but ignored
- Contain **sequencing** — steps that happen in a deliberate order
- Contain **selection** — at least one `if` / `else if` / `else` that branches based on a condition
- Contain **iteration** — a loop inside the function body

All three constructs must be **visible inside this one function**. Don't split the logic into so many small helpers that the sequencing, selection, and iteration disappear — this function needs to tell a complete story on its own.

#### Part B — Call the function explicitly in your code

You must call your function somewhere in your simulation, passing arguments. The call must appear as a **direct function call with arguments in your code** — not wired up solely as a click handler, event listener, or library callback. The point is that *you* are explicitly invoking it.

```js
// Example — your function name and arguments will be different
myFunction(someArgument, anotherArgument);
```

> **Why this matters:** The AP CSP Performance Task (CREATE) requires you to (1) define a function with a parameter, and (2) call that function in your program. Both must be present and identifiable. This project is practice for exactly that.

### 5. Written reflection

Submit a short written reflection (can be a comment block at the top of your `main.js`, or a separate document) that answers:

1. What disease or scenario did you choose to model, and why?
2. What does your complicating factor add to the model? How does it change the outcome?
3. What did you *leave out* of your model, and why? What effect might those omissions have on your results?
4. What happens when you adjust your parameter(s)? Does the result match what you'd expect from real life?

---

## Deliverables

- Your completed `main.js` (and any other files you modified)
- A comment block at the top of `main.js` describing how you used AI assistance in this project
- Your written reflection

---

## Rubric

Each criterion is scored 1–4. The table below describes **3 (Proficient)** and **4 (Mastery)**. Scores of 1 or 2 will be explained in written feedback. A 4 is not a "better 3" — it describes something *additional* you did beyond the baseline.

| Criterion | 3 — Proficient | 4 — Mastery |
|---|---|---|
| **Working code** | The simulation runs without errors. Agents appear on the canvas, move, and change state. There are no crashes or freezes during normal use. | The simulation handles edge cases gracefully — e.g. the simulation doesn't break when everyone has recovered or when the population is set to an extreme value. |
| **Simulation correctness & complexity** | Disease spreads visibly through the population in a way that makes sense. At least one complicating factor is implemented and has a visible effect on the outbreak. | The complicating factor is grounded in real data — e.g. incubation timing, transmission rates, or intervention effectiveness are drawn from the reference tables or cited sources rather than arbitrary values. |
| **Use of lists** | At least one list or other collection is used to manage data in the simulation (e.g. the population of agents). At least one loop iterates over that collection to update or process its elements. | Multiple traversals of the collection serve distinct purposes. The list is being used as an abstraction — the simulation would not work correctly if the list were replaced with a fixed set of individual variables. |
| **Procedural abstraction** | A function is defined with at least one parameter and is explicitly called in the simulation with arguments passed — not solely via a callback or event handler. | The parameter(s) are used inside the function body in a way that visibly affects its behavior — not just accepted and ignored. |
| **Sequencing, selection, and iteration** | All three are present and visible inside the same function: steps occur in a deliberate order, at least one `if`/`else` branches on a condition, and at least one loop runs inside the function body. | The order of steps, the branching conditions, and the loop are all doing real work — reordering the steps or removing the branch would produce a meaningfully different (wrong) result. |
| **Reflection** | All four reflection questions are answered. At least one limitation of the model is identified. | The reflection connects simulation behavior to real-world outcomes — e.g. describes a specific parameter change and what it revealed, or explains why a particular simplification matters for the accuracy of the model. |

---

## Reference: Complicating Factors

Choose at least one of the following. You are not limited to this list.

### Incubation Period

There is a delay between when an agent is infected and when they become contagious or symptomatic. During this window the agent is infected but not yet spreading the disease.

| Disease | Incubation Period |
|---|---|
| Influenza | 1–2 days |
| Common cold | 1–3 days |
| Norovirus | 1–2 days |
| COVID-19 | ~6 days |
| Chickenpox | 10–21 days |
| Ebola | 2–21 days |
| Mononucleosis | 30–50 days |
| Rabies | 30–100 days |

### Contagious Period

Agents are only contagious for a limited time. After the contagious period ends they may recover (or die).

| Disease | Contagious Period |
|---|---|
| Chickenpox | ~6–7 days (starting 2 days before symptoms) |
| Norovirus | 1 day before symptoms to 7 days after |
| COVID-19 | Most infectious 5–7 days after infection |
| Mononucleosis | ~7 days of fever |

### Carriers / Subclinical Infections

Not all infected agents show symptoms — but they can still spread the disease. This makes containment much harder.

| Disease | % Symptomatic | % Carrier (no symptoms) |
|---|---|---|
| Mononucleosis (children) | 5–10% | 90–95% |
| Rubella / Influenza | ~60% | ~40% |
| COVID-19 | Unknown, estimated 2–45% asymptomatic | Documented asymptomatic transmission |

### Interventions

Model the effect of a public health response:

- **Quarantine** — symptomatic agents stop moving or are removed from the population
- **Vaccination** — some agents start immune; you can model partial effectiveness
- **Treatment** — reduces infectivity or shortens contagious period

### Vectors

Some diseases spread through an animal carrier. You could model a second population of agents (mosquitoes, fleas, rats) that interact with the human population differently.

- **Bubonic Plague** — spreads through flea bites; pneumonic form spreads person-to-person
- **Malaria / Zika / Yellow Fever** — mosquito population varies with season

### Movement and Crowding

Model how density and movement patterns affect spread. What happens when you cluster agents in groups (like classrooms or households) rather than distributing them randomly? What happens when some agents travel between clusters?

---

*See [AGENTS.md](./AGENTS.md) for coding guidelines and the SimpleCanvasLibrary API reference.*

---
Citation: this README.md was generated based on Google Doc past versions of this assignment by Claude Sonnet 4.6, then edited in conversation with Claude by your very human teacher ;)