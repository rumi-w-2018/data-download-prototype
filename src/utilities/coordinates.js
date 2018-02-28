
const fixProductExtent = (extentCoords) => {
    // Nation-wide dataset extent looks like this. maxX (extentCoords[2]) needs to be corrected.
    // [-179.229655487448, -14.4246950942767, 179.856674735386, 71.4395725901531]
    // Correcting maxX (extentCoords[2])
    const origMinX = extentCoords[0];
    const origMaxX = extentCoords[2];
    if (origMaxX > 150) {
        extentCoords[0] = -180 - (180 - origMaxX); //minX
        if (origMinX < -65) {
            extentCoords[2] = origMaxX; //maxX
        } else {
            extentCoords[2] = origMinX; //maxX
        }
    }
    return extentCoords;
};

export const getProdFootprintBounds = (boundingBox) => {

    let left, right, bottom, top;
    if( boundingBox.minX <= boundingBox.maxX ){
        left = boundingBox.minX;
        right = boundingBox.maxX;
    }else{
        left = boundingBox.maxX;
        right =  boundingBox.minX;
    }

    if (boundingBox.minY <= boundingBox.maxY){
        bottom = boundingBox.minY;
        top = boundingBox.maxY;
    }else{
        bottom = boundingBox.maxY;
        top = boundingBox.minY;
    }

    const extentCoords = fixProductExtent([left, bottom, right, top]);

    return [[extentCoords[1], extentCoords[0]], [extentCoords[3], extentCoords[2]]];
};

