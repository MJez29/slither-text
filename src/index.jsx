import React from "react";
import Default from "./defaults";
import PerlinNoise from "./perlin-noise";
import SlitherManager from "./slither-manager";
import CutoffFilter from "./cutoff-filter";
const PIXI = require("pixi.js");

class SlitherText extends React.Component {

    constructor(props) {
        super(props);

        /**
         * The state of the slither text
         * @type { object }
         */
        this.state = {
            /**
             * Details about the screen
             * @type { { width: number, height: number, ratio: number } }
             */
            width: (parseInt(this.props.width) || window.innerWidth) * window.devicePixelRatio,
            height: (parseInt(this.props.height) || window.innerHeight)* window.devicePixelRatio,
            ratio: this.props.devicePixelRatio || window.devicePixelRatio || 1,

            /**
             * The canvas drawing context
             */
            context: null
        };

        /**
         * A function to create the background of the canvas
         * 
         * @type { function(CanvasRenderingContext2D, number, number) }
         */
        this.createBackground = this.props.createBackground || Default.createBackground;

        this.maskSrc = this.props.maskSrc;

        /**
         * @type { Pixel[] }
         */
        this.dirtyPixels = [];

        /**
         * Returns whether or not the pixel is part of the foreground image
         * @param { number } x
         * @param { number } y
         * @param { number } width
         * @param { number } height
         * @returns { boolean }
         */
        this.isVisibleAt = this.props.isVisibleAt || Default.isVisibleAt;

        //this.slitherManager = new SlitherManager(this.state.width, this.state.height);
        console.log("WEBGL: " + PIXI.utils.isWebGLSupported());
    }

    /**
     * Handles screen resizes
     * 
     * @param {*} value 
     * @param {*} e 
     */
    handleResize(value, e) {
        this.setState({
            width: this.containerDiv.offsetWidth * window.devicePixelRatio,
            height: this.containerDiv.offsetHeight * window.devicePixelRatio,
            ratio: window.devicePixelRatio || 1
        })
        if (this.app) {
            this.canvas.style.width = (this.canvas.width = this.containerDiv.offsetWidth * 
                window.devicePixelRatio) + "px";
            this.canvas.style.height = (this.canvas.height = this.containerDiv.offsetHeight *
                window.devicePixelRatio) + "px";
            
            this.app.renderer.resize(this.canvas.width, this.canvas.height);
            this.app.stage.scale.x = 1.0;
            this.app.stage.scale.y = 1.0;
        }
        // if (this.slitherManager) {
        //     this.slitherManager.updateDimensions(this.state.width, this.state.height);
        // }
        console.log("RESIZE");
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize.bind(this));

        if (this.state.width != this.containerDiv.clientWidth || this.state.height != this.containerDiv.clientHeight) {
            this.setState({
                width: this.containerDiv.clientWidth,
                height: this.containerDiv.clientHeight
            });
        }
        console.log("MOUNT");
        //requestAnimationFrame(() => { this.update() });
    }

    onLoad(c) {
        this.canvas = c;
        if (!this.app) {
            console.log("BOOM:");
            console.log(this.app);
            //this.app.destroy(true);
        //}
            this.app = new PIXI.Application({
                width: this.state.width,
                height: this.state.height,
                transparent: true,
                antialias: true,
                view: c,
                roundPixels: true
            });
            this.root = new PIXI.Container();
            this.app.stage.addChild(this.root);
            let f = new PIXI.SpriteMaskFilter(PIXI.Sprite.fromImage(this.maskSrc));
            //f.blendMode = PIXI.BLEND_MODES.MULTIPLY;
            let v = new PIXI.filters.VoidFilter();
            v.blendMode = PIXI.BLEND_MODES.NORMAL;
            this.root.filters = [ f ];
            //this.app.stage.filters[1].blendMode = PIXI.BLEND_MODES.MULTIPLY;
            // this.app.stage.mask = new PIXI.Sprite.fromImage(this.maskSrc);
            // this.app.stage.blendMode = PIXI.BLEND_MODES.MULTIPLY;
            // this.app.stage.mask.blendMode = PIXI.BLEND_MODES.MULTIPLY;
            // this.app.stage.addChild(this.app.stage.mask);

            this.slitherManager = new SlitherManager(this.state.width, this.state.height, this.app);
        }        
    }

    render() {

        return (
            <div style={ {
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    overflow: "hidden",
                    //backgroundColor: "transparent"
                }}
                ref={ (d) => { this.containerDiv = d;} }
            >
                {/* Foreground (visible) canvas */}
                <canvas id="slither-text-canvas"
                    ref={ (c) => { this.onLoad(c); } }
                    style={ { 
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        overflow: "hidden"
                    } }
                >

                </canvas>
            </div>
        )
    }
}

export default SlitherText;