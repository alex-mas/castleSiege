#FIRST ITERATION REMAINING TASKS:

## Wire up pathfinding threads with units

## Adapt Soldiers and SoldierBrain apis for multithreading:
- Parse data efficiently and provide a slim object to transmit to threads
- Plan how to wire up the callback of the AI threads into the order system for units

## Inplement Soldier AI via web workers (Multithreading)
- The input will be the context data the game provides to AI
- The output will be the order the AI deem a best course of action


## Create a multiple height level via pathfinding
- Units will be in a height position
- Units will be able to walk conditionally of its height position
- There will be points that move units between height levels

##Account for the multiple height pathfinding system in the AI systems


##Create a landing page to choose testing variabes such as the environment (plain, rocks, castle, etc..) (num of units, type of units, teams, etc..)
- Delay game generation
- Provide input handling to choose the variables
- Initialize the game with the variables provided