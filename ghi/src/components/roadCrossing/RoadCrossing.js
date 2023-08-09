import { useEffect, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { Lane } from '../models/lane'

function RoadCrossing() {
    const [position, setPosition] = useState([0, 1, 0])
    const lane = useGLTF('/models/lane.gltf')
    const { camera } = useThree()

    useEffect(() => {
        const handleKeyDown = (event) => {
            let newPosition = [...position]; // Copy the current position
            switch (event.key) {
                case 'w':
                    newPosition[2] -= 2;
                    break;
                case 'a':
                    newPosition[0] -= 2;
                    break;
                case 's':
                    newPosition[2] += 2;
                    break;
                case 'd':
                    newPosition[0] += 2;
                    break;
                default:
                    break;
            }

            // Update both the box's position and the camera's position
            setPosition(newPosition);
            camera.position.set(newPosition[0] + 3, newPosition[1] + 3, newPosition[2] + 6);
            camera.lookAt(newPosition[0], newPosition[1], newPosition[2]); // Make the camera look at the box
        }

        window.addEventListener('keydown', handleKeyDown)

        // Cleanup function to remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [position, camera])

    useFrame(() => {
        // Use the current position of the box to set the target for the camera
        camera.lookAt(position[0], position[1], position[2]);
    });

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.2} />
            <directionalLight castShadow color="white" position={[0, 3, 5]} />
            <mesh castShadow position={position}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial />
            </mesh>
            <Lane position={[0,0, -8]} />
            <Lane position={[0,0, -6]} />
            <Lane position={[0,0, -4]} />
            <Lane position={[0,0, -2]} />
            <Lane position={[0,0, 0]} />
            <Lane position={[0,0, 2]} />
            <Lane position={[0,0, 4]} />
            <Lane position={[0,0, 6]} />
            <Lane position={[0,0, 8]} />
        </>
    )
}

export default RoadCrossing
