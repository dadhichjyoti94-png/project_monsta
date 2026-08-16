'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const SlickSlider = dynamic(() => import("react-slick"), {
  ssr: false,
});

const slides = [
  {
    src: "/image/slider1.jpg",
    alt: "Banner 1",
  },
  {
    src: "/image/slider2.jpg",
    alt: "Banner 2",
  },
  {
    src: "/image/slider3.jpg",
    alt: "Banner 3",
  },
];

export default function Slider() {

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    speed: 800,
    pauseOnHover: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      {/* Banner Section */}

      <div className="relative w-full">
        <SlickSlider {...settings}>
          {slides.map((slide, index) => (
            <div key={index}>
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-[260px] sm:h-[380px] lg:h-[520px] object-cover"
              />
            </div>
          ))}
        </SlickSlider>
      </div>

      {/* Chair Section */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-5 px-5 py-10 border-b border-gray-200">

        <div className="w-full max-w-[350px] mx-auto relative overflow-hidden">
          <img
            src="/image/chair1.webp"
            className="w-full transition duration-500 hover:scale-110"
          />
          <div className="absolute top-6 left-6">
            <p className="text-[15px]">Design Creative</p>
            <h2 className="text-[22px] font-semibold">
              Chair Collection
            </h2>
          </div>
        </div>

        <div className="w-full max-w-[350px] mx-auto relative overflow-hidden">
          <img
            src="/image/chair2.webp"
            className="w-full transition duration-500 hover:scale-110"
          />
          <div className="absolute top-6 left-6">
            <p className="text-[15px]">Bestselling Products</p>
            <h2 className="text-[22px] font-semibold">
              Chair Collection
            </h2>
          </div>
        </div>

        <div className="w-full max-w-[350px] mx-auto relative overflow-hidden">
          <img
            src="/image/chair3.webp"
            className="w-full transition duration-500 hover:scale-110"
          />
          <div className="absolute top-6 left-6">
            <p className="text-[15px]">Onsale Products</p>
            <h2 className="text-[22px] font-semibold">
              Chair Collection
            </h2>
          </div>
        </div>

      </div>
    </>
  );
}
