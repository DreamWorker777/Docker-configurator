import {React, useState} from 'react';
import cubeStore from '../store/cubeStore';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { stageProps } from '../constant/variable';
import Modal from 'react-bootstrap/Modal'

const s = {
    buttonWrapper: { 
        position: 'fixed', 
        bottom: 50,
        right: 20
    },
    buttonBack: {
        backgroundColor: '#123123'
    },
    element: {
        display: 'flex',
        margin: 10
    },
    element_img: {
        margin: 10,
        width: 100,
    },
    element_title: {
        marginLeft: 20,
    },
    element_count: {
        marginLeft: 20,
        fontSize: 21,
    }
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

    const view3D = cubeStore(state => state.view3D);
    const updateView3D = cubeStore(state => state.updateView3D);

    const [modalShow, setModalShow] = useState(false);
    const [pinPoints, setPinPoints] = useState([]);
    const [elements, setElements] = useState([]);

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

    const calcPinsAction = () => {

        const points = [];

        placedCubes.forEach((cube) => {
            points.push( { x: cube.x - 0.5, y: cube.y - 0.5 } );
            points.push( { x: cube.x - 0.5, y: cube.y + 0.5 } );
            points.push( { x: cube.x + 0.5, y: cube.y + 0.5 } );
            points.push( { x: cube.x + 0.5, y: cube.y - 0.5 } );
        });

        const pin_points = [];

        points.forEach( (point, idx) => {
            const index = points.findIndex((item, t_idx) => item.x === point.x && item.y === point.y && t_idx != idx );
            const p_index = pin_points.findIndex( item => item.x === point.x && item.y === point.y );
            if( index != -1 && p_index === -1 ) {
                pin_points.push(point);
            }
        });

        setPinPoints( pin_points );

        console.log(placedCubes);
        const temp = [];
        placedCubes.forEach((cube) => {
            const idx = temp.findIndex((item) => item.id === cube.id);
            if( idx === -1 ) {
                temp.push({ id: cube.id, title: cube.name, img: cube.menuImg, count: 1 });
            } else {
                temp[idx].count ++;
            }
        })
        setElements(temp);

        handleShow();
    }

    const handleClose = () => setModalShow(false);
    const handleShow = () => setModalShow(true);

    const view3DAction = () => {
        updateView3D(!view3D);
        updateDeleteMode(false);
        updateProductSelected({});
    }

    return (
        <div>
            <ButtonGroup aria-label="Basic example" style={ s.buttonWrapper }>
                <Button variant="primary" style={ s.buttonBack } onClick={ zoomInAction }>Zoom In</Button>
                <Button variant="primary"  style={ s.buttonBack } onClick={ zoomOutAction }>Zoom out</Button>

                {
                    !view3D ? 
                        (<div>
                            <Button variant="primary" style={{ backgroundColor: '#123123', marginLeft: 50 }} onClick={ deleteAction } >Delete</Button>
                            <Button variant="primary"  style={ s.buttonBack } onClick={ unDoAction }>Undo</Button>
                            <Button variant="primary"  style={ s.buttonBack } onClick={ clearAction }>Clear</Button> 
                        </div>)
                        : null
                }
                    

                <Button variant="primary" style={{ backgroundColor: '#123123', marginLeft: 50 }} onClick={ calcPinsAction } >Calc Number</Button>
                <Button variant="primary"  style={ s.buttonBack } onClick={ view3DAction }>3D View</Button>
            </ButtonGroup>

            <Modal 
                show={modalShow} 
                fullscreen={true}
                onHide={handleClose} 
            >
                <Modal.Header closeButton>
                <Modal.Title>Attention!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Number of pins that required: { pinPoints.length } 
                    <h3 style={{ margin: 20 }}> All Elements here: </h3>
                    {
                        elements.map((element, index) => (
                            <div key={index} style={ s.element }>
                                <img src={ element.img } style={ s.element_img } />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <h4 style={ s.element_title }> { element.title } </h4>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={ s.element_count }> { element.count } qty </span>
                                </div>
                            </div>
                        ))
                    }
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Buttons;