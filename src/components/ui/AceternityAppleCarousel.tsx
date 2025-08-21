"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const AceternityCarousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384;
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        <div
          ref={carouselRef}
          onScroll={checkScrollability}
          style={{
            display: 'flex',
            width: '100%',
            overflowX: 'scroll',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: '8px',
            paddingBottom: '14px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', paddingLeft: '8px' }}>
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.1 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                style={{ scrollSnapAlign: 'start' }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'end', gap: '8px', marginRight: '8px' }}>
          <button
            style={{
              position: 'relative',
              zIndex: 40,
              height: '40px',
              width: '40px',
              borderRadius: '50%',
              backgroundColor: '#1a1f3a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: canScrollLeft ? 'pointer' : 'not-allowed',
              opacity: canScrollLeft ? 1 : 0.5
            }}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft size={20} color="#ffffff" />
          </button>
          <button
            style={{
              position: 'relative',
              zIndex: 40,
              height: '40px',
              width: '40px',
              borderRadius: '50%',
              backgroundColor: '#1a1f3a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: canScrollRight ? 'pointer' : 'not-allowed',
              opacity: canScrollRight ? 1 : 0.5
            }}
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight size={20} color="#ffffff" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const AceternityCard = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose, currentIndex } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div style={{ position: 'fixed', inset: 0, height: '100vh', zIndex: 50, overflow: 'auto' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
                position: 'fixed',
                inset: 0,
                zIndex: 50
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              style={{
                maxWidth: '1024px',
                margin: '0 auto',
                backgroundColor: '#1a1f3a',
                height: 'fit-content',
                padding: '16px',
                position: 'relative',
                borderRadius: '20px',
                marginTop: '40px',
                marginBottom: '40px',
                overflow: 'hidden'
              }}
            >
              <button
                style={{
                  position: 'sticky',
                  top: '4px',
                  marginLeft: 'auto',
                  backgroundColor: '#0a0e27',
                  borderRadius: '50%',
                  height: '32px',
                  width: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 60
                }}
                onClick={handleClose}
              >
                <IconX size={20} color="#ffffff" />
              </button>
              <motion.div
                layoutId={layout ? `title-${card.title}` : undefined}
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '16px'
                }}
              >
                {card.title}
              </motion.div>
              <motion.div
                layoutId={layout ? `category-${card.category}` : undefined}
                style={{
                  fontSize: '14px',
                  color: '#ff6b6b',
                  marginBottom: '16px'
                }}
              >
                {card.category}
              </motion.div>
              <motion.div
                layoutId={layout ? `content-${card.title}` : undefined}
                style={{ color: '#a0a9c0', lineHeight: 1.6 }}
              >
                {card.content}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        style={{
          borderRadius: '12px',
          backgroundColor: '#1a1f3a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          width: '384px',
          height: '384px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          justifyContent: 'start',
          position: 'relative',
          cursor: 'pointer',
          padding: 0
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${card.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(0.5px)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(26, 31, 58, 0.8) 100%)'
          }}
        />
        <div style={{ position: 'relative', zIndex: 20, padding: '16px' }}>
          <motion.div
            layoutId={layout ? `category-${card.category}` : undefined}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#ff6b6b',
              marginBottom: '8px'
            }}
          >
            {card.category}
          </motion.div>
          <motion.div
            layoutId={layout ? `title-${card.title}` : undefined}
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2
            }}
          >
            {card.title}
          </motion.div>
        </div>
      </motion.button>
    </>
  );
};