import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

const Gun = () => {

    

    const camera  = useThree((state) => state.camera);

    const scene = useThree((state) => state.scene);

    const gunRef = useRef<THREE.Mesh| null>(null);

    useEffect(() => {

        const gun = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.3),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
        );
        gun.position.set(0, -0.2, -0.5);
        gun.name = "gun";
        
        camera.add(gun);

        if (gunRef.current) {
            gunRef.current = gun;
        }

        // console.log("camera", camera.children);

        
     
    }, [camera]);

    useEffect(() => {
        console.log("scene", scene.children);
    }, [scene]);

 return (
    <mesh name="gun" ref={gunRef}/>
 )
}

export default Gun;