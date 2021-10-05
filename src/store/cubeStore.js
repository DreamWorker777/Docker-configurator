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
        state.placedCubes = cubes.sort((a, b) => {
            const sumA = a.x + a.y;
            const sumB = b.x + b.y;

            if( sumA > sumB )
                return 1;
            else if( sumA === sumB )
                return 0;
            else
                return -1;
        })
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

    view3D: false,
    updateView3D: (val) => set(produce(state => {
        state.view3D = val;
    }))
}))

export default cubeStore
