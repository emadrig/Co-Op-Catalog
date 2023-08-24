import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Van(props) {
  const { nodes, materials } = useGLTF("/models/van.gltf");
  return (
    <group {...props} dispose={null}>
      <group name="van" position={[0, 0.70, 0]} scale={[0.2, 0.2, 0.2]} rotation={[0, Math.PI, 0]}>
        <mesh
          name="Cube002"
          castShadow
          receiveShadow
          geometry={nodes.Cube002.geometry}
          material={materials.Material}
        />
        <mesh
          name="Cube002_1"
          castShadow
          receiveShadow
          geometry={nodes.Cube002_1.geometry}
          material={materials.Window}
        />
        <mesh
          name="Cube002_2"
          castShadow
          receiveShadow
          geometry={nodes.Cube002_2.geometry}
          material={materials["Cream White"]}
        />
        <mesh
          name="Cube002_3"
          castShadow
          receiveShadow
          geometry={nodes.Cube002_3.geometry}
          material={materials.silver}
        />
        <mesh
          name="Cube002_4"
          castShadow
          receiveShadow
          geometry={nodes.Cube002_4.geometry}
          material={materials.surf_board}
        />
        <mesh
          name="Cube002_5"
          castShadow
          receiveShadow
          geometry={nodes.Cube002_5.geometry}
          material={materials["silver.001"]}
        />
        <mesh
          name="Cube002_6"
          castShadow
          receiveShadow
          geometry={nodes.Cube002_6.geometry}
          material={materials["silver.002"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/van.gltf");
