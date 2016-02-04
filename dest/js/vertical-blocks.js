"use strict";function VerticleBlocks(t){this.settings=this.extend(this.defaultSettings(),t),this.columns=1,this.$container=document.querySelector(this.settings.classname.container),this.$blocks=this.getBlocks(),this.numberOfBlocks=0,this.loadingBlocks=!1,this.imageLoadTimer=null,this.bwbp=[],this.init()}VerticleBlocks.prototype.containerUpdated=function(){var t=this;setInterval(function(){var e=t.getBlocks().length;e!==t.numberOfBlocks&&(t.loadingBlocks||(t.loadingBlocks=!0,t.htmlModified()))},100)},VerticleBlocks.prototype.init=function(){this.setUpBreakPoints(),this.settings.listenForContainer?this.containerUpdated():this.settings.imageLoader?this.loadImages():(this.$blocks=this.getBlocks(),this.numberOfBlocks=this.$blocks.length,this.updateColumn(this.getWidth()))},VerticleBlocks.prototype.htmlModified=function(){this.$blocks=this.getBlocks(),this.numberOfBlocks===this.$blocks.length?this.setup():0===this.$blocks.length?(this.numberOfBlocks=0,this.loadingBlocks=!1):this.settings.imageLoader?(this.numberOfBlocks=this.numberOfBlocks>this.$blocks.length?0:this.numberOfBlocks,this.loadImages()):(this.updateColumn(this.getWidth()),this.numberOfBlocks=this.$blocks.length)},VerticleBlocks.prototype.loadImages=function(){var t,e=this,o=0,s=this.$blocks.length,i=this.numberOfBlocks,n="";for(o=this.numberOfBlocks;s>o;o+=1)t=this.$blocks[o].querySelector(this.settings.classname.img),t?(n=String(t.src),t.onload=null,t.onerror=null,t.src="",t.onload=function(){i=e.imagesLoaded(i,s,"Loaded")},t.onerror=function(){i=e.imagesLoaded(i,s,"Error")},t.src=n):i=e.imagesLoaded(i,s,"None");this.numberOfBlocks=this.$blocks.length},VerticleBlocks.prototype.imagesLoaded=function(t,e){return t+=1,t===e&&this.updateColumn(this.getWidth()),t},VerticleBlocks.prototype.resetValues=function(){var t=0,e=this.$blocks.length;for(t=0;e>t;t+=1)this.$blocks[t]&&(this.$blocks[t].style.top="0")},VerticleBlocks.prototype.rowMaxHeight=function(t,e,o){var s=0,i=[];for(t=0;e>t;t+=1)s=Math.floor(t/this.columns),i[s]=i[s]||i.push(0),i[s]=o[t].clientHeight>i[s]?o[t].clientHeight:i[s];return i},VerticleBlocks.prototype.createColumnsArray=function(t,e,o){var s,i=0,n=[],l=0,r=0;for(t=0;e>t;t+=1)n[i]=n[i]||[],s=window.getComputedStyle(o[t],null),l=s.marginTop?parseFloat(s.marginTop)+parseFloat(s.marginBottom):0,r=parseFloat("number"==typeof parseFloat(s.height)?s.height:s.getPropertyValue("height")),n[i].push({height:r,ele:o[t],margin:l}),i=i>this.columns-2?0:i+=1;return n},VerticleBlocks.prototype.getAbsoluteHeight=function(t){var e=0,o=0,s=0,i=0,n=0;for(o=0;o<this.columns;o+=1)if(t[o]){for(i=t[o].length,s=0,e=0;i>e;e+=1)s+=t[o][e].height+t[o][e].margin;s>n&&(n=s)}this.$container.style.height=n+"px"},VerticleBlocks.prototype.updateBlocks=function(){this.$blocks=this.getBlocks(),this.loadingBlocks||(this.loadingBlocks=!0,this.setup())},VerticleBlocks.prototype.getBlocks=function(){return this.$container.querySelectorAll(this.settings.classname.block)},VerticleBlocks.prototype.setup=function(){this.resetValues();var t=0,e=0,o=this.$blocks.length,s=this.rowMaxHeight(t,o,this.$blocks),i=this.createColumnsArray(t,o,this.$blocks);for(this.getAbsoluteHeight(i),e=0;e<this.columns;e+=1)if(i[e]){for(o=i[e].length,t=0;o>t;t+=1)t>0&&(i[e][t].ele.style.top=i[e][t-1].height-s[t-1]+"px",i[e][t].height=i[e][t].height+(i[e][t-1].height-s[t-1])),i[e][t].ele.style.opacity="1";this.loadingBlocks=!1}},VerticleBlocks.prototype.getWidth=function(){var t=window,e="inner";return"innerWidth"in window||(e="client",t=document.documentElement||document.body),t[e+"Width"]},VerticleBlocks.prototype.setUpBreakPoints=function(){var t=this.settings,e=0,o=t.breakPoints.length,s=0,i=0;for(e=0;o>e;e+=1)s=t.breakPoints[e].position,i=o>e+1?t.breakPoints[e+1].position-1:1e4,this.bwbp.push([s,i,t.breakPoints[e].columns])},VerticleBlocks.prototype.updateColumn=function(t){var e=0;for(e=0;e<this.bwbp.length;e+=1)if(t>=this.bwbp[e][0]&&t<this.bwbp[e][1]){this.columns=this.bwbp[e][2],this.setup();break}this.browserResize()},VerticleBlocks.prototype.browserResize=function(){var t=this;window.onresize=function(){t.numberOfBlocks>0&&t.updateColumn(t.getWidth())}},VerticleBlocks.prototype.extend=function(t,e){var o=t;return Object.keys(e).forEach(function(t){o[t]=e[t]}),o},VerticleBlocks.prototype.defaultSettings=function(){return{listenForContainer:!0,imageLoader:!0,classname:{img:"img",container:".container",block:".box"},breakPoints:[{position:0,columns:1},{position:480,columns:2},{position:767,columns:3},{position:1024,columns:4},{position:1280,columns:4}]}},module.exports=VerticleBlocks;