import React, { useState, useCallback } from 'react';
import {
  ViroARScene,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroNode,
  Viro3DObject,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroText,
  ViroAnimations,
} from '@viro-community/react-viro';
import { ANIMALS } from '../data/animals';

/**
 * AR sahne bileşeni - ViroReact image tracking
 *
 * Her hayvan için bir ViroARImageMarker oluşturulur.
 * Kamera PDF sayfasını gördüğünde ilgili 3D model üstüne oturur.
 */

// Tüm hayvan sayfalarını hedef olarak kaydet
ViroARTrackingTargets.createTargets(
  ANIMALS.reduce((acc, animal) => {
    acc[animal.targetName] = {
      source: animal.targetImage,
      orientation: 'Up',
      physicalWidth: animal.physicalWidth,
    };
    return acc;
  }, {})
);

// Giriş animasyonu: model aşağıdan yavaşça yükselir
ViroAnimations.registerAnimations({
  appear: {
    properties: { positionY: '+=0.03', opacity: 1 },
    easing: 'EaseInEaseOut',
    duration: 600,
  },
  idle_bounce: {
    properties: { positionY: '+=0.01' },
    easing: 'EaseInEaseOut',
    duration: 1200,
  },
  idle_bounce_back: {
    properties: { positionY: '-=0.01' },
    easing: 'EaseInEaseOut',
    duration: 1200,
  },
  bounce: [['idle_bounce', 'idle_bounce_back']],
});

function AnimalMarker({ animal, onAnimalFound }) {
  const [found, setFound] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  const handleFound = useCallback(() => {
    setFound(true);
    onAnimalFound?.(animal);
  }, [animal, onAnimalFound]);

  const handleLost = useCallback(() => {
    setFound(false);
  }, []);

  return (
    <ViroARImageMarker
      target={animal.targetName}
      onAnchorFound={handleFound}
      onAnchorRemoved={handleLost}
    >
      {/* Ambient ışık - modeli her açıdan aydınlatır */}
      <ViroAmbientLight color="#ffffff" intensity={400} />
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -0.5]}
        intensity={300}
      />

      <ViroNode
        position={animal.modelPosition}
        scale={modelLoaded ? animal.modelScale : [0, 0, 0]}
        rotation={animal.modelRotation}
        opacity={modelLoaded ? 1 : 0}
        animation={
          modelLoaded
            ? { name: 'bounce', run: true, loop: true }
            : undefined
        }
      >
        <Viro3DObject
          source={animal.model}
          type="GLB"
          onLoadEnd={() => setModelLoaded(true)}
          onError={(e) => console.warn(`Model yüklenemedi (${animal.name}):`, e)}
        />
      </ViroNode>

      {/* Hayvan adı etiketi */}
      {modelLoaded && (
        <ViroText
          text={`${animal.emoji} ${animal.name}`}
          scale={[0.05, 0.05, 0.05]}
          position={[0, 0.18, 0]}
          style={{ fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }}
          outerStroke={{ type: 'Outline', width: 2, color: '#1a1a2e' }}
        />
      )}
    </ViroARImageMarker>
  );
}

// ViroReact sahne bileşenleri props'u sceneNavigator üzerinden alır
export default function ARAnimalScene({ sceneNavigator }) {
  const onAnimalFound = sceneNavigator?.viroAppProps?.onAnimalFound;

  return (
    <ViroARScene>
      {ANIMALS.map((animal) => (
        <AnimalMarker
          key={animal.id}
          animal={animal}
          onAnimalFound={onAnimalFound}
        />
      ))}
    </ViroARScene>
  );
}
