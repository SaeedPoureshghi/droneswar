import React from 'react';
import * as THREE from 'three';
import Building from './Building';

interface Props {
  position: THREE.Vector3;
  scale?: number;
}

const BuildingController: React.FC<Props> = ({ position, scale = 1 }) => {
  return (
    <Building position={position} scale={scale} />
  );
};

export default BuildingController;