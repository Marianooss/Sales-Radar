"use client";

import React, { useState, useMemo } from "react";
import { Video, Platform, Niche } from "@/types";
import {
    formatNumber,
    getPlatformIcon,
    getPlatformColor,
    getScoreColor,
    getHookTypeLabel,
} from "@/utils/helpers";
import styles from "./RadarModule.module.css";

interface RadarModuleProps {
    videos: Video[];
    isLoading?: boolean;
    error?: string | null;
    onGenerateScript: (video: Video) => void;
    onViewComments: (video: Video) => void;
    onRefresh: () => void;
}

const PLATFORMS: Platform[] = ["tiktok", "instagram", "youtube"];
const NICHES: (Niche | "Todos")[] = ["Todos", "Tech", "Hogar", "Moda", "Belleza", "Lifestyle"];

export default function RadarModule({
    videos,
    isLoading,
    error,
    onGenerateScript,
    onViewComments,
    onRefresh
}: RadarModuleProps) {
    const [activePlatforms, setActivePlatforms] = useState<Platform[]>([]);
    const [activeNiche, setActiveNiche] = useState<Niche | "Todos">("Todos");
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const filteredVideos = useMemo(() => {
        let results = [...videos];
        if (activePlatforms.length > 0) {
            results = results.filter((v) => activePlatforms.includes(v.platform));
        }
        if (activeNiche !== "Todos") {
            results = results.filter((v) => v.niche === activeNiche);
        }
        return results.sort((a, b) => b.salesScore - a.salesScore);
    }, [videos, activePlatforms, activeNiche]);

    const togglePlatform = (p: Platform) => {
        setActivePlatforms((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );
    };

    const totalScanned = videos.reduce((acc, v) => acc + v.views, 0);
    const totalBuySignals = videos.reduce((acc, v) => acc + Math.round(v.commentCount * (v.buySignalScore / 100)), 0);

    return (
        <div className={styles.radar}>
            {/* Stats Banner */}
            <div className={styles.statsBanner}>
                <div className={styles.statItem}>
                    <span className={styles.statValue} style={{ color: "var(--blue)" }}>
                        {formatNumber(totalScanned)}
                    </span>
                    <span className={styles.statLabel}>Videos escaneados</span>
                </div>
                <div className={styles.statSep} />
                <div className={styles.statItem}>
                    <span className={styles.statValue} style={{ color: "var(--gold)" }}>
                        {formatNumber(totalBuySignals)}
                    </span>
                    <span className={styles.statLabel}>Con señal de compra</span>
                </div>
                <div className={styles.statSep} />
                <div className={styles.statItem}>
                    <span className={styles.statValue} style={{ color: "var(--green)" }}>
                        {filteredVideos.length}
                    </span>
                    <span className={styles.statLabel}>Trending ahora</span>
                </div>
            </div>

            {/* Platform Filters */}
            <div className={styles.filterRow}>
                <div className={styles.platformsScroll}>
                    {PLATFORMS.map((p) => (
                        <button
                            key={p}
                            className={`${styles.platformChip} ${activePlatforms.includes(p) ? styles.chipActive : ""}`}
                            onClick={() => togglePlatform(p)}
                            style={{
                                "--chip-color": getPlatformColor(p),
                            } as React.CSSProperties}
                            aria-pressed={activePlatforms.includes(p)}
                        >
                            <span>{getPlatformIcon(p)}</span>
                            <span>{p === "tiktok" ? "TikTok" : p === "instagram" ? "Instagram" : "YouTube"}</span>
                        </button>
                    ))}
                </div>

                <button
                    className={`${styles.refreshBtn} ${isLoading ? styles.refreshing : ""}`}
                    onClick={onRefresh}
                    disabled={isLoading}
                    title="Actualizar datos"
                >
                    {isLoading ? "⚙️" : "🔄"}
                </button>
            </div>

            {/* Niche Filters */}
            <div className={styles.filterRow}>
                <div className={styles.nichesScroll}>
                    {NICHES.map((n) => (
                        <button
                            key={n}
                            className={`${styles.nicheChip} ${activeNiche === n ? styles.nicheActive : ""}`}
                            onClick={() => setActiveNiche(n)}
                            aria-pressed={activeNiche === n}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className={styles.error}>
                    <span>⚠️ Error cargando videos: {error}</span>
                </div>
            )}

            {/* Video List */}
            {filteredVideos.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🔍</div>
                    <h3 className={styles.emptyTitle}>Sin videos en este nicho hoy</h3>
                    <p className={styles.emptySubtitle}>
                        Probá con otro nicho o quitá el filtro de plataforma
                    </p>
                    <button
                        className="btn btn-outline"
                        onClick={() => {
                            setActivePlatforms([]);
                            setActiveNiche("Todos");
                        }}
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <div className={styles.videoList}>
                    {filteredVideos.map((video, idx) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            index={idx}
                            onGenerate={() => onGenerateScript(video)}
                            onComments={() => onViewComments(video)}
                            onSelect={() => setSelectedVideo(video)}
                        />
                    ))}
                </div>
            )}

            {/* Video Detail Sheet */}
            {selectedVideo && (
                <VideoDetailSheet
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                    onGenerate={() => onGenerateScript(selectedVideo)}
                />
            )}
        </div>
    );
}

/* ===== VideoCard Component ===== */
function VideoCard({
    video,
    index,
    onGenerate,
    onComments,
    onSelect,
}: {
    video: Video;
    index: number;
    onGenerate: () => void;
    onComments: () => void;
    onSelect: () => void;
}) {
    const buyComments = Math.round(video.commentCount * (video.buySignalScore / 100));
    const scoreColor = getScoreColor(video.salesScore);

    return (
        <article
            className={styles.videoCard}
            style={{
                borderLeftColor: getPlatformColor(video.platform),
                animationDelay: `${index * 60}ms`,
            }}
        >
            {/* Header */}
            <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                    <span className={styles.platformIcon}>{getPlatformIcon(video.platform)}</span>
                    <span className={styles.creatorHandle}>{video.creatorHandle}</span>
                    <span className={`badge badge-niche`}>{video.niche}</span>
                </div>
                <div className={styles.scoreCircle} style={{ borderColor: scoreColor, color: scoreColor }}>
                    <span className={styles.scoreNumber}>{video.salesScore}</span>
                    <span className={styles.scoreLabel}>score</span>
                </div>
            </div>

            {/* Title */}
            <h3 className={styles.videoTitle} onClick={onSelect} role="button" tabIndex={0}>
                {video.title}
            </h3>

            {/* Score Bar */}
            <div className={styles.scoreBarTrack}>
                <div
                    className={styles.scoreBarFill}
                    style={{
                        width: `${video.salesScore}%`,
                        background: scoreColor,
                    }}
                />
            </div>

            {/* Metrics */}
            <div className={styles.metrics}>
                <span className={styles.metricItem}>
                    <span>👁</span> {formatNumber(video.views)}
                </span>
                <span className={`${styles.metricItem} ${styles.metricBuy}`}>
                    <span>💰</span> {formatNumber(buyComments)} compras
                </span>
                <span className={styles.metricHook}>
                    <span>⚡</span> {video.hookType === "unboxing" || video.hookType === "demo"
                        ? `Producto <${video.productVisibleAt}s`
                        : getHookTypeLabel(video.hookType)}
                </span>
            </div>

            {/* Actions */}
            <div className={styles.cardActions}>
                <button 
                    className="btn btn-outline-gold btn-compact" 
                    style={{ flex: 1 }} 
                    onClick={onGenerate}
                >
                    ✍️ Generar guión similar
                </button>
                <button 
                    className="btn btn-outline-blue btn-compact" 
                    style={{ flex: 1 }} 
                    onClick={onComments}
                >
                    💬 Ver comentarios
                </button>
                <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline-green btn-compact" 
                    style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
                >
                    🔗 Ver video
                </a>
            </div>
        </article>
    );
}

/* ===== Video Detail Sheet ===== */
function VideoDetailSheet({
    video,
    onClose,
    onGenerate,
}: {
    video: Video;
    onClose: () => void;
    onGenerate: () => void;
}) {
    const buyComments = Math.round(video.commentCount * (video.buySignalScore / 100));

    return (
        <div className={styles.sheetOverlay} onClick={onClose}>
            <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
                <div className={styles.sheetHandle} />

                <div className={styles.sheetHeader}>
                    <div>
                        <span className={styles.platformIcon}>{getPlatformIcon(video.platform)}</span>
                        <span className={styles.creatorHandle}>{video.creatorHandle}</span>
                    </div>
                    <button className={styles.sheetClose} onClick={onClose} aria-label="Cerrar detalle">✕</button>
                </div>

                <h2 className={styles.sheetTitle}>{video.title}</h2>

                {/* Expanded Metrics */}
                <div className={styles.metricsGrid}>
                    <div className={styles.metricBox}>
                        <span className={styles.metricBoxValue}>{formatNumber(video.views)}</span>
                        <span className={styles.metricBoxLabel}>Views</span>
                    </div>
                    <div className={styles.metricBox}>
                        <span className={styles.metricBoxValue}>{formatNumber(video.likes)}</span>
                        <span className={styles.metricBoxLabel}>Likes</span>
                    </div>
                    <div className={styles.metricBox}>
                        <span className={styles.metricBoxValue}>{formatNumber(video.shareCount)}</span>
                        <span className={styles.metricBoxLabel}>Shares</span>
                    </div>
                    <div className={styles.metricBox} style={{ borderColor: "rgba(0,255,136,0.3)" }}>
                        <span className={styles.metricBoxValue} style={{ color: "var(--green)" }}>
                            {formatNumber(buyComments)}
                        </span>
                        <span className={styles.metricBoxLabel}>Buy Signals</span>
                    </div>
                </div>

                {/* Buy Signal Score Large */}
                <div className={styles.buyScoreLarge}>
                    <span className={styles.buyScoreNumber} style={{ color: getScoreColor(video.buySignalScore) }}>
                        {video.buySignalScore}
                    </span>
                    <span className={styles.buyScoreLabel}>BUY SIGNAL SCORE</span>
                </div>

                {/* Hook Analysis */}
                <div className={styles.hookAnalysis}>
                    <h4 className={styles.sectionTitle}>⚡ Análisis del Hook</h4>
                    <div className={styles.hookDetails}>
                        <div className={styles.hookDetail}>
                            <span className={styles.hookDetailLabel}>Producto visible en:</span>
                            <span className={styles.hookDetailValue} style={{ color: "var(--green)" }}>
                                {video.productVisibleAt}s
                            </span>
                        </div>
                        <div className={styles.hookDetail}>
                            <span className={styles.hookDetailLabel}>Tipo de hook:</span>
                            <span className={styles.hookDetailValue}>{getHookTypeLabel(video.hookType)}</span>
                        </div>
                        <div className={styles.hookDetail}>
                            <span className={styles.hookDetailLabel}>Hook score:</span>
                            <span className={styles.hookDetailValue} style={{ color: getScoreColor(video.hookScore) }}>
                                {video.hookScore}/100
                            </span>
                        </div>
                    </div>
                    <p className={styles.hookRecommendation}>
                        {video.hookScore >= 90
                            ? "🟢 STRONG HOOK — producto visible en <1s con texto de precio"
                            : video.hookScore >= 80
                                ? "🟡 GOOD HOOK — producto aparece rápido con contexto claro"
                                : "🔴 WEAK HOOK — considerar reestructurar los primeros 3 segundos"}
                    </p>
                </div>

                <button className="btn btn-primary-gold w-full" onClick={onGenerate}>
                    ✍️ Generar guión basado en este video
                </button>
            </div>
        </div>
    );
}
