import React, {useCallback, useState} from 'react';
import { Stage, Graphics, Text } from '@inlet/react-pixi';
import Background from '../assets/back/back.jpg';
import * as PIXI from 'pixi.js';

const Panel = () => {
    const [ gridNumbers, setGridNumbers ] = useState([]);

    const stageProps = {
        height: window.innerHeight - 5,
        width: window.innerWidth - 5,
        options: {
            backgroundAlpha: 0,
            antialias: true,
        }
    }

    const centerPos = {
        x: stageProps.width / 2 + 160,
        y: stageProps.height / 2
    }

    const blockSize = 125
    const dashDis = 5
    
    const s = {
        wrapper: {
            backgroundImage: `url(${Background})`,
            backgroundSize: 'contain'
        }
    }

    const distance = (p1, p2) => Math.sqrt( Math.pow( (p1.x - p2.x), 2 ) + Math.pow( (p1.y - p2.y), 2 ) );

    const drawDashLine = ( g, p1, p2 ) => {
        const len = Math.ceil(distance(p1, p2) / dashDis);
        
        const xOffset = (p2.x - p1.x) / len;
        const yOffset = (p2.y - p1.y) / len;
        
        for( let i = 0; i < len; i++ ) {
            g.lineStyle(1, 0xffffff, i % 2 === 0 ? 1 : 0);
            g.moveTo( p1.x + i * xOffset, p1.y + i * yOffset );
            g.lineTo( p1.x + (i + 1) * xOffset, p1.y + (i + 1) * yOffset );
        }
    }

    const draw = useCallback(g => {
        g.clear()
        g.lineStyle(1, 0xffffff, 1)
        for( let i = 0; i < 20; i++ ) {
            drawDashLine( g, { x: 0, y: centerPos.y - i * blockSize }, { x: stageProps.width, y: centerPos.y - i * blockSize } );
            drawDashLine( g, { x: 0, y: centerPos.y + i * blockSize }, { x: stageProps.width, y: centerPos.y + i * blockSize } );

            drawDashLine( g, { x: centerPos.x - i * blockSize, y: 0 }, { x: centerPos.x - i * blockSize, y: stageProps.height } );
            drawDashLine( g, { x: centerPos.x + i * blockSize, y: 0 }, { x: centerPos.x + i * blockSize, y: stageProps.height } );

            if( i % 2 === 0 ) {
                const data = [
                    { number: Math.floor( - i / 2), x: 325, y: centerPos.y - i * blockSize },
                    { number: Math.floor( i / 2 ), x: 325, y: centerPos.y + i * blockSize },
                    { number: Math.floor( - i / 2 ), x: centerPos.x - i * blockSize, y: 20 },
                    { number: Math.floor( i / 2 ), x: centerPos.x + i * blockSize, y: 20 },
                ]

                setGridNumbers(prev => [...prev, ...data]);
            }
        }
      }, [])

    return (
        <div style={s.wrapper}>
            <Stage { ...stageProps }>
                <Graphics draw={draw} />
                { gridNumbers.map((num, index) => (
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
                )) }
            </Stage>
        </div>
    )
}

export default Panel;