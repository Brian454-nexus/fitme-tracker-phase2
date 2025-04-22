import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import styled from "styled-components";

const ModelContainer = styled.div`
  width: 100%;
  height: 300px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
`;

const LoadingSpinner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #2c3e50;
`;

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
};

const ModelViewer = ({ modelUrl }) => {
  return (
    <ModelContainer>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={<LoadingSpinner>Loading model...</LoadingSpinner>}>
          <Model url={modelUrl} />
          <OrbitControls enableZoom={false} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </ModelContainer>
  );
};

export default ModelViewer;
