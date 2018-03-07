#FIRST ITERATION REMAINING TASKS:


## Account for the multiple height pathfinding system in the AI systems
- Make units able to go between levels if possible

## Finish implementing elevators
- Make them get next to the wall section they want to lock with
- Make the unit completely inmovable by any means when it is settled
- Make the pathing grid update when an elevator locks with a wall section
- Elevators must connect 2 altitude layers



## Implement wall system
- Walls will be structures, a new type of sprite that doesn't have movement, just owner and structure related logic
- Only special units like catapults and such should be able to damage it
- Walls have a height level, it determines at what altitudeLayer it is walkable, on the rest of altitude layers its unwalkable
- Upon death walls clear up the path at its position


## Implement Archer units
- It is just a special soldier with a ranged attack
- The attack should send a projectile towards its target
- Ranged units can attack units on all altitudeLayers


## Create a landing page to choose testing variabes such as the environment (plain, rocks, castle, etc..) (num of units, type of units, teams, etc..)
- Delay game generation
- Provide input handling to choose the variables
- Initialize the game with the variables provided



## Optimize the app further -> target 2000 units at >30 fps
- Early quits from functions to prevent innecesary computations
- Avoid using fancy dynamic typing features to allow JIT to produce better assembly code
- Remove units from the relevant array when they die to reduce the computational burden for hot function
- Investigate further in the web about rendering and engine performance tips