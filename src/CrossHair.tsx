
import { useEffect, useRef } from "react";
import * as THREE from "three";

const CrossHair = () => {

    const crosshair = useRef<THREE.Mesh | null>(null);

    
    useEffect(() => {

        
      
        const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, depthTest: false, transparent: true, opacity: 0.8 });

        if (crosshair.current) {
            crosshair.current.geometry = geometry;
            crosshair.current.material = material;
            crosshair.current.layers.set(1);
        }

 
    }, [])
    

    

    return (
        <mesh name="crosshair" ref={crosshair} position={[0, 0, -0.5]} />
    );
}

export default CrossHair;