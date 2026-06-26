import React, { useEffect, useState, useRef } from 'react';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const ACCENT_COLORS = [
  { glow: 'rgba(171, 139, 255, 0.35)', border: 'rgba(171, 139, 255, 0.4)' },
  { glow: 'rgba(94, 154, 255, 0.35)', border: 'rgba(94, 154, 255, 0.4)' },
  { glow: 'rgba(94, 255, 213, 0.25)', border: 'rgba(94, 255, 213, 0.35)' },
];

const MovieCard = ({ movie, index = 0 }) => {
  const [rating, setRating] = useState(null);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
        );
        const data = await response.json();
        setRating(data.imdbRating || 'N/A');
      } catch (error) {
        console.log('Error fetching rating:', error);
        setRating('N/A');
      }
    };

    fetchRating();
  }, [movie.imdbID]);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className="movie-card-tilt"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.x || tilt.y ? 1.03 : 1})`,
        boxShadow: tilt.x || tilt.y ? `0 20px 40px -10px ${accent.glow}` : 'none',
        borderColor: tilt.x || tilt.y ? accent.border : 'transparent',
      }}
    >
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : '/no-image.jpg'}
        alt={movie.Title}
      />

      <h3>{movie.Title}</h3>

      <div className="content">
        <div className="rating">
          <img src="/star.png" alt="Star" />
          <p>{rating ? rating : '...'}</p>
        </div>

        <span>•</span>

        <p className="lang">{movie.Type}</p>

        <span>•</span>

        <p className="year">{movie.Year}</p>
      </div>
    </div>
  );
};

export default MovieCard;