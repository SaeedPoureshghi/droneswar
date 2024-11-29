// src/App.jsx
import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  KeyboardControls,
} from "@react-three/drei";
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import "./App.css";
import DroneController from "./DroneController";
import Logo from './assets/dron640x360.png'

// import CrossHair from "./CrossHair";
// import Gun from "./Gun";
// import CrossHair from "./CrossHair";
// import CrossHair from "./CrossHair";

const worldWidth = 256,
  worldDepth = 256;

const generateTexture = (data: Uint8Array, width: number, height: number) => {
  let context: CanvasRenderingContext2D | null;
  let image: ImageData;
  let imageData: Uint8ClampedArray;
  let shade: number;

  const vector3 = new THREE.Vector3(0, 0, 0);
  const sun = new THREE.Vector3(1, 1, 1);
  sun.normalize();

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext("2d");
  if (!context) return;

  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);

  image = context.getImageData(0, 0, canvas.width, canvas.height);

  imageData = image.data;

  for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
    vector3.x = data[j - 2] - data[j + 2];
    vector3.y = 2;
    vector3.z = data[j - width * 2] - data[j + width * 2];
    vector3.normalize();

    shade = vector3.dot(sun);

    imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
    imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
    imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
  }

  context.putImageData(image, 0, 0);

  const canvasScaled = document.createElement("canvas");
  canvasScaled.width = width * 4;
  canvasScaled.height = height * 4;

  context = canvasScaled.getContext("2d");
  if (!context) return;
  context.scale(4, 4);
  context.drawImage(canvas, 0, 0);

  image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
  imageData = image.data;

  for (let i = 0, l = imageData.length; i < l; i += 4) {
    const v = ~~(Math.random() * 5);
    imageData[i] += v;
    imageData[i + 1] += v;
    imageData[i + 2] += v;
  }

  context.putImageData(image, 0, 0);

  return canvasScaled;
};

const generateHeight = (): IData => {
  let seed = Math.PI / 4;
  window.Math.random = function () {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const size = worldWidth * worldDepth;
  const data = new Uint8Array(size);
  const perlin = new ImprovedNoise();
  let quality = 1;
  const z = Math.random() * 100;
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < size; i++) {
      const x = i % worldWidth,
        y = ~~(i / worldWidth);
      data[i] += Math.abs(
        perlin.noise(x / quality, y / quality, z) * quality * 1.75
      );
    }
    quality *= 5;
  }
  return data;
};

const data = generateHeight();

function Terrain() {
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Generate height data

  const texture = useMemo(() => {
    const Texture = generateTexture(data, worldWidth, worldDepth);

    const canvasTexture = new THREE.CanvasTexture(Texture as TexImageSource);

    canvasTexture.wrapS = THREE.ClampToEdgeWrapping;
    canvasTexture.wrapT = THREE.ClampToEdgeWrapping;
    canvasTexture.colorSpace = THREE.SRGBColorSpace;

    return canvasTexture;
  }, []);

  // Create a terrain mesh
  useEffect(() => {
    if (!meshRef.current) return;
    const geometry = new THREE.PlaneGeometry(
      7500,
      7500,
      worldWidth - 1,
      worldDepth - 1
    );
    geometry.rotateX(-Math.PI / 2);
    const vertices = geometry.attributes.position.array;
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = data[i] * 10;
    }
    meshRef.current.geometry = geometry;
  }, []);

  return (
    <mesh name="terrian" ref={meshRef}>
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

// SetupCamera Component
const SetupCamera = () => {
  const { camera, scene } = useThree();

  useEffect(() => {
    camera.position.set(100, 800, -800);
    camera.near = 0.05;
    camera.far = 10000;
    camera.layers.enableAll();

    // airplane from png
    const gun = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("cockpit.png"),
        transparent: true,
        depthTest: false,
      })
    );

    gun.position.set(0, -0.3, -1);

    gun.name = "gun";

    // Crosshair
    const crosshair = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.05, 0.05),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        depthTest: false,
        transparent: true,
        opacity: 0.5,
      })
    );
    // Adjust position to be in center of view
    crosshair.position.set(0, -0.3, -2);
    crosshair.name = "crosshair";

    // Add to camera
    // camera.add(gun);
    // camera.add(crosshair);

    // Important: Add camera to scene
    scene.add(camera);

    camera.updateProjectionMatrix();

    console.log("scene", scene.children);

    // Cleanup function
    return () => {
      // camera.remove(gun);
      // camera.remove(crosshair);
      scene.remove(camera);
    };
  }, [camera, scene]);

  return null;
};

interface Props {
  x: number;
  y: number;
  z: number;
}
function App(props: Props) {
  const [isEnable, setIsEnable] = useState(false);

  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);

  // const buildingPositions = [
  //   new THREE.Vector3(0, 500, 0),
  //   new THREE.Vector3(0, 1, 0),
  //   new THREE.Vector3(200, 1000, 0),
  //   // Add more positions as needed
  // ];

  return (
    <>
    {!isCanvasLoaded && <div style={{display:"flex",flexDirection:"column", minHeight:"100vh", justifyContent:"center", alignItems:"center"}}>
      <img src={Logo} alt="logo" style={{width:"320px", height:"auto"}}
      
      />
      <h2>Loading...</h2>
      </div>}
    <Canvas
    onCreated={()=>setIsCanvasLoaded(true)}
    onClick={()=> {
      setIsEnable(!isEnable);
    }}
      dpr={window.devicePixelRatio}
      onKeyDown={(e) => {
        if (e.key === " ") {
          setIsEnable(!isEnable);
        }
      }}
    >
      
<KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
          { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'right', keys: ['ArrowRight', 'KeyD'] },
          { name: 'up', keys: ['ShiftRight'] },
          { name: 'down', keys: ['ShiftLeft'] },
          { name: 'rotateLeft', keys: ['KeyQ'] },
          { name: 'rotateRight', keys: ['KeyE'] },
        ]}
      >

      <color attach="background" args={["#efd1b5"]} />

      <DroneController y={props.y} z={props.z * -1} x={props.x} enable={isEnable} />
{/* 
      <Sky
        distance={45000}
        sunPosition={[1000, 2000, 1000]}
        inclination={0}
        azimuth={0.25}
      /> */}
      <fogExp2 attach="fog" args={["#efd1b5", 0.0007]} />
      <Terrain />
      {/* <Target data={data} /> */}
      {/* {buildingPositions.map((position, index) => (
        <BuildingController key={index} position={position} scale={50} />
      ))} */}
      <SetupCamera />
      <directionalLight position={[100, 50, 120]} intensity={1} castShadow />
      <ambientLight intensity={0.5} castShadow />
{/*  
       <FirstPersonControls
        makeDefault
        movementSpeed={250}
        lookSpeed={0.05}
        enabled={isEnable}
      />   */}

      </KeyboardControls>
    </Canvas>
  </>
  );
}

export default App;
