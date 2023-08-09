import { useFrame } from '@react-three/fiber'
import { useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function RoadCrossing() {
    const [elapsedTime, setElapsedTime] = useState()
    const lane = useLoader(GLTFLoader, '/models/lane.gltf')
    console.log(lane.scene.children);

    // useFrame(({ clock }) => {
    //     setElapsedTime(clock.getElapsedTime())
    // })

    return (
        <>
            <camera position={[0,0,10]} />
            <ambientLight intensity={0.2} />
            <directionalLight color="red" position={[0, 0, 5]} />
            {/* <mesh rotation={[elapsedTime, elapsedTime, elapsedTime]} position={[1, 1, -5]} >
                <torusGeometry args={[5, 2]} />
                <meshStandardMaterial />
            </mesh> */}
            <primitive object={lane.scene.children[0]} />
        </>
    )
}
export default RoadCrossing