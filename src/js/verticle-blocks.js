// TESTED on ie9,10,11, chrome, safari, firefox, ios and android all working

/*global window */


// create a method or event to destroy and create or reload 




// might need a class name for the images that are require to load before running vertical blocks

// if images are background image then image loader not needed , create a test

function VerticleBlocks(options) {

    this.settings = this.extend(this.defaultSettings(), options);
    this.columns = 1;

    this.$container = document.querySelector(this.settings.classname.container);
    this.$blocks = this.getBlocks();

    this.numberOfBlocks = 0;

    this.loadingBlocks = false;

    this.imageLoadTimer = null;

    this.bwbp = [];

    this.init();
}

VerticleBlocks.prototype.containerUpdated = function () {

    var me = this;

    setInterval(function () {
        var num = me.getBlocks().length;

        // check if the number of blocks is the same as the previous number
        if (num !== me.numberOfBlocks) {
            if (!me.loadingBlocks) {
                me.loadingBlocks = true;
                me.htmlModified();
            }  
        }
    }, 100);
};

VerticleBlocks.prototype.init = function () {
    this.setUpBreakPoints();

    if (this.settings.listenForContainer) {
        this.containerUpdated();
    } else {
        
        if (this.settings.imageLoader) {
            this.loadImages();
        } else {
            this.updateColumn(this.getWidth());
        }
    }
};

VerticleBlocks.prototype.htmlModified = function () {

    this.$blocks = this.getBlocks();

    if (this.numberOfBlocks === this.$blocks.length) {
        // block content updated
        this.setup();
    } else if (this.$blocks.length === 0) {

        // blocks have been deleted
        this.numberOfBlocks = 0;
        this.loadingBlocks = false;

    } else {

        if (this.settings.imageLoader) {
            // new blocks added
            this.loadImages();
        } else {
            this.numberOfBlocks = this.$blocks.length;
            this.updateColumn(this.getWidth());
        }
    }
};

VerticleBlocks.prototype.loadImages = function () {
    // check all images are loaded and then initiate vertical blocks 

    var me = this,
        i = 0,
        eof = this.$blocks.length,
        imgLoaded = this.numberOfBlocks,
        img,
        src = "";

    for (i = this.numberOfBlocks; i < eof; i += 1) {

        img = this.$blocks[i].querySelector(String(this.settings.classname.img));

        // is there an image 
        if (img) {

            src = String(img.src);

            
            img.onload = null;
            img.onerror = null;

            // Safari and IOS fix 
            // reseting the src to an empty string and reasigning the image src
            // stops the image loading from sticking (use console logs to test)
            img.src = "";

            // add event listener to image to know if image is loaded 
            img.onload = function (e) {

                imgLoaded = me.imagesLoaded(imgLoaded, eof, "Loaded");
            };

            // add event listener to image to know if image has failed 
            img.onerror = function (e) {

                imgLoaded = me.imagesLoaded(imgLoaded, eof, "Error");
            };

            // add image src
            img.src = src;

        } else {
            // no image 
            imgLoaded = me.imagesLoaded(imgLoaded, eof, "None");
        }
    }

    this.numberOfBlocks = this.$blocks.length;
};

VerticleBlocks.prototype.imagesLoaded = function (imgLoaded, eof, string) {
    imgLoaded += 1;

    if (imgLoaded === eof) {
        this.updateColumn(this.getWidth());
    }
    return imgLoaded;
};


VerticleBlocks.prototype.resetValues = function () {
    var i = 0,
        eof = this.$blocks.length;

    for (i = 0; i < eof; i += 1) {
        this.$blocks[i].style.top = "0px";
    }
};

VerticleBlocks.prototype.rowMaxHeight = function (i, eof, ele) {
    var row = 0,
        maxHeight = [];

    for (i = 0; i < eof; i += 1) {

        row = Math.floor(i / this.columns);

        maxHeight[row] = maxHeight[row] || maxHeight.push(0);

        maxHeight[row] = ele[i].clientHeight > maxHeight[row] ? ele[i].clientHeight : maxHeight[row];
    }
    return maxHeight;
};


VerticleBlocks.prototype.createColumnsArray = function (i, eof, ele) {

    var col = 0,
        array = [],
        margin = 0,
        style,
        height = 0;


    function updateArray() {}

    for (i = 0; i < eof; i += 1) {

        array[col] = array[col] || [];

        style = window.getComputedStyle(ele[i], null);

        // get margin top and bottom height
        margin = style.marginTop ? (parseFloat(style.marginTop) + parseFloat(style.marginBottom)) : 0;

        if (typeof parseFloat(style.height) === "Number") {
            height = parseFloat(style.height);
        } else {
            // IE
            height = parseFloat(style.getPropertyValue("height"));
        }

        array[col].push({
            height: height,
            ele: ele[i],
            margin: margin
        });

        col = col > (this.columns - 2) ? 0 : (col += 1);
    }
    return array;
};


VerticleBlocks.prototype.getAbsoluteHeight = function (columnsArray) {

    var i = 0,
        c = 0,
        h = 0,
        eof = 0,
        totalHeight = 0;

    // column loop
    for (c = 0; c < this.columns; c += 1) {

        eof = columnsArray[c].length;
        h = 0;

        // row loop
        for (i = 0; i < eof; i += 1) {
            h += (columnsArray[c][i].height + columnsArray[c][i].margin);
        }

        // find the tallest column and asign the height 
        // to the container
        if (totalHeight < h) {
            totalHeight = h;
        }
    }

    this.$container.style.height = totalHeight + "px";
};

VerticleBlocks.prototype.updateBlocks = function () {
    this.$blocks = this.getBlocks();

    if (!this.loadingBlocks) {
        this.loadingBlocks = true;
        this.setup();
    }
};

VerticleBlocks.prototype.getBlocks = function () {
    return this.$container.querySelectorAll(this.settings.classname.block);
};


VerticleBlocks.prototype.setup = function () {
    this.resetValues();

    var i = 0,
        c = 0,
        eof = this.$blocks.length,
        maxHeight = this.rowMaxHeight(i, eof, this.$blocks),
        columnsArray = this.createColumnsArray(i, eof, this.$blocks);

    this.getAbsoluteHeight(columnsArray);

    // column loop
    for (c = 0; c < this.columns; c += 1) {

        eof = columnsArray[c].length;

        // row loop
        for (i = 0; i < eof; i += 1) {

            // the first row does not require a top position
            if (i > 0) {
                columnsArray[c][i].ele.style.top = columnsArray[c][i - 1].height - maxHeight[i - 1] + "px";

                columnsArray[c][i].height = columnsArray[c][i].height + (columnsArray[c][i - 1].height - maxHeight[i - 1]);
            }

            columnsArray[c][i].ele.style.opacity = "1";
        }
        this.loadingBlocks = false;
    }
};

VerticleBlocks.prototype.getWidth = function () {
    //http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/   

    var e = window, a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return e[a + 'Width'];
};


VerticleBlocks.prototype.setUpBreakPoints = function () {

    var s = this.settings,
        i = 0,
        eof = s.breakPoints.length,
        startPosition = 0,
        endPosition = 0;

    for (i = 0; i < eof; i += 1) {
        startPosition = s.breakPoints[i].position;
        endPosition = eof > (i + 1) ? (s.breakPoints[i + 1].position - 1) : 10000;
        this.bwbp.push([startPosition, endPosition, s.breakPoints[i].columns]);
    }
};


VerticleBlocks.prototype.updateColumn = function (w) {
    var i = 0;

    for (i = 0; i < this.bwbp.length; i += 1) {
        if (w >= this.bwbp[i][0] &&  w < this.bwbp[i][1]) {
            this.columns = this.bwbp[i][2];
            this.setup();
            break;
        }
    }
    this.browserResize();
};


VerticleBlocks.prototype.browserResize = function () {
    var me = this;
    window.onresize = function () {
        if (me.numberOfBlocks > 0) {
            me.updateColumn(me.getWidth());
        }
    };
};

VerticleBlocks.prototype.extend = function (defaultSettings, options) {

    var settings = defaultSettings;
    Object.keys(options).forEach(function (key) {
        settings[key] = options[key];
    });
    return settings;
};

VerticleBlocks.prototype.defaultSettings = function () {

    return {

        listenForContainer: true,

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
    };
};