import React, { useState, useEffect } from 'react';

export default function AccountIcon({ onPress }: { onPress: () => void }) {
  const [isMobile, setIsMobile] = useState(false);

  // useEffect para detectar el tamaño de la pantalla
  useEffect(() => {
    // Función para verificar si es móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // < 768px se considera móvil
    };

    // Verifica el tamaño al cargar la página
    checkMobile();

    // Agrega un listener para cambios en el tamaño de la ventana
    window.addEventListener('resize', checkMobile);

    // Limpia el listener al desmontar el componente
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      onClick={onPress}
      
    >
      {isMobile ? (
        // Renderiza esto si es móvil
        <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-[rgb(153,153,153)]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        </div>
        
      ) : (
        // Renderiza esto si es desktop
        <>
        <div className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-orange-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span className="text-gray-700 font-semibold">MI CUENTA</span>
          </div>
        </>
       
      )}
    </div>
  );
}
