import React, { useEffect } from 'react';
import cubeStore from '../store/cubeStore';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { stageProps } from '../constant/variable';

const s = {
    buttonWrapper: { 
        position: 'fixed', 
        bottom: 50 
    },
    buttonBack: {
        backgroundColor: '#123123'
    },
}

const Buttons = () => {
    const blockSize = cubeStore( state => state.blkSize );
    const updateBlockSize = cubeStore( state => state.updateBlockSize );

    const updateCenterPos = cubeStore(state => state.updateCenterPos);

    const deleteMode = cubeStore( state => state.deleteActive );
    const updateDeleteMode = cubeStore( state => state.updateDeleteActive );

    const updateProductSelected = cubeStore(state => state.updateProductSelected);

    const placedCubes = cubeStore(state => state.placedCubes);
    const updatePlacedCubes = cubeStore(state => state.updatePlacedCubes);

    const historyArray = cubeStore(state => state.historyArray);
    const updateHistoryArray = cubeStore(state => state.updateHistoryArray);

    const zoomInAction = () => {
        updateProductSelected({});
        updateBlockSize( blockSize + 10 );

        updateCenterPos( {
            x: stageProps.width / 2 + 160,
            y: stageProps.height / 2
        } )
    }

    const zoomOutAction = () => {
        updateProductSelected({});
        updateBlockSize( blockSize - 10 );

        updateCenterPos( {
            x: stageProps.width / 2 + 160,
            y: stageProps.height / 2
        } )
    } 

    const deleteAction = () => {
        updateProductSelected({});

        updateDeleteMode( !deleteMode );
    }

    const clearAction = () => {
        updateProductSelected({});

        updateHistoryArray([ ...historyArray, placedCubes ]);
        updatePlacedCubes([]);
    }

    const unDoAction = () => {
        updateProductSelected({});

        if( historyArray.length >= 1 ) {
            updatePlacedCubes( historyArray[ historyArray.length - 1 ] );

            const temp = [ ...historyArray ];
            temp.splice( historyArray.length - 1, 1 );

            updateHistoryArray( temp );
        }
    }

    return (
        <div>
            <ButtonGroup aria-label="Basic example" style={ s.buttonWrapper }>
                <Button variant="primary" style={ s.buttonBack } onClick={ zoomInAction }>Zoom In</Button>
                <Button variant="primary"  style={ s.buttonBack } onClick={ zoomOutAction }>Zoom out</Button>

                <Button variant="primary" style={{ backgroundColor: '#123123', marginLeft: 50 }} onClick={ deleteAction } >Delete</Button>
                <Button variant="primary"  style={ s.buttonBack } onClick={ unDoAction }>Undo</Button>
                <Button variant="primary"  style={ s.buttonBack } onClick={ clearAction }>Clear</Button>
            </ButtonGroup>
        </div>
    )
}

export default Buttons;