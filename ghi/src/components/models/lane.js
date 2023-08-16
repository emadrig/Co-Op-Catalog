import React, { useState, useEffect } from 'react';
import { Truck } from './truck';
import { useGLTF } from '@react-three/drei';

export function Lane(props) {
  const { nodes, materials } = useGLTF('/models/lane.gltf');
  const getRandomStartPosition = () => -15 - Math.random() * 15;
  const [trucks, setTrucks] = useState([{ id: 0, positionX: getRandomStartPosition(), spawned: false }]);

  useEffect(() => {

    const interval = setInterval(() => {
      setTrucks((prevTrucks) => {
        const newTrucks = [];
        for (let truck of prevTrucks) {
          let newPositionX = truck.positionX + 0.05;

          // Check if a new truck should be spawned
          if (newPositionX > -8 && newPositionX < -3 && !truck.spawned) {
            newTrucks.push({ id: newTrucks.length, positionX: getRandomStartPosition(), spawned: false });
            truck.spawned = true; // Mark the current truck as having spawned another
          }

          // Don't add trucks that have moved past 25 on the x-axis
          if (newPositionX < 25) {
            newTrucks.push({ ...truck, positionX: newPositionX });
          }
        }
        return newTrucks;
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
        {trucks.map((truck) => (
          <Truck key={truck.id} position={[truck.positionX, 0, 0]} />
        ))}
      </group>
    </group>
  );
}
