import React, {useCallback, useState} from 'react';
import { Stage, Graphics, Text, Sprite, Container } from '@inlet/react-pixi';
import Background from '../assets/back/back.png';
import * as PIXI from 'pixi.js';
import { stageProps, dashDis } from '../constant/variable';
import { distance } from '../constant/method';
import cubeStore from '../store/cubeStore';

const s = {
    wrapper: {
        backgroundImage: `url(${Background})`,
        backgroundSize: 'contain',
        width: 'calc(100vw)',
        height: 'calc(100vh)'
    }
}

const Panel = () => {
    const [ gridNumbers, setGridNumbers ] = useState([]);
    const [ mousePos, setMousePos ] = useState({ x: 0, y: 0 });
    const [ isDragging, setIsDragging ] = useState(false);
    const [ pendingCubes, setPendingCubes ] = useState([]);
    const [ startPoint, setStartPoint ] = useState({ x: 0, y: 0 });
    const [startCenter, setStartCenter] = useState( {} );

    const centerPos = cubeStore(state => state.centerPos);
    const updateCenterPos = cubeStore(state => state.updateCenterPos);

    const productSelected = cubeStore(state => state.productSelected);

    const placedCubes = cubeStore(state => state.placedCubes);
    const updatePlacedCubes = cubeStore(state => state.updatePlacedCubes);

    const blockSize = cubeStore( state => state.blkSize );

    const deleteMode = cubeStore( state => state.deleteActive );

    const historyArray = cubeStore(state => state.historyArray);
    const updateHistoryArray = cubeStore(state => state.updateHistoryArray);

    const view3D = cubeStore(state => state.view3D);
    const updateView3D = cubeStore(state => state.updateView3D);

    const drawDashLine = ( g, p1, p2 ) => {
        g.lineStyle(1, 0xffffff, 0.3);
        g.moveTo( p1.x, p1.y );
        g.lineTo( p2.x, p2.y );
        return;

        const len = Math.ceil(distance(p1, p2) / dashDis);
        
        const xOffset = (p2.x - p1.x) / len;
        const yOffset = (p2.y - p1.y) / len;
        
        for( let i = 0; i < len; i++ ) {
            g.lineStyle(1, 0xffffff, i % 2 === 0 ? 1 : 0);
            g.moveTo( p1.x + i * xOffset, p1.y + i * yOffset );
            g.lineTo( p1.x + (i + 1) * xOffset, p1.y + (i + 1) * yOffset );
        }
    }

    const drawLines = useCallback(g => {
        const numArray = [];

        g.clear()

        if( view3D ) return;

        g.lineStyle(1, 0xffffff, 1)
        for( let i = 0; i < 100; i++ ) {
            const data = [];
            if( centerPos.y - i * blockSize < stageProps.height  && centerPos.y - i * blockSize > 0) {
                drawDashLine( g, { x: 0, y: centerPos.y - i * blockSize }, { x: stageProps.width, y: centerPos.y - i * blockSize } );
                if( i % 2 === 0 )
                    data.push({ number: Math.floor( - i / 2), x: 325, y: centerPos.y - i * blockSize });
            }
            if( centerPos.y + i * blockSize < stageProps.height  && centerPos.y + i * blockSize > 0) {
                drawDashLine( g, { x: 0, y: centerPos.y + i * blockSize }, { x: stageProps.width, y: centerPos.y + i * blockSize } );
                if( i % 2 === 0 )
                    data.push({ number: Math.floor( i / 2 ), x: 325, y: centerPos.y + i * blockSize });
            }
            if( centerPos.x - i * blockSize < stageProps.width && centerPos.x - i * blockSize > 0 ) {
                drawDashLine( g, { x: centerPos.x - i * blockSize, y: 0 }, { x: centerPos.x - i * blockSize, y: stageProps.height } );
                if( i % 2 === 0 )
                    data.push({ number: Math.floor( - i / 2 ), x: centerPos.x - i * blockSize, y: 20 });
            }
            if( centerPos.x + i * blockSize < stageProps.width && centerPos.x + i * blockSize > 0 ) {
                drawDashLine( g, { x: centerPos.x + i * blockSize, y: 0 }, { x: centerPos.x + i * blockSize, y: stageProps.height } );
                if( i % 2 === 0 )
                    data.push({ number: Math.floor( i / 2 ), x: centerPos.x + i * blockSize, y: 20 });
            }

            numArray.push(...data);
        }
        setGridNumbers(prev => [...numArray]);
      }, [centerPos, blockSize, view3D])

    const drawOverLay = useCallback(g => {
        const width = blockSize * productSelected.width;
        const height = blockSize * productSelected.height;

        g.clear();
        g.beginFill(0x00ff14, 0.2);
        g.drawRect(
            calcSelectedPos(mousePos, 'x') - width / 2, 
            calcSelectedPos(mousePos, 'y') - height / 2, 
            width, 
            height);
        g.endFill();
    })

    const absolutePos = (val, axis) => {
        if( axis === 'x' )
            return centerPos.x + blockSize * val;
        
        return centerPos.y + blockSize * val;
    }

    const drawPendingOverLay = useCallback(g => {
        if( !pendingCubes.length ) return;
        const sizeX = blockSize * productSelected.width;
        const sizeY = blockSize * productSelected.height;

        const offsetX = absolutePos(pendingCubes[ pendingCubes.length - 1 ].x, 'x') - absolutePos(pendingCubes[0].x, 'x');
        const offsetY = absolutePos(pendingCubes[ pendingCubes.length - 1 ].y, 'y') - absolutePos(pendingCubes[0].y, 'y');

        const dirX = offsetX > 0 ? 1 : -1;
        const dirY = offsetY > 0 ? 1 : -1;

        const width = offsetX + dirX * sizeX;
        const height = offsetY + dirY * sizeY;

        g.clear();
        g.beginFill(0x00ff14, 0.2);
        g.drawRect( 
            absolutePos(pendingCubes[0].x, 'x') - dirX * sizeX / 2, 
            absolutePos(pendingCubes[0].y, 'y') - dirY * sizeY / 2, 
            width, 
            height );
        g.endFill();
    })

    const trackMousePos = ( event ) => {
        const mouseX = event.clientX - event.target.offsetLeft;
        const mouseY = event.clientY - event.target.offsetTop;

        setMousePos({ x: mouseX, y: mouseY });

        if( !productSelected.id && isDragging ) {
            const offsetX = mouseX - startPoint.x;
            const offsetY = mouseY - startPoint.y;
            updateCenterPos({ x: startCenter.x + offsetX, y: startCenter.y + offsetY });
        }

        if( !isDragging || !productSelected.id )   return;

        const sizeX = blockSize * productSelected.width;
        const sizeY = blockSize * productSelected.height;

        const startPosX = calcSelectedPos( startPoint, 'x' );
        const startPosY = calcSelectedPos( startPoint, 'y' );

        const currentPosX = calcSelectedPos({ x: mouseX, y: mouseY }, 'x');
        const currentPosY = calcSelectedPos({ x: mouseX, y: mouseY }, 'y');

        const rowCount = Math.abs((currentPosX - startPosX) / sizeX);
        const colCount = Math.abs((currentPosY - startPosY) / sizeY);

        const p_cubes = [];
        for( let i = 0 ; i < rowCount + 1; i++ ) {
            for( let j = 0; j < colCount + 1; j++ ) {
                const directionX = (currentPosX - startPosX) > 0 ? 1 : -1;
                const directionY = (currentPosY - startPosY) > 0 ? 1 : -1;

                const cubeX = startPosX + directionX * sizeX * i;
                const cubeY = startPosY + directionY * sizeY * j;

                p_cubes.push({
                    x: (cubeX - centerPos.x) / blockSize,
                    y: (cubeY - centerPos.y) / blockSize,
                    ...productSelected
                });
            }
        }
        setPendingCubes(prev => [ ...p_cubes ]);
    }

    const calcSelectedPos = (pos, axis) => {
        const sizeX = blockSize * productSelected.width;
        const sizeY = blockSize * productSelected.height;

        if( !isDragging ) {
            const numX = (pos.x - centerPos.x) / blockSize;
            const numY = (pos.y - centerPos.y) / blockSize;
            const x = centerPos.x + ((pos.x - centerPos.x ) >= 0 ? Math.floor( numX ) : Math.ceil( numX )) * blockSize + ((pos.x - centerPos.x ) > 0 ? sizeX / 2 : -sizeX / 2);
            const y = centerPos.y + ((pos.y - centerPos.y ) >= 0 ? Math.floor( numY ) : Math.ceil( numY )) * blockSize + ((pos.y - centerPos.y ) > 0 ? sizeY / 2 : -sizeY / 2);
    
            return axis === 'x' ? x : y;
        } else {
            const numX = (pos.x - centerPos.x) / sizeX;
            const numY = (pos.y - centerPos.y) / sizeY;
            const x = centerPos.x + ((pos.x - centerPos.x ) >= 0 ? Math.floor( numX ) : Math.ceil( numX )) * sizeX + ((pos.x - centerPos.x ) > 0 ? sizeX / 2 : -sizeX / 2);
            const y = centerPos.y + ((pos.y - centerPos.y ) >= 0 ? Math.floor( numY ) : Math.ceil( numY )) * sizeY + ((pos.y - centerPos.y ) > 0 ? sizeY / 2 : -sizeY / 2);
    
            return axis === 'x' ? x : y;
        }
    }

    const startDragging = (event) => {
        const position = {
            x: event.clientX - event.target.offsetLeft,
            y: event.clientY - event.target.offsetTop
        };

        setStartPoint(prev => ({ ...prev, ...position }));
        setStartCenter( prev => ({ ...prev, ...centerPos }) )

        setIsDragging(prev => !prev);

        if( !productSelected.id ) {
            return;
        }

        const cubeX= calcSelectedPos(position, 'x');
        const cubeY= calcSelectedPos(position, 'y');

        const p_cubes = [];
        p_cubes.push({
            x: (cubeX - centerPos.x) / blockSize,
            y: (cubeY - centerPos.y) / blockSize,
            ...productSelected
        });

        setPendingCubes(prev => [ ...p_cubes ]);
    }

    const endDragging = ( event ) => {
        setIsDragging(prev => !prev);
        
        const tempCubes = placedCubes.filter((cube) => {
            const res = pendingCubes.findIndex((item) => {
                return item.x === cube.x && item.y === cube.y
            });
            return res === -1;
        });
        updateHistoryArray([ ...historyArray, placedCubes ]);

        updatePlacedCubes( [ ...tempCubes, ...pendingCubes ] );

        setPendingCubes([]);
    }

    const removeCube = (index) => {
        updateHistoryArray([ ...historyArray, placedCubes ]);

        const temp = [ ...placedCubes ];
        temp.splice( index, 1 );

        updatePlacedCubes( [ ...temp ] );
    }

    const calc3DPos = (cube, axis) => {
        const t_x = centerPos.x + blockSize * ( + 0.54 * ( cube.x + 0.5 ) )
        const t_y = centerPos.y + blockSize * ( + 0.4 * ( cube.x + 0.5 ) )

        const x = t_x + blockSize * ( - 0.74 * (cube.y + 0.5) )
        const y = t_y + blockSize * ( + 0.29 * (cube.y + 0.5) )

        if( axis === 'x' )
            return x;
        else
            return y;
    }

    return (
        <div style={s.wrapper}>
            <Stage 
                { ...stageProps } 
                onMouseMove = { (e) => trackMousePos(e) } 
                onMouseDown = { (e) => startDragging(e) }
                onMouseUp = { (e) => endDragging(e) }
                >
                <Graphics draw={drawLines} />
                {  !view3D ? gridNumbers.map((num, index) => (
                    <Text
                        key={index}
                        text={num.number + 'm'}
                        anchor={0.5}
                        x={num.x}
                        y={num.y}
                        style={
                        new PIXI.TextStyle({
                            align: 'center',
                            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                            fontSize: 15,
                            fontWeight: 400,
                            fill: ['#ff6600'], // gradient
                        })
                        }
                    />
                )): null }
                {
                    placedCubes.map((cube, index) => (
                        <Container
                            key={index}
                        >
                            {
                                !view3D ? (
                                    <Sprite
                                        image={ cube.drawImg }
                                        scale={{ x: 1, y: 1 }}
                                        anchor={0.5}
                                        width={ blockSize * cube.width * cube.scaleX }
                                        height={ blockSize * cube.height * cube.scaleY }
                                        x={ centerPos.x + blockSize * cube.x }
                                        y={ centerPos.y + blockSize * cube.y }
                                    />
                                ): (
                                    <Sprite
                                        image={ cube.threeImg }
                                        scale={{ x: 1, y: 1 }}
                                        anchor={0.5}
                                        width={ blockSize * cube.width * 4 * 1.33242 }
                                        height={ blockSize * cube.height * 4 }
                                        x={ calc3DPos(cube, 'x') }
                                        y={ calc3DPos(cube, 'y') }
                                    />
                                )
                            }

                            {
                                deleteMode ? (
                                    <Sprite 
                                        image= { 'assets/img/products/close.png' }
                                        scale={{ x: 1, y: 1 }}
                                        anchor = {0.5}
                                        width={ blockSize / 3 }
                                        height={ blockSize / 3 }
                                        x={ centerPos.x + blockSize * cube.x }
                                        y={ centerPos.y + blockSize * cube.y }
                                        interactive={true}
                                        pointerdown={() => removeCube( index )}
                                    />
                                ) : null
                            }
                        </Container>
                    ))
                }
                {
                    productSelected.id ? ( 
                        <Container>
                            <Sprite
                                image={ productSelected.drawImg }
                                scale={{ x: 1, y: 1 }}
                                anchor={0.5}
                                width={ blockSize * productSelected.width * productSelected.scaleX }
                                height={ blockSize * productSelected.height * productSelected.scaleY }
                                x={ calcSelectedPos(mousePos, 'x') }
                                y={ calcSelectedPos(mousePos, 'y') }
                                alpha={0.5}
                            />
                            <Graphics draw={drawOverLay} />
                        </Container>
                    ) : null
                }
                {
                    isDragging && productSelected.id ? (
                        <Container>
                            { pendingCubes.map((cube, index) => (
                                <Sprite
                                    key={index}
                                    image={ productSelected.drawImg }
                                    scale={{ x: 1, y: 1 }}
                                    anchor={0.5}
                                    width={ blockSize * productSelected.width * productSelected.scaleX }
                                    height={ blockSize * productSelected.height * productSelected.scaleY }
                                    x={ centerPos.x + blockSize * cube.x }
                                    y={ centerPos.y + blockSize * cube.y }
                                    alpha={0.5}
                                />
                            )) }
                            
                            <Graphics draw={drawPendingOverLay} />
                        </Container>
                    ) : null
                }
            </Stage>
        </div>
    )
}

export default Panel;