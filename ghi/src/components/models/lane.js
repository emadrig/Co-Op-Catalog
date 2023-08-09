import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Lane(props) {
    const { nodes, materials } = useGLTF("/models/lane.gltf")
    return (
        <group {...props} dispose={null}>
            <group name="Lane" position={[-50, 0, 0]} scale={[2, 1, 1]}>
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
            </group>
        </group>
    );
}

useGLTF.preload("/models/lane.gltf");
