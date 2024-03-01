import { useGLTF, Detailed, Environment, BakeShadows } from "@react-three/drei";

const positions = [...Array(50)].map(() => ({
  position: [
    50 - Math.random() * 80,
    75 - Math.random() * 80,
    50 - Math.random() * 80,
  ],
  // rotation: [
  //   Math.random() * Math.PI *,
  //   Math.random() * Math.PI * 10,
  //   Math.random() * Math.PI * 10,
  // ],
}));

export function Random() {
  return (
    <>
      {positions.map((props, i) => (
        <Bust key={i} {...props} />
      ))}
      {/* <BakeShadows /> */}
    </>
  );
}

function Bust(props) {
  const levels = useGLTF(["/cloud_test.glb"]);

  return (
    <Detailed distances={[0, 65, 125, 185]} {...props}>
      <group>
        {levels?.map(({ nodes, materials }, index) => {
          return (
            <mesh
              receiveShadow
              castShadow
              key={index}
              geometry={nodes["Plane001_08_-_Default_0"].geometry}
              material={materials["08_-_Default"]}
              scale={1.9}
            />
          );
        })}
      </group>
    </Detailed>
  );
}
