<img src="./resources/icon.png">
# Castle Siege technical demo#

This showcases an electron app that uses electron and web workers as a base for the implementation of the game logic.

The game consist of fast peaced battles between armies in variable terrains such as castles, fields and others.



### Current features ###

* Relevant game classes that implement movement and attacking with a order based system -> Pawns -> Units -> Soldiers

* Pathfinding system computed in auxiliar thread that broadcasts back to the main thread

* Event based order system that allows the auxiliary threads to broadcast the data to the right objects



### Planned features ###

* AI system that live in auxiliary threads

* Multiple levels of height for castle pathfinding

* Landing page to choose testing variabes and create a repeatable experience

* Add several choice for variety in AI strategies


## Purpose ##


This will serve as one of the building blocks for a medieval game.


## Copyright ##

© 2017-2018 Alex Mas

