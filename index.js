import { useState, useRef, useMemo } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Loader, ServerCrash, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Point, PointMaterial, Points } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// --- 3D Starfield Background Component ---
// This creates the immersive, animated background.
function Starfield(props) {
    const ref = useRef();
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

// --- Magnetic Button Component ---
// This button pulls towards the mouse for a great UX feel.
function MagneticButton({ children, ...props }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;
    return (
        <motion.button
            ref={ref}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            {...props}
        >
            {children}
        </motion.button>
    );
}

// --- Main Page Component ---
export default function Home() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/scrape', { url }, { responseType: 'blob' });
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'website.zip';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch.length > 1) {
                    filename = filenameMatch[1];
                }
            }
            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
            setUrl('');
            setSuccess(true);
        } catch (err) {
            if (err.response) {
                const errorText = await err.response.data.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    setError(errorJson.detail || 'A server error occurred.');
                } catch {
                    setError('An unreadable server error occurred.');
                }
            } else if (err.request) {
                setError('Backend connection failed. Is the Python server running?');
            } else {
                setError(`An unexpected error occurred: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Web Scrapper | Deep Web Scraper</title>
                <meta name="description" content="A high-level, aesthetic web scraper with 3D effects." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen w-full bg-black text-slate-100 flex flex-col justify-between p-8 relative">
                {/* 3D Canvas is the background */}
                <Canvas className="absolute top-0 left-0 z-0">
                    <Starfield />
                </Canvas>

                {/* Header Section */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full flex justify-between items-center z-10"
                >
                    <h1 className="text-xl font-bold tracking-widest uppercase">Web Scrapper</h1>
                    <p className="text-xs text-slate-400">Powered by Python & Next.js</p>
                </motion.header>

                {/* Main Content Section - The Centerpiece */}
                <main className="flex-grow flex flex-col items-center justify-center z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
                        className="w-full max-w-2xl"
                    >
                        <form onSubmit={handleSubmit} className="w-full flex items-center gap-4">
                            <input
                                type="url"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                placeholder="Enter a universe (URL) to conquer..."
                                className="flex-grow px-6 py-4 text-lg bg-black/50 border-2 border-slate-700 rounded-full focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 backdrop-blur-sm"
                                required
                                disabled={loading}
                            />
                            <MagneticButton
                                type="submit"
                                disabled={loading || !url}
                                className="flex-shrink-0 w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-500"
                            >
                                {loading ? <Loader className="animate-spin" /> : <ArrowRight size={32} />}
                            </MagneticButton>
                        </form>
                    </motion.div>
                </main>

                {/* Footer / Status Section */}
                <footer className="w-full flex justify-center items-center h-10 z-10">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="flex items-center gap-3 bg-red-900/50 text-red-300 p-3 px-4 rounded-full border border-red-500/30 backdrop-blur-sm"
                            >
                                <ServerCrash size={16} />
                                <p className="text-sm font-medium">{error}</p>
                            </motion.div>
                        )}
                        {success && !error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="flex items-center gap-3 bg-green-900/50 text-green-300 p-3 px-4 rounded-full border border-green-500/30 backdrop-blur-sm"
                            >
                                <p className="text-sm font-medium">Download initiated successfully!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </footer>
            </div>
        </>
    );
}