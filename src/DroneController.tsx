/* eslint-disable @typescript-eslint/no-unused-vars */
import  { useEffect, useRef, useState } from 'react';

import { useFrame, useThree } from '@react-three/fiber';

import * as THREE from 'three';

import { useKeyboardControls } from '@react-three/drei';
import AnimatedDrone from './AnimatedDrone';

interface Props {
  x: number;
  y: number;
  z: number;
  enable: boolean;
}

const DroneController = (props:Props) => {
    const droneRef = useRef<THREE.Group | null>(null);
    const { camera } = useThree();
    const [dronePosition, setDronePosition] = useState(new THREE.Vector3(200, 1000, 500));
    const [droneRotation, setDroneRotation] = useState(new THREE.Euler(0, 0, 0));
    const moveSpeed = 1;
    const rotateSpeed = 0.01;
    const rotateZSpeed = 0.002;
    

    
  
    // Define keyboard controls
    // const controls = {
    //   forward: 'KeyW',
    //   backward: 'KeyS',
    //   left: 'KeyA',
    //   right: 'KeyD',
    //   up: 'Space',
    //   down: 'ShiftLeft',
    //   rotateLeft: 'KeyQ',
    //   rotateRight: 'KeyE',
    // };
  
    // Track pressed keys
    const [subscribeKeys, getKeys] = useKeyboardControls();

    useEffect(() => {
        // Subscribe to keyboard events
        return subscribeKeys(
            (_state) => {
                // console.log(state);
            }   
        );
        }, [subscribeKeys]);

  
    useFrame(() => {
      if (!droneRef.current) return;
  
      const keys = getKeys();
      const drone = droneRef.current;
      const movement = new THREE.Vector3();
      
      let rotationChange = 0;
      let rotationZChange = 0;

      
  
      // Forward/Backward
      if (keys.forward) movement.z -= moveSpeed; 
      if (keys.backward) movement.z += moveSpeed;

      if (props.enable) movement.z += moveSpeed *5;
  
      // Left/Right


        if (keys.left) rotationZChange += rotateZSpeed;
        if (keys.right) rotationZChange -= rotateZSpeed;
        if (keys.left) movement.x -= moveSpeed;

      if (keys.right) movement.x += moveSpeed;

    movement.y += moveSpeed * ((props.y - 7) ?? 0);      

    
      // Up/Down
      if (keys.up) movement.y += moveSpeed;
      if (keys.down) movement.y -= moveSpeed;
  
      // Rotation
      if (keys.rotateLeft) rotationChange += rotateSpeed;
      if (keys.rotateRight) rotationChange -= rotateSpeed;

      rotationChange += rotateSpeed * (props.z * 0.1);

      // rotationChange += rotateSpeed * (props.x * 0.1);qqqqqqqqqqqqqeeeeeee
  
      // Apply movement relative to drone's rotation
      movement.applyEuler(droneRotation);
      const newPosition = dronePosition.clone().add(movement);
      setDronePosition(newPosition);
  
      // Update rotation
      const newRotation = droneRotation.clone();
      
      newRotation.x = rotationChange;
      newRotation.y += rotationChange;
      newRotation.z += rotationZChange

      if (newRotation.z > 0.21) {newRotation.z = 0.21}  
      if (newRotation.z < -0.21) {newRotation.z = -0.21}



      

        // console.log(newRotation.z)
      
      setDroneRotation(newRotation);
  
      // Update drone position and rotation
      drone.position.copy(newPosition);
      drone.rotation.copy(newRotation);
  
      // Update camera position to follow drone
      // const addMove = new THREE.Vector3(0, 2, 6);
      // camera.position.copy(newPosition).add(addMove);
      // camera.lookAt(newPosition);

      const cameraOffset = new THREE.Vector3(0, 2, -5).applyEuler(newRotation);
      camera.position.copy(newPosition).add(cameraOffset);
      camera.lookAt(newPosition);
    });
  
    return (
      <group ref={droneRef}>
        <AnimatedDrone position={new THREE.Vector3(0,-4,0)} scale={10} />
      </group>
    );
  };

  export default DroneController;