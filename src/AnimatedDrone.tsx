import  { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
    position?: THREE.Vector3;
    scale?: number;
}
const AnimatedDrone = ({ position , scale = 1 }: Props) => {
  const group = useRef<THREE.Group | null>(null);
  const { scene, animations } = useGLTF('/models/drone.glb'); // Your drone model path
  const { actions, names } = useAnimations(animations, scene);

  

  useEffect(() => {

    actions['hover']?.play();
  
  }, [actions,names]);

  // Add hover movement
  // useFrame((state) => {
    // if (group.current) {
      // const time = state.clock.getElapsedTime();
      
      // Smooth hover motion
      // group.current.position.y += Math.sin(time * 2) * 0.5;
      
      // Subtle rotation
      // group.current.rotation.z += Math.sin(time * 2) * 0.002;
    // }
  // });

  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      <primitive object={scene}  />
 
    
    </group>
  );
};

// Preload the model
useGLTF.preload('/models/drone.glb');

export default AnimatedDrone;