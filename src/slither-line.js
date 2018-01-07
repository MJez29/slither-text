import React from "react";
import SlitherManager from "./slither-manager";

class SlitherLine extends React.Component {

    static get length() {
        return 400;
    }
    
    constructor(props) {
        super(props);
        this.y = -SlitherLine.length - 1;
    }

    update() {
        if (this.y < -SlitherLine.length) {
            if (Math.random() > 0.999)
                this.y = this.props.height;
        } else {
            this.ctx.clearRect(0, 0, this.props.width, this.props.height);
            this.ctx.globalAlpha = 1;
            this.ctx.drawImage(PerlinManager.canvas, 0, Math.max(0, this.y), this.props.width, SlitherLine.length - 100 + Math.min(0, this.y),
                0, Math.max(0, this.y), this.props.width, SlitherLine.length - 100 + Math.min(0, this.y));
            this.ctx.globalAlpha = 0.5;
            this.ctx.drawImage(PerlinManager.canvas, 0, Math.max(0, this.y+ SlitherLine.length - 100), this.props.width, 100 + Math.min(0, this.y),
                0, Math.max(0, this.y+ SlitherLine.length - 100), this.props.width, 100 + Math.min(0, this.y));
            this.y -= 2;
        }
        requestAnimationFrame(() => this.update());
    }

    render() {
        return (
            <canvas width={this.props.width} height={this.props.height} ref={(c)=>{if(c) {this.ctx = c.getContext("2d");requestAnimationFrame(() => this.update());}}}
                style={ { position: "absolute", left: this.props.offset, top: 0} }>

            </canvas>
        )
    }

}

export default SlitherLine;