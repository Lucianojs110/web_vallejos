import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay } from 'swiper/modules';
import './BrandCarousel.css';

const BrandCarousel = () => {
  // Lista de marcas con sus logotipos
  const brands = [
    { image: '/images/brand1.webp', alt: 'Marca 1' },
    { image: '/images/brand2.webp', alt: 'Marca 2' },
    { image: '/images/brand3.webp', alt: 'Marca 3' },
    { image: '/images/brand4.webp', alt: 'Marca 4' },
    { image: '/images/brand5.webp', alt: 'Marca 5' },
    { image: '/images/brand6.webp', alt: 'Marca 6' },
    // Añade más marcas aquí
  ];

  const swiperConfig = {
    modules: [Autoplay],
    slidesPerView: 4, // Configuración para pantallas grandes
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 10 }, // 1 logo en pantallas pequeñas
      480: { slidesPerView: 2, spaceBetween: 15 }, // 2 logos en pantallas un poco más grandes
      768: { slidesPerView: 3, spaceBetween: 20 }, // 3 logos en pantallas medianas
      1024: { slidesPerView: 4, spaceBetween: 30 }, // 4 logos en pantallas grandes
    },
  };
  

  return (
    <div className="brand-carousel-container">
      <Swiper {...swiperConfig}>
        {brands.map((brand, index) => (
          <SwiperSlide key={index}>
            <img src={brand.image} alt={brand.alt} className="brand-logo" loading="lazy" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BrandCarousel;
