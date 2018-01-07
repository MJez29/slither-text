import React from "react";
import Default from "./defaults";
import PerlinNoise from "./perlin-noise";
import SlitherManager from "./slither-manager";
import SlitherLine from "./slither-line";

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
            width: this.props.width || window.innerWidth,
            height: this.props.height || window.innerHeight,
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

        this.slitherManager = new SlitherManager(this.state.width, this.state.height);

    }

    /**
     * Handles screen resizes
     * 
     * @param {*} value 
     * @param {*} e 
     */
    handleResize(value, e) {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.devicePixelRatio || 1
        })
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

    update() {

        if (this.visibleContext) {
            this.visibleContext.fillStyle = this.background;
            this.visibleContext.fillRect(0,0,this.state.width,this.state.height);
            this.visibleContext.fillStyle = "#FFFFFF";
            this.visibleContext.beginPath();
            this.visibleContext.arc(100, 100, 25, 0, Math.PI * 2);
            this.visibleContext.fill();
            this.visibleContext.beginPath();
            this.slitherManager.draw(this.visibleContext);
            this.visibleContext.fill();
            //console.log("index.js:update()");
        }

        requestAnimationFrame(() => { this.update() });
    }

    setVisibleContext(c) {
        if (c) {
            this.visibleContext = c.getContext("2d");
            this.visibleContext.fillStyle = this.background;
            this.visibleContext.fillRect(0, 0, this.state.width, this.state.height);
            this.visibleContext.save();
            this.perlin = new PerlinNoise(100, 0.01);
            this.x = 0;
            
            this.background = this.createBackground(this.visibleContext, this.state.width, this.state.height);
        }
    }

    setHiddenContext(c, p) {
        if (!this.hiddenCanvases) {
            this.hiddenCanvases = [];
        }

        this.hiddenCanvases[p] = c;
    }

    render() {

        return (
            <div style={ {
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    overflow: "hidden"
                }}
                ref={ (d) => this.containerDiv = d }
            >
                {/* Background (hidden) canvas */}
                <canvas id="slither-text-hidden-0" width={this.state.width} height={this.state.height}
                    ref={ (b) => { this.setHiddenContext(b, 0); } } hidden
                >

                </canvas>

                {/* Background (hidden) canvas */}
                <canvas id="slither-text-hidden-1" width={this.state.width} height={this.state.height}
                    ref={ (b) => { this.setHiddenContext(b, 1); } } hidden
                >

                </canvas>

                {/* Foreground (visible) canvas */}
                <canvas id="slither-text-canvas" width={this.state.width} height={this.state.height}
                    ref={ (c) => { this.setVisibleContext(c); requestAnimationFrame(() => { this.update(true) }); } }
                >

                </canvas>
            </div>
        )
    }
}

export default SlitherText;