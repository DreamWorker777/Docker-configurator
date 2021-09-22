import create from "zustand"
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
}))

export default cubeStore
