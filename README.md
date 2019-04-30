# RPG Playground
* This project is a work in progress!
 ~ The repository name is wrong -- will fix! ~

## What is this?
* It's an 2D role playing game builder, a playground of sorts, for game development on web browsers.
* Built using React and Canvas

## Why aren't you using a game engine to build a game?!
1. For the purpose of learning and experience building a browser-based game from mostly scratch.
2. Canvas is a piece of tech I've been interested to learn more about so this seemed like a good excuse for it.
3. There are existing JavaScript game engines out there, but I was unsatisfied after trying out a number of them.
4. Most game engines require using a different language. I'm quite open to learning other programming languages, but I really like JavaScript and it's the language I feel most comfortable with when coding. Let's just say I felt lazy and didn't want to leave my comfort zone for this particular project. :P

## Requirements for running a local development build
* Latest stable version of `node.js`
* `npm`
* `yarn`

## Installation And Usage
1. Clone this repo
2. Execute `yarn install`
3. Execute `npm run start`
4. Open a web browser (preferably on that's up-to-date with current web standards)
5. Go to `localhost:1337` and explore the app!

## Current Available Features
### Map Builder Tool
  * A tool for building a game map using sprites.
  * Toggle into "Wall Mode" to define impassable cells on the map.
  * Clicking the "Save and Download" button will open a preview modal showing a grid-less version of the map.
  * In the preview modal, enter a name and click the "Download" link to save a png image of the map on your computer.
  * For now, you'll need to go into the redux devtools to get a copy of the grid object data which contains dimensions, coordinates, sprite, and tile data for the map.
### Temporary Stage
  * Almost-blank map where the player avatar can move
### Player Camera and spatial wall detection test
  * A page that renders the player camera over a canvas
  * Spatial detection field (green border) is visible to test wall detection
  * I'm currently working on this. This feature is not yet finished

## Future Features
* Overworld engine
* Player camera
* Player movement engine
* NPC movement engine
* Spatial detection of walls and other objects
* Player and NPC sprites and animations
* Combat engine
* Environment animations and effects
* Physics engine (probably gonna use an existing library for this)

## Demo
* TBA - Will be hosted on my new personal site that's currently under construction
