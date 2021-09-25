import create from "zustand";
import produce from "immer";
import { stageProps } from "../constant/variable";

const cubeStore = create(set => ({
    centerPos: {
        x: stageProps.width / 2 + 160,
        y: stageProps.height / 2
    },
    updateCenterPos: (pos) => set(produce(state => {
        state.centerPos = { ...pos }
    })),

    productSelected: {},
    updateProductSelected: (product) => set(produce(state => {
        state.productSelected = { ...product }
    })),

    placedCubes: [],
    updatePlacedCubes: ( cubes ) => set(produce(state => {
        state.placedCubes = [ ...cubes ]
    })),

    blkSize: 125,
    updateBlockSize: ( val ) => set(produce(state => {
        state.blkSize = val
    })),

    deleteActive: false,
    updateDeleteActive: (val) => set(produce(state => {
        state.deleteActive = val
    })),

    historyArray: [],
    updateHistoryArray: (val) => set(produce(state => {
        state.historyArray = [ ...val ];
    })),
}))

export default cubeStore
