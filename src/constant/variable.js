const products = {
    Cubes: [
        {
            id: 1,
            name: 'cube1',
            menuImg: '/assets/img/products/pro1.png',
            drawImg: '/assets/img/products/Picture1.png',
            width: 1,
            height: 1,
        },
        {
            id: 2,
            name: 'cube2',
            menuImg: '/assets/img/products/pro2.png',
            drawImg: '/assets/img/products/Picture2.png',
            width: 2,
            height: 1
        }
    ]
}

const stageProps = {
    height: window.innerHeight - 5,
    width: window.innerWidth - 5,
    options: {
        backgroundAlpha: 0,
        antialias: true,
    }
}

const blockSize = 125
const blockScale = {
    x: 1.1,
    y: 1.1
}
const dashDis = 5

export {products, stageProps, blockSize, blockScale, dashDis};