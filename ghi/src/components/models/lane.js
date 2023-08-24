import React, { useState, useEffect } from 'react';
import { Truck } from './truck';
import { Van } from './van';
import { useGLTF } from '@react-three/drei';

export function Lane(props) {
  const { nodes, materials } = useGLTF('/models/lane.gltf');
  const getRandomStartPosition = () => -15 - Math.random() * 15;
  const [vehicles, setVehicles] = useState([{ id: 0, positionX: getRandomStartPosition(), spawned: false, type: Math.random() < 0.5 ? 'Truck' : 'Van' }]);

  useEffect(() => {

    const interval = setInterval(() => {
      setVehicles((prevvehicle) => {
        const newVehicle = [];
        for (let vehicle of prevvehicle) {
          let newPositionX = vehicle.positionX + 0.05;

          // Check if a new vehicle should be spawned
          if (newPositionX > -8 && newPositionX < -3 && !vehicle.spawned) {
            newVehicle.push({ id: newVehicle.length, positionX: getRandomStartPosition(), spawned: false, type: Math.random() < 0.5 ? 'Truck' : 'Van' });
            vehicle.spawned = true; // Mark the current vehicle as having spawned another
          }

          // Don't add vehicles that have moved past 25 on the x-axis
          if (newPositionX < 25) {
            newVehicle.push({ ...vehicle, positionX: newPositionX });
          }
        }
        return newVehicle;
      });
    }, 15); // 20 ms interval corresponds to roughly 50 updates per second

    return () => clearInterval(interval);
  }, []);

  return (
    <group {...props} dispose={null}>
      <group name="Lane" position={[0, 0, 0]} scale={[1, 1, 1]}>
        <mesh
          name="Plane001"
          castShadow
          receiveShadow
          geometry={nodes.Plane001.geometry}
          material={materials.Asphalt}
        />
        <mesh
          name="Plane001_1"
          castShadow
          receiveShadow
          geometry={nodes.Plane001_1.geometry}
          material={materials.White}
        />
        {vehicles.map((vehicle) => (
          vehicle.type === 'Truck' ?
          <Truck key={vehicle.id} position={[vehicle.positionX, 0, 0]} />
          :
          <Van key={vehicle.id} position={[vehicle.positionX, 0, 0]} />
        ))}
      </group>
    </group>
  );
}
