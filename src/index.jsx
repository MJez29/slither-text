import React from "react";
import Default from "./defaults";
import Pixel from "./pixel";
import PerlinNoise from "./perlin-noise";
import PerlinManager from "./perlin-manager";
import SlitherLine from "./slither-line";

class SlitherText extends React.Component {

    constructor(props) {
        super(props);

        for (let i = 0; i < 1000; i++) {
            let c = document.createElement("canvas");
            c.width = 1000;
            c.height = 1000;
        }

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

    update(firstFrame) {

        if (this.visibleContext) {
            this.visibleContext.fillStyle = this.createBackground(this.visibleContext, this.state.width, this.state.height);
            this.visibleContext.fillRect(0,0,this.state.width,this.state.height);

            let c = this.hiddenCanvases[0].getContext("2d");
            c.clearRect(0, 0, this.state.width, this.state.height);
            //c.globalAlpha = 0.5;
            c.drawImage(this.hiddenCanvases[1], 0, 0);
            c.globalAlpha = 5;
            let y = this.perlin.getNoise(this.x) + 400;
            c.beginPath();
            c.arc(this.x += 1,y, 0.75,0,2*Math.PI);
            c.fillStyle = "#FFFFFF";
            c.fill();
            c.beginPath();
            c.arc(this.x - 10,y - 5, 0.75,0,2*Math.PI);
            c.fillStyle = "#FFFFFF";
            c.fill();
            c.beginPath();
            c.arc(this.x - 5,y + 10, 0.75,0,2*Math.PI);
            c.fillStyle = "#FFFFFF";
            c.fill();
            this.visibleContext.drawImage(this.hiddenCanvases[0], 0, 0);
            this.hiddenCanvases.reverse();
        }

        requestAnimationFrame(() => { this.update() });
    }

    setVisibleContext(c) {
        if (c) {
            this.visibleContext = c.getContext("2d");
            this.visibleContext.fillStyle = this.createBackground(this.visibleContext, this.state.width, this.state.height);
            this.visibleContext.fillRect(0, 0, this.state.width, this.state.height);
            this.visibleContext.save();
            this.perlin = new PerlinNoise(100, 0.01);
            this.x = 0;
        }
    }

    setHiddenContext(c, p) {
        if (!this.hiddenCanvases) {
            this.hiddenCanvases = [];
        }

        this.hiddenCanvases[p] = c;
    }

    render() {
        PerlinManager.setup(100, this.state.height);
        let slitherLines = [];
        for (let i = 0; i < this.state.width; i += 4)
            slitherLines.push(<SlitherLine width={100} height={this.props.height} offset={i} />);

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
                {
                    slitherLines
                }
            </div>
        )
    }
}

export default SlitherText;