import React from "react";
import Default from "./defaults";
import PerlinNoise from "./perlin-noise";
import SlitherManager from "./slither-manager";
const PIXI = require("./pixi.min");

/**
 * A React package for creating text made of slithering lines
 * @class
 * @extends { React.Component }
 */
class SlitherText extends React.Component {

    /**
     * Creates a SlitherText instance
     * @param { object } props 
     */
    constructor(props) {
        super(props);

        /**
         * The state of the slither text
         * @type { object }
         */
        this.state = {
            
            /**
             * The width
             */
            width: (parseInt(this.props.width) || window.innerWidth) * window.devicePixelRatio,
            height: (parseInt(this.props.height) || window.innerHeight)* window.devicePixelRatio,
            ratio: this.props.devicePixelRatio || window.devicePixelRatio || 1
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

            this.fg.renderer.resize(this.canvas.width, this.canvas.height);
            this.fg.stage.scale.x = 1.0;
            this.fg.stage.scale.y = 1.0;
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
    }

    /**
     * Creates a PIXI.Application instance if one isn't already running
     * @param { HTMLCanvasElement } c 
     */
    onLoad(c) {
        this.canvas = c;
        if (!this.app) {
            this.app = new PIXI.Application({
                width: this.state.width,
                height: this.state.height,
                transparent: true,
                antialias: true,
                view: c,
                roundPixels: true,
                preserveDrawingBuffer: true
            });

            //let f = new PIXI.SpriteMaskFilter(PIXI.Sprite.fromImage(this.maskSrc));
            //this.app.stage.filters = [ f ];
            // this.app.stage.mask = new PIXI.Sprite.fromImage(this.maskSrc);
            // this.app.stage.addChild(this.app.stage.mask);

            console.log(this.app);

            this.slitherManager = new SlitherManager(this.state.width, this.state.height, this.app);
        }        
    }

    onForegroundLoad(c) {
        if (!this.fg) {
            this.fg = new PIXI.Application({
                width: this.state.width,
                height: this.state.height,
                transparent: true,
                antialias: true,
                view: c,
                roundPixels: true
            });

            console.log(this.fg);

            this.fg.stage.addChild(new PIXI.Sprite(PIXI.Texture.fromCanvas(this.app.view)));

            let f = new PIXI.SpriteMaskFilter(PIXI.Sprite.fromImage(this.maskSrc));
            this.fg.stage.filters = [ f ];

            console.log(this.app.view);

            this.fg.ticker.add(() => {
                // this.fg.stage.children[0].texture = PIXI.Texture.fromImage(this.app.view.toDataURL());
                this.fg.stage.children[0].texture.update();
            })

            //this.slitherManager = new SlitherManager(this.state.width, this.state.height, this.app);
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
                {/* Hidden canvas */}
                <canvas id="slither-text-canvas"
                    ref={ (c) => { this.onLoad(c); } }
                    style={ { 
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        overflow: "hidden",
                        display: "none"
                    } }
                >

                </canvas>

                {/* Foreground (visible) canvas */}
                <canvas id="slither-text-foreground"
                    ref={ (c) => { this.onForegroundLoad(c); } }
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