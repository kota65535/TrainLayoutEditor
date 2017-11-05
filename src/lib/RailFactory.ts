/**
 * Created by tozawa on 2017/07/16.
 */
import {GappedStraightRail, StraightRail} from "./rails/StraightRail";
import {CurveRail} from "./rails/CurveRail";
import {CurvedTurnout, SimpleTurnout, SymmetricalTurnout, TurnoutDirection} from "./rails/Turnout";
import * as paper from "paper";


// let DEFAULT_POSITION = new paper.Point(-10000000,-10000000);
let DEFAULT_POSITION = new paper.Point(0,0);
// let DEFAULT_POSITION = new paper.Point(0, 0);

export class RailFactory {
    constructor() {
    }

    S280() {
        return new StraightRail(DEFAULT_POSITION, 0, 280, true);
    }
    S140() {
        return new StraightRail(DEFAULT_POSITION, 0, 140, true);
    }
    S70() {
        return new StraightRail(DEFAULT_POSITION, 0, 70, true);
    }
    S99() {
        return new StraightRail(DEFAULT_POSITION, 0, 99, true);
    }
    S33() {
        return new StraightRail(DEFAULT_POSITION, 0, 33, true);
    }
    S18_5() {
        return new StraightRail(DEFAULT_POSITION, 0, 18.5, false);
    }
    S70G() {
        return new GappedStraightRail(DEFAULT_POSITION, 0, 70);
    }
    C317_45() {
        return new CurveRail(DEFAULT_POSITION, 0, 317, 45, true);
    }
    C280_45() {
        return new CurveRail(DEFAULT_POSITION, 0, 280, 45, true);
    }
    C280_15() {
        return new CurveRail(DEFAULT_POSITION, 0, 280, 15, true);
    }
    C541_15() {
        return new CurveRail(DEFAULT_POSITION, 0, 541, 15, true);
    }
    PL541_15() {
        return new SimpleTurnout(DEFAULT_POSITION, 0, 140, 541, 15, TurnoutDirection.LEFT);
    }
    PR541_15() {
        return new SimpleTurnout(DEFAULT_POSITION, 0, 140, 541, 15, TurnoutDirection.RIGHT);
    }
    PL280_30() {
        return new SimpleTurnout(DEFAULT_POSITION, 0, 140, 280, 30, TurnoutDirection.LEFT);
    }
    PR280_30() {
        return new SimpleTurnout(DEFAULT_POSITION, 0, 140, 280, 30, TurnoutDirection.RIGHT);
    }
    PY280_15() {
        return new SymmetricalTurnout(DEFAULT_POSITION, 0, 280, 15);
    }
    CPR317_280_45() {
        return new CurvedTurnout(DEFAULT_POSITION, 0, 317, 280, 45, TurnoutDirection.RIGHT);
    }
    CPL317_280_45() {
        return new CurvedTurnout(DEFAULT_POSITION, 0, 317, 280, 45, TurnoutDirection.LEFT);
    }

    // Feeder() {
    //     let feeder = new TrianglePart(DEFAULT_POSITION, 0, Feeder.WIDTH, Feeder.HEIGHT, Feeder.FILL_COLOR_OPEN);
    //     feeder.getItemType = () => {
    //         return EditorMode.FEEDER;
    //     };
    //     return feeder;
    // }
}


export default new RailFactory()

