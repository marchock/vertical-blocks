/*global window */


// create a method or event to destroy and create or reload 

function VerticleBlocks(options) {

    this.settings = this.extend(this.defaultSettings(), options);
    this.columns = 1;

    this.$container = document.querySelector(this.settings.classname.container);
    this.$blockes = this.$container.querySelectorAll(this.settings.classname.block);

    this.bwbp = [];

    this.init();
}

VerticleBlocks.prototype.init = function () {
    this.setUpBreakPoints();
    this.updateColumn(this.getWidth());

    if (this.settings.listenForChanges) {
        this.domModifiedEvent();
    }
};


VerticleBlocks.prototype.domModifiedEvent = function () {

    var me = this,
        i = 0,
        eof = this.$blockes.length;

    for (i = 0; i < eof; i += 1) {
        this.$blockes[i].addEventListener("DOMSubtreeModified", function () {
            me.setup();
        });
    }
};

VerticleBlocks.prototype.resetValues = function () {
    var i = 0,
        eof = this.$blockes.length;

    for (i = 0; i < eof; i += 1) {
        this.$blockes[i].style.top = "0px";
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
        style;

    for (i = 0; i < eof; i += 1) {

        array[col] = array[col] || [];

        style = ele[i].currentStyle || window.getComputedStyle(ele[i]);

        margin = style.marginTop ? (parseFloat(style.marginTop) + parseFloat(style.marginBottom)) : 0;

        array[col].push({
            height: parseFloat(style.height),
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

    for (c = 0; c < this.columns; c += 1) {

        eof = columnsArray[c].length;
        h = 0;

        for (i = 0; i < eof; i += 1) {
            h += (columnsArray[c][i].height + columnsArray[c][i].margin);
        }

        if (totalHeight < h) {
            totalHeight = h;
        }
    }

    this.$container.style.height = totalHeight + "px";
};


VerticleBlocks.prototype.setup = function () {
    this.resetValues();

    var i = 0,
        c = 0,
        eof = this.$blockes.length,
        maxHeight = this.rowMaxHeight(i, eof, this.$blockes),
        columnsArray = this.createColumnsArray(i, eof, this.$blockes);

    this.getAbsoluteHeight(columnsArray);

    // column loop
    for (c = 0; c < this.columns; c += 1) {

        eof = columnsArray[c].length;

        // row loop
        for (i = 1; i < eof; i += 1) {

            columnsArray[c][i].ele.style.top = columnsArray[c][i - 1].height - maxHeight[i - 1] + "px";

            columnsArray[c][i].height = columnsArray[c][i].height + (columnsArray[c][i - 1].height - maxHeight[i - 1]);
        }
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
        me.updateColumn(me.getWidth());
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

        listenForChanges: true,

        classname: {

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