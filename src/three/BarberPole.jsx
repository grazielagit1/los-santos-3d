import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from './fx';
import * as THREE from 'three';
import Stage from './Stage';
import { scrollState } from '../lib/scroll';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Textura das listras em espiral, desenhada num canvas (repete sem emendas)
function useStripeTexture() {
  return useMemo(() => {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#f5f5f2';
    ctx.fillRect(0, 0, size, size);
    // inclina o desenho: cada faixa vertical vira uma diagonal (= hélice no cilindro)
    ctx.setTransform(1, 0, -1, 1, 0, 0);
    const periodo = 128;
    for (let x = -size * 2; x < size * 2; x += periodo) {
      ctx.fillStyle = '#c91d26';
      ctx.fillRect(x, 0, 50, size);
      ctx.fillStyle = '#1226da';
      ctx.fillRect(x + 64, 0, 30, size);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1.6);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);
}

function Pole() {
  const grupo = useRef();
  const stripes = useStripeTexture();
  const { size, viewport } = useThree();
  const mobile = size.width < 768;
  // no tablet/desktop, fica à direita e diminui conforme a largura disponível
  const lado = viewport.width * 0.32;
  const escala = Math.min(1, Math.max(0.6, viewport.width / 9));

  const cromo = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#d9d9d9', metalness: 1, roughness: 0.12 }),
    []
  );
  const escuro = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#141414', metalness: 0.8, roughness: 0.3 }),
    []
  );

  useFrame((state, dt) => {
    const g = grupo.current;
    if (!g) return;
    // listras "sobem" sempre; acelera quando a pessoa rola a página
    const turbo = 1 + Math.min(Math.abs(scrollState.velocity) * 0.25, 6);
    stripes.offset.x -= dt * 0.18 * turbo;

    // inclina na direção do mouse
    const px = clamp(state.pointer.x, -1, 1);
    const py = clamp(state.pointer.y, -1, 1);
    const k = 1 - Math.exp(-dt * 4);
    g.rotation.z += (-px * 0.22 - g.rotation.z) * k;
    g.rotation.x += (py * 0.18 - g.rotation.x) * k;

    // ao rolar para fora do hero, o poste sobe e gira
    const s = scrollState.y / window.innerHeight;
    g.position.y = s * 2.2;
    g.rotation.y = s * 1.6;
  });

  return (
    <group ref={grupo} position={[mobile ? 0 : lado, -0.1, 0]} scale={mobile ? 0.62 : 0.82 * escala}>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
        <group rotation={[0, 0, 0.12]}>
          {/* cilindro com as listras */}
          <mesh>
            <cylinderGeometry args={[0.42, 0.42, 3.2, 64, 1, true]} />
            <meshStandardMaterial map={stripes} roughness={0.35} metalness={0.05} />
          </mesh>
          {/* tubo de vidro por fora */}
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 3.25, 64, 1, true]} />
            <meshStandardMaterial
              transparent
              opacity={0.22}
              roughness={0.03}
              metalness={0.1}
              envMapIntensity={2.4}
              color="#ffffff"
              depthWrite={false}
            />
          </mesh>

          {/* tampa de cima: aro + base + cúpula cromada */}
          <mesh position={[0, 1.7, 0]} material={cromo}>
            <cylinderGeometry args={[0.6, 0.56, 0.16, 64]} />
          </mesh>
          <mesh position={[0, 1.62, 0]} rotation-x={Math.PI / 2} material={cromo}>
            <torusGeometry args={[0.55, 0.04, 16, 64]} />
          </mesh>
          <mesh position={[0, 1.78, 0]} material={escuro}>
            <cylinderGeometry args={[0.46, 0.5, 0.12, 64]} />
          </mesh>
          <mesh position={[0, 1.84, 0]} material={cromo}>
            <sphereGeometry args={[0.46, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh position={[0, 2.36, 0]} material={cromo}>
            <sphereGeometry args={[0.09, 32, 16]} />
          </mesh>

          {/* tampa de baixo */}
          <mesh position={[0, -1.7, 0]} material={cromo}>
            <cylinderGeometry args={[0.56, 0.6, 0.16, 64]} />
          </mesh>
          <mesh position={[0, -1.62, 0]} rotation-x={Math.PI / 2} material={cromo}>
            <torusGeometry args={[0.55, 0.04, 16, 64]} />
          </mesh>
          <mesh position={[0, -1.84, 0]} material={escuro}>
            <cylinderGeometry args={[0.5, 0.3, 0.16, 64]} />
          </mesh>
          <mesh position={[0, -2.02, 0]} material={cromo}>
            <coneGeometry args={[0.3, 0.32, 64]} />
          </mesh>
        </group>
      </Float>
      <Sparkles count={60} scale={[4, 5, 3]} size={2.2} speed={0.35} color="#c91d26" opacity={0.8} />
      <Sparkles count={30} scale={[4, 5, 3]} size={1.4} speed={0.25} color="#ffffff" opacity={0.5} />
    </group>
  );
}

// Versão simples (só CSS) para quem não tem 3D no aparelho
const PosteCSS = () => (
  <div className="flex h-full items-center justify-center md:justify-end md:pr-[18%]">
    <div className="poste-css" />
  </div>
);

export default function BarberPoleScene({ className }) {
  return (
    <Stage className={className} camera={{ position: [0, 0, 7.5], fov: 35 }} fallback={<PosteCSS />}>
      <Pole />
    </Stage>
  );
}
