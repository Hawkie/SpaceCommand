#  SpaceCommand

<p>The start of a two dimensional, strategic, highly playable, space adventure game involving asteroids, space combat, planetry landings.
</p>
<p>
Written in Typescript, using visual Studio Code and using webpack to transpile to bundle.js.
</p>


![Menu](docs/SpaceCommandMenu.png)

Initial Starting point is Asteroids and Lander Game

![Asteroids](docs/SpaceCommandAsteroids.png)

![Lander](docs/SpaceCommandLander.png)


### To build:
1) Download the Space Command files from github to your dev directory using git clone
2) You will need npm (node package manager). To install goto nodejs download page.
3) You will need the typescript compiler. Use npm to install typescript globally: npm install typescript -g
4) You need to download the js dependencies into the node_modules directory using: npm install. 
5) Build the project by: npm run build. This runs webpack on the project using the tsconfig.json and webpack.config.js settings.
6) You can run the jest tests using: npm run test or npx jest

### To Run locally:
The whole project compiles to javascript. Goto the directory and open the file index.html in chrome.

### Play online
<p>
The game is hosted on a free hosting provider at:  http://spacecommand.000webhostapp.com/
If you do not hear the sound initially - press f5 to refresh.
</p>

### To host on a server
<p>
A good article explaining the issues is here:
https://medium.freecodecamp.org/how-to-set-up-a-typescript-project-67b427114884
Will add node start and used http-server soon.
(will try hosting the canvas element inside a react component soon)
To host, it is made easily possible with Visual Studio Code and the Live Server extension. 
1) Open Visual Studio Code.
2) Download the Live Server extension in Visual Studio Code extensions
3) Click "Go Live" icon to start up a web service connected to your source code via a web socket. It will open up a browser window. (use Chrome and navigate to the localhost service and portnumber)
</p>
---

### Controls
<p>Keys only - no mouse atm.</p>

#### In Menu mode:
<li><b>Up/Down Arrow</b> to select menu item</li>
<li><b>Enter</b> to select.</li>

#### In Game Mode:
<li><b>Left/Right Arrow</b> to rotate ship.</li>
<li><b>Up Arrow</b> to thrust</li>
<li><b>Space</b> to fire</li>
<li><b>Z/X</b> to zoom in and out</li>
<li><b>Esc</b> to return to menu</li>
<li><b>F5</b> to reload and reset game</li>

----

### Game concept
<p>Player starts with a small ship. Gaining money and resources by completing missions. Can then start to build a fleet, where each ship can be controlled directly or commanded with higher level commands. Each ship can be customised and upgraded. One player campaign against AI component in galaxy or multiplayer vs others by server. </p>

<p>
Game moves between different states: space, planet landing, planet surface.
</p>

### Ships:
Each has own characteristic, weapons (lasers, phasers, bullets, missiles), defense (shields, tractor beams)

### Planets:
<p>Build mines, factories, make weapons, ships, defenses.
Eventually to involve trade, inter solar system exploration, mining.
</p>


### Todo

More Unit tests around the physics using jest
sound
weapons
defence

