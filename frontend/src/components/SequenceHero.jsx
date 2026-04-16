import React, { useEffect, useRef, useState, useMemo } from 'react';

// Import all 40 full body images sequentially
const imageModules = import.meta.glob('../assets/FullBody/ezgif-frame-*.jpg', { eager: true, as: 'url' });
// Sort keys to ensure correct sequential order (001 to 040)
const imageUrls = Object.keys(imageModules)
    .sort()
    .map(key => imageModules[key]);

const SequenceHero = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const imageCache = useRef([]);

    // Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const preloadImages = () => {
            const cache = [];
            imageUrls.forEach((src, index) => {
                const img = new Image();
                img.src = src;
                // Pre-render image to an offscreen canvas for instantaneous blitting
                const offscreen = document.createElement('canvas');
                // We'll set size when loaded
                img.onload = () => {
                    offscreen.width = img.width;
                    offscreen.height = img.height;
                    const octx = offscreen.getContext('2d', { alpha: false });
                    octx.drawImage(img, 0, 0);

                    loadedCount++;
                    if (loadedCount === imageUrls.length) {
                        setImagesLoaded(true);
                    }
                };
                // Store the offscreen canvas instead of the raw image object
                cache[index] = offscreen;
            });
            imageCache.current = cache;
        };
        preloadImages();
    }, []);

    // Handle Scroll Progress
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const { top, height } = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how far we've scrolled within this container
            // Start when top touches the top of viewport, end when bottom touches bottom of viewport
            const scrollableDistance = height - windowHeight;
            const currentScroll = -top;

            let progress = currentScroll / scrollableDistance;
            progress = Math.max(0, Math.min(1, progress));
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Trigger once on mount
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Request Animation Frame to decouple rendering from scroll events
    const drawFrameRef = useRef(null);
    const prevProgress = useRef(-1);

    // Draw Frame to Canvas
    useEffect(() => {
        if (!imagesLoaded || !canvasRef.current || imageCache.current.length === 0) return;

        const canvas = canvasRef.current;
        // Handle High DPI displays
        const dpr = window.devicePixelRatio || 1;
        // Set actual size in memory (scaled to account for extra pixel density)
        if (canvas.width !== canvas.clientWidth * dpr) {
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
        }

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        const draw = () => {
            // Small optimization: don't redraw if progress hasn't changed meaningfully
            // Or smooth it out using lerp (linear interpolation)
            let targetProgress = scrollProgress;

            // Smooth interpolation for the scroll (momentum effect)
            // We increased lerp to 0.08 for a faster, more responsive momentum track
            if (prevProgress.current === -1) {
                prevProgress.current = targetProgress;
            } else {
                prevProgress.current = prevProgress.current + (targetProgress - prevProgress.current) * 0.08;
            }

            // We have 40 sequence frames (0 to 39 limit index)
            const maxFrameIndex = imageUrls.length - 1;

            // Calculate exact continuous frame index (e.g., 14.65)
            const exactFrame = prevProgress.current * maxFrameIndex;

            const frameIndex = Math.floor(exactFrame);
            const nextFrameIndex = Math.min(maxFrameIndex, frameIndex + 1);
            const fraction = exactFrame - frameIndex;

            const img1 = imageCache.current[frameIndex];
            const img2 = imageCache.current[nextFrameIndex];

            if (img1 && ctx) {
                // Reset scale before clear
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.scale(dpr, dpr);

                // Object cover drawing math
                const canvasAspect = canvas.clientWidth / canvas.clientHeight;
                const imgAspect = img1.width / img1.height;
                let drawWidth, drawHeight, offsetX, offsetY;

                // Ensure image fits nicely within bounds but stays fully visible (contain)
                if (canvasAspect > imgAspect) {
                    drawHeight = canvas.clientHeight;
                    drawWidth = drawHeight * imgAspect;
                    offsetX = (canvas.clientWidth - drawWidth) / 2;
                    offsetY = 0;
                } else {
                    drawHeight = canvas.clientHeight;
                    drawWidth = drawHeight * imgAspect;
                    offsetX = (canvas.clientWidth - drawWidth) / 2;
                    offsetY = 0;
                }

                // Draw Base Frame
                ctx.globalAlpha = 1;
                ctx.drawImage(img1, offsetX, offsetY, drawWidth, drawHeight);

                // If not the exact last frame, crossfade the next frame over the top
                if (img2 && fraction > 0) {
                    ctx.globalAlpha = fraction;
                    ctx.drawImage(img2, offsetX, offsetY, drawWidth, drawHeight);
                }

                // Restore opacity
                ctx.globalAlpha = 1;
            }

            // Continue animating loop
            drawFrameRef.current = requestAnimationFrame(draw);
        };

        drawFrameRef.current = requestAnimationFrame(draw);

        return () => {
            if (drawFrameRef.current) {
                cancelAnimationFrame(drawFrameRef.current);
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        };
    }, [imagesLoaded, scrollProgress]);


    // Derived Opacities based on Scroll Percentage mapped to text segments
    const texts = useMemo(() => [
        {
            range: [0.08, 0.20],
            title: (
                <>
                    <div style={{ color: '#0f172a' }}>AutoMed AI</div>
                    <div style={{ fontSize: '2rem', color: '#1e293b', marginTop: '0.5rem' }}>Preventive Intelligence for Life.</div>
                </>
            ),
            color: '#0f172a',
            align: 'center',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%'
        },
        {
            range: [0.25, 0.45], // Around 30%
            title: "Understanding Your Internal Signals",
            color: "var(--text-main)",
            align: 'left',
            left: '5%', // Made more left aligned
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40%'
        },
        {
            range: [0.55, 0.75], // Around 60%
            title: "Transforming Data into Health Insight",
            color: "var(--text-main)",
            align: 'right',
            left: 'auto',
            right: '5%', // Made more right aligned
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40%'
        },
        {
            range: [0.85, 1.0], // Around 90%
            title: "Start Your Proactive Health Journey",
            color: "#ffffff", // White text
            align: 'center',
            left: '50%',
            top: '85%', // Positioned near bottom
            transform: 'translate(-50%, -50%)',
            width: '60%',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.8), 0 0 10px rgba(14, 165, 233, 0.8)' // Strong dark drop shadow to contrast bright background glow
        }
    ], []);

    // Helper to calculate opacity mapping per segment
    // Fades in when entering range, stays active, fades out leaving range
    const calculateOpacity = (range) => {
        const [start, end] = range;
        const fadeWindow = 0.05; // 5% fade window

        if (scrollProgress < start - fadeWindow || scrollProgress > end + fadeWindow) return 0;

        // Fade IN
        if (scrollProgress >= start - fadeWindow && scrollProgress < start) {
            return (scrollProgress - (start - fadeWindow)) / fadeWindow;
        }
        // Fade OUT
        if (scrollProgress > end && scrollProgress <= end + fadeWindow) {
            return 1 - ((scrollProgress - end) / fadeWindow);
        }
        // Fully visible inside range
        return 1;
    };

    return (
        <div ref={containerRef} style={{
            height: '300vh',  // Decreased scrollable area so it completes faster
            position: 'relative',
            background: 'linear-gradient(to bottom, #F8FAFC, #FFFFFF)'
        }}>
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>

                {/* Loading Shimmer while downloading frames */}
                {!imagesLoaded && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#ffffff',
                        zIndex: 10
                    }}>
                        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>
                            Loading sequence...
                        </div>
                    </div>
                )}

                {/* The Frame Renderer */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        zIndex: 1
                    }}
                />

                {/* Background Gradients (Soft clinical lighting) */}
                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '5%',
                    width: '30%',
                    height: '30%',
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 60%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '5%',
                    right: '5%',
                    width: '30%',
                    height: '30%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 60%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />

                {/* Text Storytelling Overlays */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    pointerEvents: 'none'
                }}>
                    {texts.map((text, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: text.top || '50%',
                                left: text.left,
                                right: text.right,
                                transform: text.transform,
                                width: text.width,
                                textAlign: text.align,
                                opacity: calculateOpacity(text.range),
                                transition: 'opacity 0.1s ease',
                            }}
                        >
                            <h2 style={{
                                fontSize: '3.5rem',
                                lineHeight: '1.2',
                                fontWeight: '700',
                                color: text.color,
                                letterSpacing: '-1px',
                                textShadow: text.textShadow || '0 4px 20px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.6)'
                            }}>
                                {text.title}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SequenceHero;
