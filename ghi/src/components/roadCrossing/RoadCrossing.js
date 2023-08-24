import { useEffect, useState } from 'react'
import { Clone, OrbitControls } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { Lane } from '../models/lane'
import { Truck } from '../models/truck'
import { Sidewalk } from '../models/sidewalk'

function RoadCrossing() {
    const [position, setPosition] = useState([0, 1, 0]);
    const [lanes, setLanes] = useState([
        { id: 1, position: [0, 0, 8], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 2, position: [0, 0, 6], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 3, position: [0, 0, 4], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 4, position: [0, 0, 2], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 5, position: [0, 0, 0], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 6, position: [0, 0, -2], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 7, position: [0, 0, -4], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 8, position: [0, 0, -6], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 9, position: [0, 0, -8], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 10, position: [0, 0, -10], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 11, position: [0, 0, -12], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 12, position: [0, 0, -14], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 13, position: [0, 0, -16], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 14, position: [0, 0, -18], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 15, position: [0, 0, -20], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
        { id: 16, position: [0, 0, -22], type: Math.random() < 1 / 3 ? "sidewalk" : "lane" },
    ]);

    const models = useGLTF("/models/lane.gltf");
    const lane = models.scene.children[0];
    const { camera } = useThree();

    useEffect(() => {
        const handleKeyDown = (event) => {
            let newPosition = [...position];
            switch (event.key) {
                case "w":
                    newPosition[2] -= 2;
                    setLanes((prevLanes) => {
                        const newLanes = prevLanes.slice(1);
                        const newLane = {
                            id: new Date().getTime(),
                            position: [0, 0, prevLanes[prevLanes.length - 1].position[2] - 2],
                            type: Math.random() < 1 / 3 ? "sidewalk" : "lane"
                        };
                        newLanes.push(newLane);
                        return newLanes;
                    });
                    break;
                case "s":
                    newPosition[2] += 2;
                    setLanes((prevLanes) => {
                        const newLanes = prevLanes.slice(0, -1);
                        const newLane = {
                            id: new Date().getTime(),
                            position: [0, 0, prevLanes[0].position[2] + 2],
                            type: Math.random() < 1 / 3 ? "sidewalk" : "lane"
                        }
                        newLanes.unshift(newLane);
                        return newLanes;
                    });
                    break;
                case 'a':
                    newPosition[0] -= 2;
                    break;
                case 'd':
                    newPosition[0] += 2;
                    break;
                default:
                    break;
            }

            setPosition(newPosition);
            camera.position.set(
                newPosition[0] + 0.5,
                newPosition[1] + 5,
                newPosition[2] + 3
            );
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [position, camera]);

    useFrame(() => {
        camera.lookAt(position[0], position[1], position[2]);
    });

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={1} />
            <directionalLight castShadow color="white" position={[0, 10, 0]} intensity={1} />
            <mesh castShadow position={position}>
                <boxGeometry args={[1, 2, 1]} />
                <meshStandardMaterial />
            </mesh>
            {lanes.map((item) =>
                item.type === "lane" ? (
                    <Lane key={item.id} object={lane} position={item.position} />
                ) : (
                    <Sidewalk key={item.id} position={item.position} />
                )
            )}
            <Truck />
        </>
    );
}

export default RoadCrossing;
