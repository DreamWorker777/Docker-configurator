const products = {
    Cubes: [
        {
            id: 1,
            name: 'cube1',
            menuImg: '/assets/img/products/pro1.png',
            drawImg: '/assets/img/products/Picture1.png',
            width: 1,
            height: 1,
            scaleX: 1.255,
            scaleY: 1.255,
        },
        // {
        //     id: 2,
        //     name: 'cube2',
        //     menuImg: '/assets/img/products/pro2.png',
        //     drawImg: '/assets/img/products/Picture2.png',
        //     width: 2,
        //     height: 1,
        //     scaleX: 1.2,
        //     scaleY: 1.26,
        // },
        {
            id: 3,
            name: 'cube2',
            menuImg: '/assets/img/products/pic1.png',
            drawImg: '/assets/img/products/pic1.png',
            width: 1,
            height: 1,
            scaleX: 1.23,
            scaleY: 1.23,
        },
        // {
        //     id: 4,
        //     name: 'cube4',
        //     menuImg: '/assets/img/products/pic2.png',
        //     drawImg: '/assets/img/products/pic2.png',
        //     width: 1,
        //     height: 1,
        //     scaleX: 1.23,
        //     scaleY: 1.23,
        // },
        {
            id: 5,
            name: 'cube3',
            menuImg: '/assets/img/products/pic3.png',
            drawImg: '/assets/img/products/pic3.png',
            width: 1,
            height: 1,
            scaleX: 1.23,
            scaleY: 1.23,
        },
        {
            id: 6,
            name: 'cube4',
            menuImg: '/assets/img/products/pic4.png',
            drawImg: '/assets/img/products/pic4.png',
            width: 1,
            height: 1,
            scaleX: 1.25,
            scaleY: 1.24,
        },
        {
            id: 7,
            name: 'test',
            menuImg: '/assets/img/products/pont01.png',
            drawImg: '/assets/img/products/pont01.png',
            threeImg: '/assets/img/products/3d_pro.png',
            width: 1,
            height: 1,
            scaleX: 1.22,
            scaleY: 1.22,
        },
    ]
}

const stageProps = {
    height: window.innerHeight - 5,
    width: window.innerWidth,
    options: {
        backgroundAlpha: 0,
        antialias: true,
    }
}

const dashDis = 5

export {products, stageProps, dashDis};