verticle-blocks.js
=====
A light weight plugin with no dependencies that positions html elements to fit vertically 

http://marchock.github.io/vertical-blocks/


###Features
- specify breakpoints 
- specify classNames
- set container to listen for updates



```

"Defualt properties"

var verticleBlocks = new VerticleBlocks({

        listenForContainer: false,

        imageLoader: false,

        classname: {

            img: "img",

            container: ".container",

            block: ".box"
        },

        breakPoints: [
            {
                position: 0,
                columns: 1
            },
            {
                position: 480,
                columns: 2
            },
            {
                position: 1024,
                columns: 3
            },
            {
                position: 1280,
                columns: 4
            }
        ]
    });

```
