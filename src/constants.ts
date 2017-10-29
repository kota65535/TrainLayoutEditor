import {BuilderPaletteData, EditorMode} from "./lib/PaletteItem";

export const INITIAL_BUILDER_PALETTE_DATA: BuilderPaletteData = {
  sections: [
    {
      name: "Straight Rails",
      items: [
        {mode: EditorMode.RAIL, id: "S280",  name: "S280"},
        {mode: EditorMode.RAIL, id: "S140",  name: "S140"},
        {mode: EditorMode.RAIL, id: "S99",   name: "S99"},
        {mode: EditorMode.RAIL, id: "S70",   name: "S70"},
        {mode: EditorMode.RAIL, id: "S33",   name: "S33"},
        {mode: EditorMode.RAIL, id: "S18_5", name: "S18-5"},
        {mode: EditorMode.RAIL, id: "S70G",  name: "S70G"}
      ]
    },
    {
      name: "Curve Rails",
      items: [
        {mode: EditorMode.RAIL, id: "C280_45", name: "C280-45"},
        {mode: EditorMode.RAIL, id: "C280_15", name: "C280-15"},
        {mode: EditorMode.RAIL, id: "C317_45", name: "C317-45"},
        {mode: EditorMode.RAIL, id: "C541_15", name: "C541-15"},
      ]
    },
    {
      name: "Turnouts",
      items: [
        {mode: EditorMode.RAIL, id: "PL541_15", name: "PL541-15"},
        {mode: EditorMode.RAIL, id: "PR541_15", name: "PR541-15"},
        {mode: EditorMode.RAIL, id: "PL280_30", name: "PL280-30"},
        {mode: EditorMode.RAIL, id: "PR280_30", name: "PR280-30"},
        {mode: EditorMode.RAIL, id: "PY280_15", name: "PY280-15"},
        {mode: EditorMode.RAIL, id: "CPR317_280_45", name: "CPR317/280-45"},
        {mode: EditorMode.RAIL, id: "CPL317_280_45", name: "CPL317/280-45"}
      ]
    },
    {
      name: "Electric Parts",
      items: [
        {mode: EditorMode.FEEDER, id: "Feeder", name: "Feeder"},
        {mode: EditorMode.GAP_JOINER, id: "Gap", name: "Gap Joiner"}
      ]
    }
  ]
}
