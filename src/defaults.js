class Default {
    /**
     * 
     * @param { CanvasRenderingContext2D } ctx 
     * @param { number } width 
     * @param { number } height 
     * 
     * @returns { CanvasGradient | string }
     */
    static createBackground(ctx, width, height) {
        let grd = ctx.createLinearGradient(0, 0, width, height);
        grd.addColorStop(0, "#FF589E");
        grd.addColorStop(1, "#78BE8F");
        return grd;
    }

    /**
     * Returns true if the pixel is part of the foreground image
     * @param { number } x 
     * @param { number } y 
     * @param { number } width 
     * @param { number } height 
     * @returns { boolean }
     */
    static isVisibleAt(x, y, width, height) {
        return true;
    }
}

export default Default;