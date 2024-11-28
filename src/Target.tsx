// import  {useEffect, useRef} from "react";
// import * as THREE from "three";


// const  Target: React.FC<TargetProps> =  (props) => {

//   const targetRef = useRef<THREE.Group | null>(null);





//     const generateRandomPositions = (count: number) : IPosition[] => {
//         const positions = [];
//         for (let i = 0; i < count; i++) {
//           const x = Math.random() * 7500 - 3750;
//           const z = Math.random() * 7500 - 3750;
//           positions.push({ x, z });
//         }
//         return positions;
//       };

//      useEffect(() => {

//         const getHeightAt = (
//             x: number,
//             z: number,
//             width: number
//           ) => {
//             const ix = Math.floor((x / 7500 + 0.5) * (width - 1));
//             const iz = Math.floor((z / 7500 + 0.5) * (width - 1));
//             return props.data[ix + iz * width] * 10;
//           };

//         const positions = generateRandomPositions(100);

//         const group = new THREE.Group();

//         positions.forEach((pos: IPosition, index: number) => {
//             const y = getHeightAt(pos.x, pos.z, 256);
//             const geometry = new THREE.SphereGeometry(30, 16, 16);
//             const material = new THREE.MeshBasicMaterial({
//                 color: 0xff0000,
//                 transparent: true,
//                 opacity: 0.8,
//             });
            
  
//             const sphere = new THREE.Mesh(geometry,material);
            
//             sphere.position.set(pos.x, y+30, pos.z);
//             sphere.name = `target-${index}`;
//             group.add(sphere);
//         })

//         if (targetRef.current) {
//             targetRef.current.add(group);
//         }
       
//      },[props.data])
     


//     return(
//         <group ref={targetRef} />
       
//     )
// }

// export default Target;

import {  useEffect, useRef, useState } from "react";
import * as THREE from "three";
// import { MeshDistortMaterial } from "@react-three/drei";
import Building from "./Building";


// const SphereTarget: React.FC<{ position: [number, number, number] }> = ({ position }) => (
//   <mesh position={position} layers={2}>
//     <sphereGeometry args={[30, 16, 16]} />
//     <MeshDistortMaterial color={0xff0000}  distort={0.5} speed={10} transparent opacity={1} />
//     <mesh>
//         <sphereGeometry args={[30, 16, 16]} />
//         <meshBasicMaterial color={0xff0000} transparent opacity={1} />
//     </mesh>
//   </mesh>
// );

const Target: React.FC<TargetProps> = (props) => {
  const targetRef = useRef<THREE.Group | null>(null);
  const [positions, setPositions] = useState<IPosition[] | null >(null);

  const getHeightAt = (x: number, z: number, width: number) => {
    const ix = Math.floor((x / 7500 + 0.5) * (width - 1));
    const iz = Math.floor((z / 7500 + 0.5) * (width - 1));
    return props.data[ix + iz * width] * 10;
  };

  useEffect(() => {

  const generateRandomPositions = (count: number): IPosition[] => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 7500 - 3750;
      const z = Math.random() * 7500 - 3750;
      positions.push({ x, z });
    }
    return positions;
  };

  const pos_10 = generateRandomPositions(10);
    setPositions(pos_10);

},[props.data]);

useEffect(() => {
    if (!positions) return;

    if (positions?.length>0) {
        console.log("positions", positions);
    }
}
    ,[positions])

  return (
    <group name="targets" ref={targetRef} >
      {positions && positions.map((pos, index) => (
      
       <Building key={index} position={new THREE.Vector3(pos.x, getHeightAt(pos.x, pos.z, 256) + 30, pos.z)} scale={100} />
      
      ))}
    </group>
  );
};

export default Target;
