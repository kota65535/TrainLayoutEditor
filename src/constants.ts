import {PaletteItemType} from "./lib/PaletteItem";

export const BUILDER_PALETTE_SECTION_PARAMS = [
  {
    name: "Straight Rails",
    items: [
      {type: PaletteItemType.RAIL, id: "S280",  name: "S280"},
      {type: PaletteItemType.RAIL, id: "S140",  name: "S140"},
      {type: PaletteItemType.RAIL, id: "S99",   name: "S99"},
      {type: PaletteItemType.RAIL, id: "S70",   name: "S70"},
      {type: PaletteItemType.RAIL, id: "S33",   name: "S33"},
      {type: PaletteItemType.RAIL, id: "S18_5", name: "S18-5"},
      {type: PaletteItemType.RAIL, id: "S70G",  name: "S70G"}
    ]
  },
  {
    name: "Curve Rails",
    items: [
      {type: PaletteItemType.RAIL, id: "C280_45", name: "C280-45"},
      {type: PaletteItemType.RAIL, id: "C280_15", name: "C280-15"},
      {type: PaletteItemType.RAIL, id: "C317_45", name: "C317-45"},
      {type: PaletteItemType.RAIL, id: "C541_15", name: "C541-15"},
    ]
  },
  {
    name: "Turnouts",
    items: [
      {type: PaletteItemType.RAIL, id: "PL541_15", name: "PL541-15"},
      {type: PaletteItemType.RAIL, id: "PR541_15", name: "PR541-15"},
      {type: PaletteItemType.RAIL, id: "PL280_30", name: "PL280-30"},
      {type: PaletteItemType.RAIL, id: "PR280_30", name: "PR280-30"},
      {type: PaletteItemType.RAIL, id: "PY280_15", name: "PY280-15"},
      {type: PaletteItemType.RAIL, id: "CPR317_280_45", name: "CPR317/280-45"},
      {type: PaletteItemType.RAIL, id: "CPL317_280_45", name: "CPL317/280-45"}
    ]
  },
  {
    name: "Electric Parts",
    items: [
      {type: PaletteItemType.FEEDER, id: "Feeder", name: "Feeder"},
      {type: PaletteItemType.GAP_JOINER, id: "Gap", name: "Gap Joiner"}
    ]
  }
];
