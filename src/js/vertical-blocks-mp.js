// Module pattern
// https://carldanley.com/js-module-pattern/


var VerticalBlocks = (function() {
  // this object is used to store private variables and methods across multiple instantiations
    var settings = null,

        col = 1,

        container = null,

        blocks = null,

        numberOfBlocks = 0,

        loadingBlocks = false,

        imageLoadTimer = null,

        bwbp = [];

    function VerticalBlocks(options) {

        this.init = function (options) {
            console.log("WORKING", this)
            settings = this.extend(this.defaultSettings(), options);
            container = document.querySelector(settings.classname.container);
            blocks = this.getBlocks();
            this.setUpBreakPoints();

            // Listen for adding and removing of blocks inside the container
            if (settings.listenForContainer) {
                this.containerUpdated();

            } else {

                // Load images before positioning blocks
                if (settings.imageLoader) {
                    this.loadImages();

                // No image loading
                } else {
                    blocks = this.getBlocks();
                    numberOfBlocks = blocks.length;
                    this.updateColumn(this.getWidth());
                }
            }
        };

        this.containerUpdated = function () {

            var me = this;

            setInterval(function () {
                var num = me.getBlocks().length;

                // check if the number of blocks is the same as the previous number
                if (num !== numberOfBlocks) {
                    if (!loadingBlocks) {
                        loadingBlocks = true;
                        me.htmlModified();
                    }
                }
            }, 100);
        };


        this.htmlModified = function () {

            blocks = this.getBlocks();

            // TODO: remove if not needed
            if (numberOfBlocks === blocks.length) {
                // block content updated
                this.setup();

            // if no blocks inside the container
            } else if (blocks.length === 0) {

                // blocks have been deleted
                numberOfBlocks = 0;
                loadingBlocks = false;

            // Number of blocks inside the container has changed
            } else {

                // Load images before positioning blocks
                if (settings.imageLoader) {

                    // fixed app from breaking
                    // it was stuck on loadingBlocks = true
                    // stopping app from loading images
                    numberOfBlocks = numberOfBlocks > blocks.length ? 0 : numberOfBlocks;

                    this.loadImages();
                // No image loading
                } else {
                    this.updateColumn(this.getWidth());
                    numberOfBlocks = blocks.length;
                }
            }
        };

        this.loadImages = function () {
            // check all images are loaded and then initiate vertical blocks

            var me = this,
                i = 0,
                eof = blocks.length,
                imgLoaded = numberOfBlocks,
                img,
                src = '';

            for (i = numberOfBlocks; i < eof; i += 1) {

                img = blocks[i].querySelector(settings.classname.img);

                // is there an image
                if (img) {

                    src = String(img.src);

                    img.onload = null;
                    img.onerror = null;

                    // Safari and IOS fix
                    // reseting the src to an empty string and reasigning the image src
                    // stops the image loading from sticking (use console logs to test)
                    img.src = '';

                    // add event listener to image to know if image is loaded
                    img.onload = function () {
                        imgLoaded = me.imagesLoaded(imgLoaded, eof, 'Loaded');
                    };

                    // add event listener to image to know if image has failed
                    img.onerror = function () {
                        imgLoaded = me.imagesLoaded(imgLoaded, eof, 'Error');
                    };

                    // add image src
                    img.src = src;

                } else {
                    // no image
                    imgLoaded = me.imagesLoaded(imgLoaded, eof, 'None');
                }
            }

            numberOfBlocks = blocks.length;
        };

        this.imagesLoaded = function (imgLoaded, eof, string) {
            imgLoaded += 1;

            if (imgLoaded === eof) {
                this.updateColumn(this.getWidth());
            }
            return imgLoaded;
        };


        this.resetValues = function () {
            var i = 0,
                eof = blocks.length;

            for (i = 0; i < eof; i += 1) {

                if(!!blocks[i]){

                    blocks[i].style.top = '0';
                }
            }
        };

        this.rowMaxHeight = function (i, eof, ele) {
            var row = 0,
                maxHeight = [];

            for (i = 0; i < eof; i += 1) {

                row = Math.floor(i / this.columns);

                maxHeight[row] = maxHeight[row] || maxHeight.push(0);

                maxHeight[row] = ele[i].clientHeight > maxHeight[row] ? ele[i].clientHeight : maxHeight[row];
            }
            return maxHeight;
        };


        this.createColumnsArray = function (i, eof, ele) {

            var col = 0,
                array = [],
                margin = 0,
                style,
                height = 0;

            for (i = 0; i < eof; i += 1) {

                array[col] = array[col] || [];

                style = window.getComputedStyle(ele[i], null);

                // get margin top and bottom height
                margin = style.marginTop ? (parseFloat(style.marginTop) + parseFloat(style.marginBottom)) : 0;

                if (typeof parseFloat(style.height) === 'number') {
                    height = parseFloat(style.height);
                } else {
                    // IE
                    height = parseFloat(style.getPropertyValue('height'));
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


        this.getAbsoluteHeight = function (columnsArray) {

            var i = 0,
                c = 0,
                h = 0,
                eof = 0,
                totalHeight = 0;

            // column loop
            for (c = 0; c < this.columns; c += 1) {

                if(!!columnsArray[c]){

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
            }

            container.style.height = totalHeight + 'px';
        };

        this.updateBlocks = function () {
            blocks = this.getBlocks();

            if (!loadingBlocks) {
                loadingBlocks = true;
                this.setup();
            }
        };

        this.getBlocks = function () {
            return container.querySelectorAll(settings.classname.block);
        };


        this.setup = function () {
            this.resetValues();

            var i = 0,
                c = 0,
                eof = blocks.length,
                maxHeight = this.rowMaxHeight(i, eof, blocks),
                columnsArray = this.createColumnsArray(i, eof, blocks);

            this.getAbsoluteHeight(columnsArray);

            // column loop
            for (c = 0; c < this.columns; c += 1) {

                if(!!columnsArray[c]){

                    eof = columnsArray[c].length;

                    // row loop
                    for (i = 0; i < eof; i += 1) {

                        // the first row does not require a top position
                        if (i > 0) {
                            columnsArray[c][i].ele.style.top = columnsArray[c][i - 1].height - maxHeight[i - 1] + 'px';

                            columnsArray[c][i].height = columnsArray[c][i].height + (columnsArray[c][i - 1].height - maxHeight[i - 1]);
                        }

                        columnsArray[c][i].ele.style.opacity = '1';
                    }
                    loadingBlocks = false;

                }

            }
        };

        this.getWidth = function () {
            //http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/

            var e = window, a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return e[a + 'Width'];
        };


        this.setUpBreakPoints = function () {

            var s = settings,
                i = 0,
                eof = s.breakPoints.length,
                startPosition = 0,
                endPosition = 0;

            for (i = 0; i < eof; i += 1) {
                startPosition = s.breakPoints[i].position;
                endPosition = eof > (i + 1) ? (s.breakPoints[i + 1].position - 1) : 10000;
                bwbp.push([startPosition, endPosition, s.breakPoints[i].columns]);
            }
        };


        this.updateColumn = function (w) {
            var i = 0;

            for (i = 0; i < bwbp.length; i += 1) {
                if (w >= bwbp[i][0] &&  w < bwbp[i][1]) {
                    this.columns = bwbp[i][2];
                    this.setup();
                    break;
                }
            }
            this.browserResize();
        };


        this.browserResize = function () {
            var me = this;
            window.onresize = function () {
                if (numberOfBlocks > 0) {
                    me.updateColumn(me.getWidth());
                }
            };
        };


        this.extend = function (defaultSettings, options) {
            var s = defaultSettings;
            Object.keys(options).forEach(function (key) {
                s[key] = options[key];
            });
            return s;
        };

        this.defaultSettings = function () {
            return {
                listenForContainer: true,
                imageLoader: true,
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
        // init the module
        this.init(options);
    }
    return VerticalBlocks;
})();