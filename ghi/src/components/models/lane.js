import { useRef, useEffect } from "react";
import { Truck } from "./truck";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";


export function Lane(props) {
  const { nodes, materials } = useGLTF("/models/lane.gltf");
  const truckRef = useRef();
  const startTimeRef = useRef(Date.now() + Math.random() * 10 * 1000);
  const directionRef = useRef(1);
  const truckSpacing = 5; // Spacing between trucks

  // Function to handle truck movement
  const moveTruck = () => {
    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    const xPosition = elapsedTime * 0.5 * directionRef.current; // Change 0.5 to control speed
    truckRef.current.position.x = (xPosition % truckSpacing) - truckSpacing / 2;

    // You can change direction based on some condition
    // directionRef.current = someCondition ? 1 : -1;
  };

  useFrame(moveTruck);

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
        <group ref={truckRef}>
          <Truck />
        </group>
      </group>
    </group>
  );
}
