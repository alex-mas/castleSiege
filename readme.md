# Castle Siege technical demo #


![Alt Text](./battle.gif)

This showcases an electron app that uses electron and web workers as a base for the implementation of the game logic.

The game consist of fast peaced battles between armies in variable terrains such as castles, fields and others.



### Current features ###

* Relevant game classes that implement movement and attacking with a order based system -> Pawns -> Units -> Soldiers

* Pathfinding system computed in auxiliary thread that broadcasts back to the main thread

* AI computed in auxiliary threads.

* Can simulate battles up to 1k-2k units.



## Purpose ##

Project i wrote to learn phaserjs and electron.



© 2017-2018 Alex Mas

