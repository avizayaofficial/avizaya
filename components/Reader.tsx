'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ReaderProps {
  htmlContent: string;
  episodeId: number;
  initialScrollPercent: number;
  initialFontSizePx: number;
}

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 24;
const FONT_STEP = 1;
const AUTOSAVE_INTERVAL_MS = 3000;

export default function Reader({
  htmlContent,
  episodeId,
  initialScrollPercent,
  initialFontSizePx,
}: ReaderProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [fontSizePx, setFontSizePx] = useState(initialFontSizePx);
  const hasRestoredPositionRef = useRef(false);
  const lastSavedScrollRef = useRef(initialScrollPercent);
  const lastSavedFontRef = useRef(initialFontSizePx);

  // ─── Restore scroll position on mount ───────────────────
  useEffect(() => {
    if (hasRestoredPositionRef.current) return;
    if (initialScrollPercent <= 0) {
      hasRestoredPositionRef.current = true;
      return;
    }

    // Wait for content to be fully rendered + fonts loaded
    const restoreScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = (initialScrollPercent / 100) * docHeight;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      hasRestoredPositionRef.current = true;
    };

    // Wait for fonts then restore
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(restoreScroll, 50);
      });
    } else {
      setTimeout(restoreScroll, 200);
    }
  }, [initialScrollPercent]);

  // ─── Silent autosave (every 3 seconds) ──────────────────
  const saveReadingPosition = useCallback(async () => {
    if (!hasRestoredPositionRef.current) return; // Don't save before restore

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0
      ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100))
      : 0;

    // Only save if changed meaningfully
    const scrollChanged = Math.abs(scrollPercent - lastSavedScrollRef.current) > 0.5;
    const fontChanged = fontSizePx !== lastSavedFontRef.current;

    if (!scrollChanged && !fontChanged) return;

    try {
      await fetch('/api/reading-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episode_id: episodeId,
          scroll_percent: Number(scrollPercent.toFixed(2)),
          font_size_px: fontSizePx,
        }),
      });
      lastSavedScrollRef.current = scrollPercent;
      lastSavedFontRef.current = fontSizePx;
    } catch {
      // Silent failure - user experience is uninterrupted
    }
  }, [episodeId, fontSizePx]);

  useEffect(() => {
    const interval = setInterval(saveReadingPosition, AUTOSAVE_INTERVAL_MS);

    // Also save on page hide (best-effort flush)
    const handleHide = () => {
      saveReadingPosition();
    };
    window.addEventListener('beforeunload', handleHide);
    window.addEventListener('pagehide', handleHide);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleHide);
      window.removeEventListener('pagehide', handleHide);
    };
  }, [saveReadingPosition]);

  // ─── Font size controls ─────────────────────────────────
  const zoomIn = () => {
    setFontSizePx((px) => Math.min(MAX_FONT_SIZE, px + FONT_STEP));
  };
  const zoomOut = () => {
    setFontSizePx((px) => Math.max(MIN_FONT_SIZE, px - FONT_STEP));
  };
  const close = () => {
    saveReadingPosition().then(() => router.push('/library'));
  };

  return (
    <>
      {/* ─── ZERO-CHROME FLOATING CONTROLS ─── */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={zoomOut}
          aria-label="Decrease text size"
          disabled={fontSizePx <= MIN_FONT_SIZE}
          className="w-10 h-10 rounded-full bg-white border border-gold/30 text-plum hover:bg-light transition disabled:opacity-30 flex items-center justify-center shadow-sm"
        >
          <span className="text-lg font-light">−</span>
        </button>
        <button
          onClick={zoomIn}
          aria-label="Increase text size"
          disabled={fontSizePx >= MAX_FONT_SIZE}
          className="w-10 h-10 rounded-full bg-white border border-gold/30 text-plum hover:bg-light transition disabled:opacity-30 flex items-center justify-center shadow-sm"
        >
          <span className="text-lg font-light">+</span>
        </button>
        <button
          onClick={close}
          aria-label="Close and return to library"
          className="w-10 h-10 rounded-full bg-white border border-gold/30 text-plum hover:bg-light transition flex items-center justify-center shadow-sm ml-1"
        >
          <span className="text-lg font-light">✕</span>
        </button>
      </div>

      {/* ─── EPISODE CONTENT ─── */}
      {/* The htmlContent contains full <html> structure from the locked
          episode files. We render it via iframe-style technique using
          dangerouslySetInnerHTML, but the episode's own <style> tags
          inside the HTML provide the typography and layout. */}
      <div
        ref={contentRef}
        className="reader-root"
        style={{ fontSize: `${fontSizePx}px` }}
        dangerouslySetInnerHTML={{ __html: extractBody(htmlContent) }}
      />
    </>
  );
}

// ─── Helper: extract <body> + <style> from full HTML doc ────
// The locked episode files are full HTML documents. We extract
// the <style> tags and the <body> contents so they render
// correctly inside the Next.js page.
function extractBody(fullHtml: string): string {
  // Get <style> blocks
  const styleMatches = fullHtml.match(/<style[\s\S]*?<\/style>/gi) || [];
  const styles = styleMatches.join('\n');

  // Get <body> contents
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : fullHtml;

  return `${styles}\n${body}`;
}
