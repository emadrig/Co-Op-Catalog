import { useEffect, useState } from 'react'
import { Clone, OrbitControls } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { Lane } from '../models/lane'
import { Truck } from '../models/truck'

function RoadCrossing() {
    const [position, setPosition] = useState([0, 1, 0])
    const models = useGLTF('/models/lane.gltf')
    console.log(models.scene.children);
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

            setPosition(newPosition);
            camera.position.set(newPosition[0] + 3, newPosition[1] + 3, newPosition[2] + 6);
        }

        window.addEventListener('keydown', handleKeyDown)

        // Cleanup function to remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [position, camera])

    useFrame(() => {
        camera.lookAt(position[0], position[1], position[2]);
    });

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={1} />
            <directionalLight castShadow color="white" position={[0, 10, 0]} intensity={1} />
            <mesh castShadow position={position}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial />
            </mesh>
            <Clone object={models.scene.children[0]} />
            <Clone object={models.scene.children[1]} />
        </>
    )
}

export default RoadCrossing
