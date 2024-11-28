import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";


const AnimatedWeapon = ({ isMoving = false }) => {
    const { camera } = useThree();
    const gunRef = useRef<THREE.Mesh|null>(null);
    const initialGunPosition = useRef(new THREE.Vector3(0.3, -0.3, -1));
    const bobSpeed = 8;
    const bobAmount = 0.015;
    const swayAmount = 0.1;
    
    // Track movement state
    const movementState = useRef({
      time: 0,
      lastRotationY: camera.rotation.y,
      lastRotationX: camera.rotation.x,
      velocityY: 0,
      velocityX: 0
    });
  
    useEffect(() => {
      // Create gun mesh
      const gun = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.3),
        new THREE.MeshBasicMaterial({
          color: 0x0000ff,
          depthTest: false,
          transparent: true,
          opacity: 0.8
        })
      );
      
      gun.position.copy(initialGunPosition.current);
      gun.name = "gun";
      camera.add(gun);
      gunRef.current = gun;
  
      return () => {
        camera.remove(gun);
      };
    }, [camera]);
  
    // Animation loop
    useFrame((_state, delta) => {
      if (!gunRef.current) return;
  
      const gun = gunRef.current;
      const movement = movementState.current;
  
      // Calculate rotation difference (weapon sway)
      const rotationDiffY = camera.rotation.y - movement.lastRotationY;
      const rotationDiffX = camera.rotation.x - movement.lastRotationX;
      
      // Update last rotation
      movement.lastRotationY = camera.rotation.y;
      movement.lastRotationX = camera.rotation.x;
  
      // Smooth out the velocity changes
      movement.velocityY = THREE.MathUtils.lerp(
        movement.velocityY,
        rotationDiffY * swayAmount,
        0.1
      );
      movement.velocityX = THREE.MathUtils.lerp(
        movement.velocityX,
        rotationDiffX * swayAmount,
        0.1
      );
  
      // Apply weapon sway
      gun.position.x = THREE.MathUtils.lerp(
        gun.position.x,
        initialGunPosition.current.x - movement.velocityY * 10,
        0.1
      );
      gun.position.y = THREE.MathUtils.lerp(
        gun.position.y,
        initialGunPosition.current.y - movement.velocityX * 10,
        0.1
      );
  
      // Weapon bobbing when moving
      if (isMoving) {
        movement.time += delta * bobSpeed;
        
        // Vertical bobbing
        gun.position.y = initialGunPosition.current.y + 
          Math.sin(movement.time * 2) * bobAmount;
        
        // Horizontal bobbing
        gun.position.x = initialGunPosition.current.x + 
          Math.cos(movement.time) * bobAmount;
        
        // Subtle rotation bobbing
        gun.rotation.z = Math.sin(movement.time) * 0.02;
      } else {
        // Return to original position when not moving
        movement.time = 0;
        gun.rotation.z = THREE.MathUtils.lerp(gun.rotation.z, 0, 0.1);
      }
  
      // Add slight tilt based on mouse movement
      gun.rotation.x = THREE.MathUtils.lerp(
        gun.rotation.x,
        -rotationDiffX * 2,
        0.1
      );
      gun.rotation.y = THREE.MathUtils.lerp(
        gun.rotation.y,
        -rotationDiffY * 2,
        0.1
      );
    });
  
    return null;
  };
  

export default AnimatedWeapon;