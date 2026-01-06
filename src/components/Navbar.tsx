'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';

const links = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Hobbies', path: '/hobbies' },
    { name: 'Playground', path: '/playground' },
    { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navContainer}>
            <ul className={styles.navList}>
                {links.map((link) => (
                    <li key={link.path} className={styles.navItem}>
                        <Link href={link.path} className={styles.navLink}>
                            {pathname === link.path && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={styles.activeBackground}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className={styles.linkText}>{link.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
