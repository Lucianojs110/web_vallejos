import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import './BannerCarousel.css';

const BannerCarousel = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Comprobar el tamaño inicial
    window.addEventListener('resize', handleResize); // Escuchar cambios de tamaño

    return () => {
      window.removeEventListener('resize', handleResize); // Limpiar el evento al desmontar
    };
  }, []);

  const banners = isMobile
    ? [
        { image: '/images/bannerMovil.webp', alt: 'Banner 1', link: '/promo-1' },
        { image: '/images/bannerMovil2.webp', alt: 'Banner 2', link: '/promo-2' },
      ]
    : [
        { image: '/images/banner.webp', alt: 'Banner 1', link: '/promo-1' },
        { image: '/images/banner2.webp', alt: 'Banner 2', link: '/promo-2' },
      ];

  const swiperConfig = {
    modules: [Autoplay, Navigation, Pagination],
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
    },
    navigation: {
      nextEl: '.custom-next',
      prevEl: '.custom-prev',
    },
  };

  return (
    <div className="carousel-container">
      <Swiper {...swiperConfig}>
        {banners.map((banner) => (
          <SwiperSlide key={banner.image}>
            <a href={banner.link}>
              <img src={banner.image} alt={banner.alt} loading="lazy" />
            </a>
          </SwiperSlide>
        ))}
        {/* Flechas personalizadas */}
        <div className="custom-prev" style={{ cursor: 'pointer', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
        <div className="custom-next" style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      </Swiper>
    </div>
  );
};

export default BannerCarousel;
