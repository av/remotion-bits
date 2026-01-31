import React from "react";
import { random } from "remotion";
import type { Element3DProps, TransitionConfig } from "./types";
import { useCamera } from "./context";
import {
  useMotionTiming,
  buildMotionStyles,
  getEasingFunction,
  interpolateKeyframes,
} from "../../utils/motion";
import { Transform3D, Vector3 } from "../../utils/transform3d";
import { transformToCSS } from "../../utils/interpolate3d";

const ELEMENT3D_SYMBOL = Symbol("Scene3D.Element3D");

export function isElement3D(
  element: React.ReactNode
): element is React.ReactElement<Element3DProps> {
  return (
    React.isValidElement(element) &&
    typeof element.type === "function" &&
    ELEMENT3D_SYMBOL in element.type
  );
}

function calculateStaggerIndex(
  actualIndex: number,
  totalChildren: number,
  direction: "forward" | "reverse" | "center" | "random"
): number {
  if (direction === "reverse") {
    return totalChildren - 1 - actualIndex;
  }
  if (direction === "center") {
    const mid = Math.floor(totalChildren / 2);
    return Math.abs(actualIndex - mid);
  }
  if (direction === "random") {
    const indices = Array.from({ length: totalChildren }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(random(`element3d-stagger-${i}`) * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.indexOf(actualIndex);
  }
  return actualIndex;
}

function useTransitionStyle(
  transition: TransitionConfig | undefined
): React.CSSProperties {
  const progress = useMotionTiming({
    frames: transition?.frames,
    duration: transition?.duration,
    delay: transition?.delay ?? 0,
    easing: transition?.easing,
  });

  if (!transition) {
    return {};
  }

  return buildMotionStyles({
    progress,
    transforms: {
      x: transition.x,
      y: transition.y,
      z: transition.z,
      scale: transition.scale,
      scaleX: transition.scaleX,
      scaleY: transition.scaleY,
      rotate: transition.rotate,
      rotateX: transition.rotateX,
      rotateY: transition.rotateY,
      rotateZ: transition.rotateZ,
      skew: transition.skew,
      skewX: transition.skewX,
      skewY: transition.skewY,
    },
    styles: {
      opacity: transition.opacity,
      color: transition.color,
      backgroundColor: transition.backgroundColor,
      blur: transition.blur,
    },
    easing: getEasingFunction(transition.easing),
  });
}

interface StaggeredChildProps {
  child: React.ReactNode;
  actualIndex: number;
  staggerIndex: number;
  transition: TransitionConfig;
}

const StaggeredChild: React.FC<StaggeredChildProps> = ({
  child,
  actualIndex,
  staggerIndex,
  transition,
}) => {
  const staggerProgress = useMotionTiming({
    frames: transition.frames,
    duration: transition.duration,
    delay: transition.delay ?? 0,
    stagger: transition.stagger,
    unitIndex: staggerIndex,
    easing: transition.easing,
  });

  const staggerStyle = buildMotionStyles({
    progress: staggerProgress,
    transforms: {
      x: transition.x,
      y: transition.y,
      z: transition.z,
      scale: transition.scale,
      scaleX: transition.scaleX,
      scaleY: transition.scaleY,
      rotate: transition.rotate,
      rotateX: transition.rotateX,
      rotateY: transition.rotateY,
      rotateZ: transition.rotateZ,
      skew: transition.skew,
      skewX: transition.skewX,
      skewY: transition.skewY,
    },
    styles: {
      opacity: transition.opacity,
      color: transition.color,
      backgroundColor: transition.backgroundColor,
      blur: transition.blur,
    },
    easing: getEasingFunction(transition.easing),
  });

  if (React.isValidElement(child)) {
    const existingStyle = (child.props as any).style || {};
    return React.cloneElement(child, {
      key: actualIndex,
      style: { ...existingStyle, ...staggerStyle },
    } as any);
  }

  return (
    <span key={actualIndex} style={staggerStyle}>
      {child}
    </span>
  );
};

const Element3DComponent: React.FC<Element3DProps> = ({
  x = 0,
  y = 0,
  z = 0,
  scale = 1,
  scaleX = 1,
  scaleY = 1,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  rotateOrder = "xyz",
  fixed = false,
  transition,
  className,
  style,
  children,
}) => {
  const camera = useCamera();

  const xVal = interpolateKeyframes(x, 1);
  const yVal = interpolateKeyframes(y, 1);
  const zVal = interpolateKeyframes(z, 1);
  const scaleVal = interpolateKeyframes(scale, 1);
  const scaleXVal = interpolateKeyframes(scaleX, 1);
  const scaleYVal = interpolateKeyframes(scaleY, 1);
  const rotateXVal = interpolateKeyframes(rotateX, 1);
  const rotateYVal = interpolateKeyframes(rotateY, 1);
  const rotateZVal = interpolateKeyframes(rotateZ, 1);

  const degreesToRadians = Math.PI / 180;

  const elementTransform = Transform3D.fromEuler(
    rotateXVal * degreesToRadians,
    rotateYVal * degreesToRadians,
    rotateZVal * degreesToRadians,
    new Vector3(xVal, yVal, zVal),
    new Vector3(scaleVal * scaleXVal, scaleVal * scaleYVal, scaleVal),
    rotateOrder.toUpperCase() as any
  );

  let finalTransform: Transform3D;

  if (fixed) {
    const cameraTransform = Transform3D.fromEuler(
      camera.rotateX * degreesToRadians,
      camera.rotateY * degreesToRadians,
      camera.rotateZ * degreesToRadians,
      new Vector3(camera.x, camera.y, camera.z),
      new Vector3(camera.scale * camera.scaleX, camera.scale * camera.scaleY, camera.scale)
    );
    
    finalTransform = cameraTransform.multiply(elementTransform);
  } else {
    finalTransform = elementTransform;
  }

  const transformString = transformToCSS(finalTransform);

  const childArray = React.Children.toArray(children);
  const totalChildren = childArray.length;

  const transitionStyle = useTransitionStyle(transition?.stagger ? undefined : transition);

  const elementStyle: React.CSSProperties = {
    position: "absolute",
    transformStyle: "preserve-3d",
    transform: transformString,
    ...style,
    ...transitionStyle,
  };

  const renderChildren = () => {
    if (!transition?.stagger) {
      return children;
    }

    const staggerDirection = transition.staggerDirection ?? "forward";

    return childArray.map((child, actualIndex) => {
      const staggerIndex = calculateStaggerIndex(actualIndex, totalChildren, staggerDirection);
      return (
        <StaggeredChild
          key={actualIndex}
          child={child}
          actualIndex={actualIndex}
          staggerIndex={staggerIndex}
          transition={transition}
        />
      );
    });
  };

  return (
    <div className={className} style={elementStyle} data-element3d-fixed={fixed}>
      {renderChildren()}
    </div>
  );
};

(Element3DComponent as any)[ELEMENT3D_SYMBOL] = true;

export const Element3D = Element3DComponent;
