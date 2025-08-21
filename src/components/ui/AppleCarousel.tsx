'use client'

import React, { useState, useRef, useEffect } from 'react'

interface CarouselCard {
  id: number
  title: string
  description: string
  image: string
  category: string
}

interface AppleCarouselProps {
  cards: CarouselCard[]
}

export function AppleCarousel({ cards }: AppleCarouselProps) {
  const [activeCard, setActiveCard] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft
      const cardWidth = 350 // Width of each card + gap
      const newActiveCard = Math.round(scrollLeft / cardWidth)
      setActiveCard(newActiveCard)
    }
  }

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 350
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      })
      setActiveCard(index)
    }
  }

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1200px', 
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px' 
      }}>
        <h3 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          marginBottom: '16px',
          color: '#ffffff'
        }}>
          Proven Ad Templates That Convert
        </h3>
        <p style={{
          fontSize: '1.1rem',
          color: '#a0a9c0',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          See the exact ad templates that have generated thousands of leads for window and door contractors
        </p>
      </div>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '20px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' },
          padding: '0 20px'
        }}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            style={{
              minWidth: '330px',
              height: '460px',
              scrollSnapAlign: 'start',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: activeCard === index ? 'scale(1.02)' : 'scale(1)',
              opacity: activeCard === index ? 1 : 0.7,
              boxShadow: activeCard === index ? 
                '0 20px 40px rgba(0, 0, 0, 0.3)' : 
                '0 10px 20px rgba(0, 0, 0, 0.1)'
            }}
            onClick={() => scrollToCard(index)}
          >
            {/* Category Badge */}
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700
            }}>
              {card.category}
            </div>

            {/* Mock Ad Image */}
            <div style={{
              width: '100%',
              height: '280px',
              background: card.image,
              borderRadius: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Overlay for better text readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px'
              }} />
              <span style={{ 
                position: 'relative', 
                zIndex: 1,
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))'
              }}>
                🏠
              </span>
            </div>

            {/* Content */}
            <div>
              <h4 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                marginBottom: '12px',
                color: '#ffffff',
                lineHeight: 1.3
              }}>
                {card.title}
              </h4>
              <p style={{
                fontSize: '0.95rem',
                color: '#cbd5e1',
                lineHeight: 1.5,
                margin: 0
              }}>
                {card.description}
              </p>
            </div>

            {/* Hover Effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, transparent 100%)',
              opacity: activeCard === index ? 1 : 0,
              transition: 'opacity 0.3s ease',
              borderRadius: '20px',
              pointerEvents: 'none'
            }} />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '30px'
      }}>
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: activeCard === index ? 
                'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' : 
                'rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: activeCard === index ? 'scale(1.2)' : 'scale(1)'
            }}
          />
        ))}
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default AppleCarousel