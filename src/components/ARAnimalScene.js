import React, { useState, useCallback, useRef, useEffect } from 'react';
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

// Modül düzeyinde kontrol — ViroReact sahneleri prop değişimini re-render
// olarak almadığından bu pattern kullanılıyor.
let _scanning = true;
let _resetCallback = null;

export function pauseScanning() {
  _scanning = false;
}

export function resumeScanning() {
  _resetCallback?.();
}

function AnimalMarker({ animal, isActive, onFound, onLost }) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [position, setPosition]       = useState(animal.modelPosition);

  const handleFound = useCallback(() => onFound(animal), [animal, onFound]);
  const handleLost  = useCallback(() => onLost(animal),  [animal, onLost]);

  const prevActive = useRef(isActive);
  if (prevActive.current !== isActive) {
    prevActive.current = isActive;
    if (!isActive) {
      setModelLoaded(false);
      setPosition(animal.modelPosition);
    }
  }

  const visible = isActive && modelLoaded;

  return (
    <ViroARImageMarker
      target={animal.targetName}
      onAnchorFound={handleFound}
      onAnchorRemoved={handleLost}
    >
      <ViroAmbientLight color="#ffffff" intensity={500} />
      <ViroDirectionalLight color="#ffffff" direction={[0, -1, -0.5]} intensity={300} />

      <ViroNode
        position={position}
        scale={visible ? animal.modelScale : [0, 0, 0]}
        rotation={animal.modelRotation}
        opacity={visible ? 1 : 0}
        dragType="FixedDistance"
        onDrag={(dragToPos) => setPosition(dragToPos)}
        animation={visible ? { name: 'bounce', run: true, loop: true } : undefined}
      >
        {isActive && (
          <Viro3DObject
            source={animal.model}
            type="GLB"
            onLoadEnd={() => setModelLoaded(true)}
            onError={(e) => console.warn(`Model yüklenemedi (${animal.name}):`, e)}
          />
        )}
      </ViroNode>

      {visible && (
        <ViroText
          text={`${animal.emoji} ${animal.name}`}
          scale={[0.04, 0.04, 0.04]}
          position={[0, 0.12, 0]}
          style={{ fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }}
          outerStroke={{ type: 'Outline', width: 2, color: '#1a1a2e' }}
        />
      )}
    </ViroARImageMarker>
  );
}

export default function ARAnimalScene({ sceneNavigator }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
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
    ViroAnimations.registerAnimations({
      idle_bounce:      { properties: { positionY: '+=0.008' }, easing: 'EaseInEaseOut', duration: 1000 },
      idle_bounce_back: { properties: { positionY: '-=0.008' }, easing: 'EaseInEaseOut', duration: 1000 },
      bounce: [['idle_bounce', 'idle_bounce_back']],
    });
  }

  const { onAnimalFound, onAnimalLost } = sceneNavigator?.viroAppProps ?? {};

  const [activeAnimalId, setActiveAnimalId] = useState(null);
  const candidatesRef  = useRef(new Set());
  const checkTimerRef  = useRef(null);
  const graceTimerRef  = useRef(null);

  useEffect(() => {
    _resetCallback = () => {
      // Önce taramayı kapat; ARKit önceki anchor'ları hemen raporlayabiliyor
      _scanning = false;
      setActiveAnimalId(null);
      candidatesRef.current.clear();
      if (checkTimerRef.current)  { clearTimeout(checkTimerRef.current);  checkTimerRef.current  = null; }
      if (graceTimerRef.current)  { clearTimeout(graceTimerRef.current);  graceTimerRef.current  = null; }
      // 600ms sonra taramayı aç — ARKit'in stale anchor burst'i bu sürede geçiyor
      graceTimerRef.current = setTimeout(() => {
        graceTimerRef.current = null;
        _scanning = true;
      }, 600);
    };
    return () => { _resetCallback = null; };
  }, []);

  const scheduleCheck = useCallback(() => {
    if (checkTimerRef.current) return;
    checkTimerRef.current = setTimeout(() => {
      checkTimerRef.current = null;
      const surviving = [...candidatesRef.current];
      if (surviving.length > 0) {
        const winner = ANIMALS.find(a => surviving.includes(a.id));
        if (winner) {
          setActiveAnimalId(winner.id);
          onAnimalFound?.(winner);
        }
      }
      candidatesRef.current.clear();
    }, 700);
  }, [onAnimalFound]);

  const handleFound = useCallback((animal) => {
    if (!_scanning) return;
    candidatesRef.current.add(animal.id);
    scheduleCheck();
  }, [scheduleCheck]);

  const handleLost = useCallback((animal) => {
    candidatesRef.current.delete(animal.id);
    if (!_scanning) return;
    setActiveAnimalId(prev => {
      if (prev === animal.id) {
        onAnimalLost?.();
        return null;
      }
      return prev;
    });
  }, [onAnimalLost]);

  return (
    <ViroARScene>
      {ANIMALS.map((animal) => (
        <AnimalMarker
          key={animal.id}
          animal={animal}
          isActive={activeAnimalId === animal.id}
          onFound={handleFound}
          onLost={handleLost}
        />
      ))}
    </ViroARScene>
  );
}
