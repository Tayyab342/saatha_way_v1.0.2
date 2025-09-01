import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Clock, MapPin, CheckCircle, Car, Route } from 'lucide-react';
import ThreeJSErrorBoundary from './ThreeJSErrorBoundary';

interface RideStatus3DProps {
  status: 'pending' | 'en-route' | 'completed';
  rideData?: {
    pickupLocation?: string;
    estimatedTime?: string;
    driverName?: string;
  };
}

// 3D Scene Components
const PendingScene = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.01;
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group>
      {/* Pulsing central sphere */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          emissive="#f59e0b" 
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Rotating rings */}
      <group ref={ringsRef}>
        {[1.5, 2, 2.5].map((radius, index) => (
          <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius, radius + 0.05, 32]} />
            <meshStandardMaterial 
              color="#fbbf24" 
              transparent 
              opacity={0.4 - index * 0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Floating text */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.5}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
      >
        PENDING
      </Text>
    </group>
  );
};

const EnRouteScene = () => {
  const towTruckRef = useRef<THREE.Group>(null);
  const routeRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);

  useFrame((state) => {
    if (towTruckRef.current && routeRef.current) {
      const time = state.clock.elapsedTime;
      const newProgress = (Math.sin(time * 0.5) + 1) / 2;
      setProgress(newProgress);
      
      // Move tow truck along route
      const angle = newProgress * Math.PI * 2;
      towTruckRef.current.position.x = Math.cos(angle) * 2;
      towTruckRef.current.position.z = Math.sin(angle) * 2;
      towTruckRef.current.rotation.y = angle + Math.PI / 2;
      
      // Animate route
      routeRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      {/* Route path */}
      <group ref={routeRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2.2, 32]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.6}
          />
        </mesh>
        
        {/* Progress indicator */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2.2, 32, 1, 0, Math.PI * 2 * progress]} />
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#059669"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Moving tow truck */}
      <group ref={towTruckRef}>
        {/* Main truck body */}
        <mesh>
          <boxGeometry args={[0.8, 0.25, 0.4]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        
        {/* Truck cab */}
        <mesh position={[0.3, 0.15, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.4]} />
          <meshStandardMaterial color="#FFA500" />
        </mesh>
        
        {/* Tow arm */}
        <mesh position={[-0.5, 0.05, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.4, 0.03, 0.03]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Hook */}
        <mesh position={[-0.7, -0.05, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
        
        {/* Wheels */}
        <mesh position={[0.25, -0.15, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.25, -0.15, -0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.25, -0.15, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.25, -0.15, -0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Emergency lights */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.1]} />
          <meshStandardMaterial 
            color="#FF0000" 
            emissive="#FF0000" 
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Speed lines */}
      {[...Array(8)].map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const radius = 3 + Math.sin(progress * Math.PI * 4) * 0.5;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.02, 0.02, 0.5]} />
            <meshStandardMaterial 
              color="#3b82f6" 
              transparent 
              opacity={0.6}
            />
          </mesh>
        );
      })}

      <Text
        position={[0, -3, 0]}
        fontSize={0.5}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        EN ROUTE
      </Text>
    </group>
  );
};

const CompletedScene = () => {
  const checkRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (checkRef.current) {
      checkRef.current.rotation.y += 0.01;
      checkRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
    
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, index) => {
        const time = state.clock.elapsedTime + index;
        child.position.y = Math.sin(time * 2) * 0.5 + 1;
        child.rotation.z += 0.02;
      });
    }
  });

  return (
    <group>
      {/* Success checkmark */}
      <group ref={checkRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.2, 32]} />
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#059669"
            emissiveIntensity={0.4}
          />
        </mesh>
        
        {/* Checkmark symbol */}
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Celebration particles */}
      <group ref={particlesRef}>
        {[...Array(12)].map((_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          const radius = 2;
          return (
            <mesh
              key={index}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial 
                color={index % 2 === 0 ? "#fbbf24" : "#10b981"} 
                emissive={index % 2 === 0 ? "#f59e0b" : "#059669"}
                emissiveIntensity={0.3}
              />
            </mesh>
          );
        })}
      </group>

      <Text
        position={[0, -2.5, 0]}
        fontSize={0.5}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        COMPLETED
      </Text>
    </group>
  );
};

const Scene3D = ({ status }: { status: 'pending' | 'en-route' | 'completed' }) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      
      {/* 3D Scene based on status */}
      {status === 'pending' && <PendingScene />}
      {status === 'en-route' && <EnRouteScene />}
      {status === 'completed' && <CompletedScene />}
    </>
  );
};

const StatusIcon = ({ status }: { status: 'pending' | 'en-route' | 'completed' }) => {
  const icons = {
    pending: Clock,
    'en-route': Car,
    completed: CheckCircle
  };
  
  const colors = {
    pending: 'text-warning',
    'en-route': 'text-primary',
    completed: 'text-success'
  };
  
  const Icon = icons[status];
  
  return (
    <motion.div
      className={`w-6 h-6 ${colors[status]}`}
      animate={{ rotate: status === 'pending' ? 360 : 0 }}
      transition={{ duration: 2, repeat: status === 'pending' ? Infinity : 0 }}
    >
      <Icon className="w-full h-full" />
    </motion.div>
  );
};

const RideStatus3D: React.FC<RideStatus3DProps> = ({ status, rideData }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          title: 'Ride Requested',
          subtitle: 'Finding a driver for you...',
          color: 'text-warning',
          bgColor: 'bg-warning/5',
          borderColor: 'border-warning/20'
        };
      case 'en-route':
        return {
          title: 'Driver En Route',
          subtitle: `${rideData?.driverName || 'Driver'} is on the way`,
          color: 'text-primary',
          bgColor: 'bg-primary/5',
          borderColor: 'border-primary/20'
        };
      case 'completed':
        return {
          title: 'Ride Completed',
          subtitle: 'Thank you for choosing Saatha Way!',
          color: 'text-success',
          bgColor: 'bg-success/5',
          borderColor: 'border-success/20'
        };
    }
  };

  const config = getStatusConfig();

  if (!mounted) {
    return (
      <div className="card-glass p-6 animate-pulse">
        <div className="h-64 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <motion.div
      className={`card-glass p-6 border-2 ${config.bgColor} ${config.borderColor}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <StatusIcon status={status} />
          <div>
            <h3 className={`text-xl font-bold ${config.color}`}>
              {config.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {config.subtitle}
            </p>
          </div>
        </div>
        
        <motion.div
          className="text-right"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-xs text-muted-foreground">Status</div>
          <div className={`text-sm font-semibold ${config.color} uppercase tracking-wide`}>
            {status.replace('-', ' ')}
          </div>
        </motion.div>
      </div>

      {/* 3D Canvas */}
      <div className="h-64 rounded-lg overflow-hidden bg-gradient-to-br from-background to-secondary/20">
        <ThreeJSErrorBoundary>
          <Canvas
            camera={{ position: [0, 2, 8], fov: 50 }}
            style={{ background: 'transparent' }}
          >
            <Scene3D status={status} />
          </Canvas>
        </ThreeJSErrorBoundary>
      </div>

      {/* Status Details */}
      <div className="mt-6 space-y-3">
        {rideData?.pickupLocation && (
          <motion.div
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Pickup Location</div>
              <div className="text-sm font-medium">{rideData.pickupLocation}</div>
            </div>
          </motion.div>
        )}
        
        {rideData?.estimatedTime && status === 'en-route' && (
          <motion.div
            className="flex items-center gap-3 p-3 rounded-lg bg-primary/10"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Route className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Estimated Arrival</div>
              <div className="text-sm font-medium text-primary">{rideData.estimatedTime}</div>
            </div>
          </motion.div>
        )}
        
        {status === 'completed' && (
          <motion.div
            className="text-center p-4 rounded-lg bg-success/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-success font-semibold mb-1">Ride Complete!</div>
            <div className="text-xs text-muted-foreground">
              We hope you had a great experience with Saatha Way
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RideStatus3D;