#FIRST ITERATION REMAINING TASKS:


## Finish implementing elevators
- Elevators must connect 2 altitude layers (2 arbitrary layers defined upon construction of the elevator) -> or connect all layers from 0 to N where N is the heigth of the elevator -> then requests to change of pathing level would add a desired target level for the elevator to know what action to perform on the unit
- Make them usable by enemy units once its settled


## Implement wall system
- Walls will be structures, a new type of sprite that doesn't have movement, just owner and structure related logic
- Only special units like catapults and such should be able to damage it
- Walls have a height level, it determines at what altitudeLayer it is walkable, on the rest of altitude layers its unwalkable
- Upon death walls clear up the path at its position


## Implement Archer units
- Implement a visible projectile and a hit chance
- Make the ranged units more reponsive


## Create a landing page to choose testing variabes such as the environment (plain, rocks, castle, etc..) (num of units, type of units, teams, etc..)
- Delay game generation
- Provide input handling to choose the variables -> that is, to construct a custom json schema for the battle
- Initialize the game with the variables provided
- Add an exit point to the battle so that app flow goes back to the testing UI after it finishes



## Optimize the app further -> target 2000 units at >30 fps
- Early quits from functions to prevent innecesary computations
- ECS?
- Avoid using fancy dynamic typing features to allow JIT to produce better assembly code
- Remove units from the relevant array when they die to reduce the computational burden for hot function
- Investigate further in the web about rendering and engine performance tips