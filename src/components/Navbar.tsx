'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, FolderGit2, Bike, Gamepad2, Mail } from 'lucide-react';
import styles from './Navbar.module.css';

const links = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Hobbies', path: '/hobbies', icon: Bike },
    { name: 'Playground', path: '/playground', icon: Gamepad2 },
    { name: 'Contact', path: '/contact', icon: Mail },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navContainer}>
            <ul className={styles.navList}>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.path;

                    return (
                        <li key={link.path} className={styles.navItem}>
                            <Link href={link.path} className={styles.navLink}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className={styles.activeBackground}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className={styles.iconWrapper}>
                                    <Icon size={18} strokeWidth={2.5} />
                                </span>
                                <span className={styles.linkText}>{link.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
