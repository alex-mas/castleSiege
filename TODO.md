#FIRST ITERATION REMAINING TASKS:



## Create a multiple height level via pathfinding
- Units will be in a height position
- Units will be able to walk conditionally of its height position
- There will be points that move units between height levels

##Account for the multiple height pathfinding system in the AI systems


##Create a landing page to choose testing variabes such as the environment (plain, rocks, castle, etc..) (num of units, type of units, teams, etc..)
- Delay game generation
- Provide input handling to choose the variables
- Initialize the game with the variables provided



##Optimize the app further -> target 2000 units at >30 fps
- Early quits from functions to prevent innecesary computations
- Avoid using fancy dynamic typing features to allow JIT to produce better assembly code
- bootstrap units as its id property as a property inside game units data structure to allow for fast id checking
- Remove units from the relevant array when they die to reduce the computational burden for hot function
- Investigate further in the web about rendering and engine performance tips