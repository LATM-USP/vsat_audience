import { useThree } from "@react-three/fiber";
import { type FC, useEffect, useState } from "react";
import {
  EquirectangularReflectionMapping,
  SRGBColorSpace,
  TextureLoader,
} from "three";

type SkyboxProps = {
  url: string;
};

const Skybox: FC<SkyboxProps> = ({ url }) => {
  const { scene } = useThree();

  const [loader] = useState(new TextureLoader());

  useEffect(() => {
    loader.load(url, (texture) => {
      texture.mapping = EquirectangularReflectionMapping;
      texture.colorSpace = SRGBColorSpace;
      scene.background = texture;
    });
  }, [url, scene, loader]);

  return null;
};

export default Skybox;
