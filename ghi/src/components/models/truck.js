import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Truck(props) {
  const { nodes, materials } = useGLTF("/models/truck.gltf");
  return (
    <group {...props} dispose={null}>
      <group
        position={[0.1931, 0.317, 0.1074]}
        rotation={[-Math.PI / 2, -Math.PI / 2, 0]}
        scale={[0.03, 0.51, 0.03]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.black}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials.gray}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_2.geometry}
          material={materials.windows}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_3.geometry}
          material={materials.c_headlight}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_4.geometry}
          material={materials.bronze}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/truck.gltf");
