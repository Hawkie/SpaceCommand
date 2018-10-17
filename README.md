#  SpaceCommand
The start of a two dimensional, strategic highly playable, space adventure game involving asteroids, space combat, planetry landings, planetry combat. 

![Menu](docs/SpaceCommandMenu.png)

Initial Starting point is Asteroids and Lander Game

![Asteroids](docs/SpaceCommandAsteroids.png)

![Lander](docs/SpaceCommandLander.png)


To build:
1) Download the Space Command files from github files to your dev directory using git clone
2) You will need npm (node package manager). To install goto nodejs download page.
3) You will need the typescript compiler. Use npm to install typescript globally. npm install typescript -g
4) Build the project. run npm run build. This runs tsc on the project using the tsconfig.json settings.

To Run:
It does not currently work with node. Instead you will need to host the files on a web server.
This is easy with Visual Studio Code. Open VSC
 a) download the Live Server extension in Visual Studio Code extensions
 b) Click "Go Live" icon to start up a web service connected to your source code via a web socket. It will open up a browser window. (use Chrome and navigate to the localhost service and portnumber)

---

Player starts with a small ship, building a fleet, where each ship can be controlled directly or commanded with high level commands and upgrade.

One player campaign against AI component in galaxy or multiplayer by server.

Game moves between different states: space, planet landing, planet surface.

Ships:
Each has own characteristic, weapons (lasers, phasers, bullets, missiles), defense (shields, tractor beams)

Planets:
Build mines, factories, make weapons, ships, defenses.

Eventually to involve trade, inter solar system exploration, mining.

Written in Typescript, using visual Studio Code and using Requirejs to load exported Modules.

Dependencies:
npm install requirejs

Todo

Unit tests
gravity
sound
weapons
defence

