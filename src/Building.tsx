import  { useRef } from 'react';
import { useGLTF  } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface Props {
    position?: THREE.Vector3;
    scale?: number;
}
const Building = ({ position , scale = 1 }: Props) => {
  const group = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF('/models/building.glb'); // Your drone model path
  
  useFrame((state) => {

    if (group.current) {
      const time = state.clock.getElapsedTime();
      
      // Smooth hover motion
      group.current.position.y += Math.sin(time * 2) * 0.5;
      
      // Subtle rotation
    //   group.current.rotation.z += Math.sin(time * 2) * 0.002;
    }

  });


  return (
    <group name="building" ref={group} position={position} scale={[scale, scale, scale]}>
      <primitive object={scene}  />
    </group>
  );
};

// Preload the model
useGLTF.preload('/models/building.glb');

export default Building;