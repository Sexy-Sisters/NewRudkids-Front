import { useThree, Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useGLTF, OrbitControls, useBounds } from "@react-three/drei";
import { Suspense } from "react";
import gsap from "gsap";
import { useState } from "react";
import { useEffect } from "react";
import { Random } from "../Random";
import "./css/index.css";

const productList = [
  {
    id: 1,
    name: "PetFly",
    content: "Make your Fly",
  },
  {
    id: 2,
    name: "Nothing",
    content: "Feel empty space",
  },
  {
    id: 3,
    name: "ABeautifulWorld",
    content: "It's Okay to have some rest",
  },
];

export const List = () => {
  return (
    <Canvas
      id="canvas"
      gl={{ antialias: true }}
      camera={{
        fov: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.5,
        far: 100,
        position: [5, 5, 50],
      }}
    >
      <Suspense>
        <ambientLight intensity={5} position={[0, 10, 0]} />
        <Scene />
        <Random />
        <OrbitControls
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2}
          minDistance={15}
          maxDistance={30}
          enablePan={false}
        />
      </Suspense>
    </Canvas>
  );
};

const Scene = () => {
  const [selectedProductId, setSelectedProductId] = useState(null);

  return (
    <>
      {selectedProductId != null && (
        <ViewButton productId={selectedProductId} />
      )}
      {productList.map((data, idx) => {
        return (
          <Product
            key={idx}
            setSelectedProductId={setSelectedProductId}
            selectedProductId={selectedProductId}
            data={data}
            rotation={((Math.PI * 2) / productList.length) * idx}
            cameraRadius={20}
            radius={7}
          />
        );
      })}
    </>
  );
};

const ViewButton = ({ productId }) => {
  return (
    <Html
      fullscreen
      style={{
        position: "fixed",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        onClick={() => {
          // productId의 디테일 페이지로 이동;
        }}
        style={{
          position: "absolute",
          bottom: "0",
          backgroundColor: "blue",
          padding: 15,
          textAlign: "center",
          marginBottom: "30px",
          borderRadius: "10px",
          color: "white",
          width: "50%",
        }}
      >
        Watch
      </div>
    </Html>
  );
};

const Product = ({
  data,
  selectedProductId,
  setSelectedProductId,
  radius,
  cameraRadius,
  rotation,
}) => {
  const three = useThree();
  const x = radius * Math.cos(rotation);
  const z = radius * Math.sin(rotation);
  const cameraX = cameraRadius * Math.cos(rotation);
  const cameraZ = cameraRadius * Math.sin(rotation);

  const [sign, setSign] = useState(false);

  useEffect(() => {
    setSign(false);
    if (selectedProductId === data.id) {
      gsap.fromTo(
        three.camera.position,
        {
          x: three.camera.position.x,
          z: three.camera.position.z,
        },
        {
          x: cameraX,
          z: cameraZ,
          duration: 2,
          onComplete: () => {
            setSign(true);
          },
        }
      );
    }
  }, [selectedProductId]);

  return (
    <group
      onClick={() => setSelectedProductId(data.id)}
      onPointerMissed={() => setSelectedProductId(null)}
      rotation-y={Math.PI / 2 - rotation}
      position-x={x}
      position-z={z}
    >
      {sign && selectedProductId === data.id && (
        <Html
          center
          style={{
            backgroundColor: "rgba(0, 0,0, 10%)",
            borderRadius: "20px",
            margin: 0,
            padding: "20px",
            whiteSpace: "nowrap",
            color: "white",
            position: "absolute",
            top: "-150px",
          }}
        >
          <p style={{ fontSize: "30px", margin: 0 }}>{data.name}</p>
          <p style={{ fontSize: "15px", margin: 0 }}>{data.content}</p>
        </Html>
      )}
      <FirstSeasonModel data={data} />
    </group>
  );
};

const FirstSeasonModel = ({ data }) => {
  const gltfs = useGLTF([
    "/models/credit_card.glb",
    "/models/credit_card.glb",
    "/models/credit_card.glb",
  ]);

  const productGltf = {
    PetFly: gltfs[0],
    Nothing: gltfs[2],
    ABeautifulWorld: gltfs[1],
  };

  const { scene, animation } = productGltf[data?.name];

  return (
    <group>
      <primitive scale={0.06} object={scene} />
    </group>
  );
};
