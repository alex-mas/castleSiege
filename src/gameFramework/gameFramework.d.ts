/// <reference types="Phaser-ce" />



declare module pathfinding{
    export class Grid{

    }
}

declare module gameFramework {
    export enum PlayerType{
        AI,
        IDLE_AI,
        HUMAN
    }
    export enum DiplomacyState{
        ALLY,
        NEUTRAL,
        ENEMY,
        NONE
    }
    export class Player{
        team: gameFramework.Team;
        static _id: string;
        static type: gameFramework.PlayerType;
        static AI?: gameFramework.AI;

    }
    export class AI{
        static update():void;
        static atStart():void;
    }
    export class Team{
        static public name: string;
        members: Array[gameFramework.Player];
        diplomacy: Map<gameFramework.Team,gameFramework.DiplomacyState>;
        static public addMember(player: gameFramework.Player): void;
        static removeMember(player: gameFramework.Player): void;
        static addEnemy(team: gameFramework.Team): void;
        static addAlly(team: gameFramework.Team):void ;
        static addNeutral(team: gameFramework.Team):void ;
        static removeRelation(team:gameFramework.Team):void;
        static changeRelation(team: gameFramework.Team, newRelation: gameFramework.DiplomacyState):void;
        static hasRelationWith(team: gameFramework.Team): boolean;
        static getTeamRelation(teamn: gameFramework.Team): gameFramework.DiplomacyState;
        static isAllyOf(team: gameFramework.Team): boolean;
        static isEnemyOf(team: gameFramework.Team): boolean;
        static isNeutralWith(team: gameFramework.Team): boolean;
        static private isTeam(variable: any): bool;
        static private sanitizeInput(team: any): void;
        static private warnOfExistingRelation(param: gameFramework.Team, caller: gameFramework.Team);

    }
    export class Brain{

    }
    export class SoldierBrain extends gameFramework.Brain{

    }
    export class Pawn extends Phaser.Sprite{

    }
    export class Unit extends gameFramework.Pawn{
        orders: Array[object];
        currentOrder: any|object;
        static pathfinder:{
            grid: pathfinding.Grid;
            
        };
        static executeOrders(): void;
        static update(): void;
    }
    export class Soldier extends gameFramework.Unit{
        constructor(game: Phaser.Game, x: number, y: number, spriteName: string, player:gameFramework.Player, attribute: object, brain: gameFramework.Brain|gameFramework.SoldierBrain);
        static brain: gameFramework.Brain|gameFramework.SoldierBrain;
        static status: object;
        static damageTarget(target: gameFramework.Unit, damage: Number): void;
        static attack(attackIndex: number, target: gameFramework.Unit): void;
        static isInAttackRange(attackIndex: number, target: gameFramework.Unit): boolean;
        static executeOrders(): void;
        static update(): void;
    }
}
