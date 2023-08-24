import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Sidewalk(props) {
    const { nodes, materials } = useGLTF("/models/sidewalk.gltf");
    return (
        <group {...props} dispose={null}>
            <mesh
                name="sidewalk"
                castShadow
                receiveShadow
                geometry={nodes.sidewalk.geometry}
                material={materials.concrete}
                position={[-25, 0, 0]}
                scale={[1, 1, 1]}
            />
        </group>
    );
}

useGLTF.preload("/models/sidewalk.gltf");
