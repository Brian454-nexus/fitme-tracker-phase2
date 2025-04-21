import { useGLTF } from "@react-three/drei";

export const loadModel = (modelPath) => {
  const { scene } = useGLTF(modelPath);
  return scene;
};

export const animateModel = (model, animation) => {
  if (!model || !model.animations) return;

  const mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(model.animations[0]);
  action.play();

  return mixer;
};

export const muscleGroupModels = {
  chest: {
    path: "/models/chest.glb",
    scale: 0.5,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  back: {
    path: "/models/back.glb",
    scale: 0.5,
    position: [0, 0, 0],
    rotation: [0, Math.PI, 0],
  },
  legs: {
    path: "/models/legs.glb",
    scale: 0.5,
    position: [0, -1, 0],
    rotation: [0, 0, 0],
  },
  arms: {
    path: "/models/arms.glb",
    scale: 0.5,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  shoulders: {
    path: "/models/shoulders.glb",
    scale: 0.5,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  core: {
    path: "/models/core.glb",
    scale: 0.5,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
};

export const getModelConfig = (muscleGroup) => {
  return (
    muscleGroupModels[muscleGroup.toLowerCase()] || muscleGroupModels.chest
  );
};
