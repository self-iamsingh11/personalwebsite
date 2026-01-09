'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import styles from './MagneticButton.module.css';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    href?: string;
    intensity?: number;
    variant?: 'primary' | 'secondary' | 'ghost';
}

export default function MagneticButton({
    children,
    className = '',
    onClick,
    href,
    intensity = 0.3,
    variant = 'primary',
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useSpring(0, { stiffness: 300, damping: 20 });
    const y = useSpring(0, { stiffness: 300, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = (e.clientX - centerX) * intensity;
        const distanceY = (e.clientY - centerY) * intensity;

        x.set(distanceX);
        y.set(distanceY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const ButtonWrapper = href ? motion.a : motion.button;

    return (
        <ButtonWrapper
            ref={buttonRef as React.RefObject<HTMLButtonElement & HTMLAnchorElement>}
            href={href}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
            className={`${styles.button} ${styles[variant]} ${className}`}
            whileTap={{ scale: 0.95 }}
        >
            <span className={styles.content}>{children}</span>
            <span className={`${styles.glow} ${isHovered ? styles.glowActive : ''}`} />
        </ButtonWrapper>
    );
}
