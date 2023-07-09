import * as THREE from '../../threeJS/src/Three.js';

class UploadedModels{

    constructor(theModel,x,y,z){
        this.x = x;
        this.y =y;
        this.z=z;
        this.model = theModel;
        this.model.position.set(this.x,this.y,this.z);
    }

}

export default UploadedModels;