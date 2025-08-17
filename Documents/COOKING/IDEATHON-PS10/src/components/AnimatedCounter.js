import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ 
  end, 
  start = 0, 
  duration = 1000, 
  suffix = "", 
  prefix = "",
  decimals = 0,
  className = "",
  onComplete
}) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    if (end === start) {
      setCount(end);
      return;
    }

    setIsAnimating(true);
    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = start + (end - start) * easeOutQuart;

      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setCount(end);
        if (onComplete) onComplete();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, start, duration, onComplete]);

  const formatNumber = (num) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.round(num);
  };

  return (
    <span className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default AnimatedCounter;