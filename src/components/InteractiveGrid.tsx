'use client';

import React, { useRef, useEffect } from 'react';
import styles from './InteractiveGrid.module.css';

export default function InteractiveGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width: number, height: number;
        let mouse = { x: -1000, y: -1000 };

        const points: Point[] = [];
        const spacing = 40;
        const radius = 2;

        class Point {
            x: number;
            y: number;
            originX: number;
            originY: number;
            color: string;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.originX = x;
                this.originY = y;
                this.color = '#ffffff';
            }

            update(mouseX: number, mouseY: number) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = 200;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * 40;
                const directionY = forceDirectionY * force * 40;

                if (distance < maxDistance) {
                    this.x -= directionX;
                    this.y -= directionY;
                    this.color = '#7c3aed'; // Violet accent on interact
                } else {
                    // Return to origin
                    if (this.x !== this.originX) {
                        const dx = this.originX - this.x;
                        this.x += dx * 0.1;
                    }
                    if (this.y !== this.originY) {
                        const dy = this.originY - this.y;
                        this.y += dy * 0.1;
                    }
                    this.color = 'rgba(255, 255, 255, 0.15)';
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            points.length = 0;

            for (let x = 0; x < width; x += spacing) {
                for (let y = 0; y < height; y += spacing) {
                    points.push(new Point(x, y));
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            points.forEach(point => {
                point.update(mouse.x, mouse.y);
                point.draw(ctx);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}
