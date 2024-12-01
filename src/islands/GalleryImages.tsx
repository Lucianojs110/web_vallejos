import React from "react";

const GalleryImages = ({ images = [] }: { images: string[] }) => {
  return (
    <div className={`flex flex-row md:flex-col gap-2 md:gap-4 `}>
      {images &&
        images.map((image) => (
          <img
            key={image}
            className={`w-20 h-auto object-cover hover:opacity-50 cursor-pointer border p-1`}
            src={image}
            alt="Imagen del producto"
            onClick={() => {
              const imagePreview = document.getElementById("image-preview");
              if (imagePreview) {
                imagePreview.setAttribute("src", image);
              }
            }}
            width="40"
            height="40"
          />
        ))}
    </div>
  );
};

export default GalleryImages;
