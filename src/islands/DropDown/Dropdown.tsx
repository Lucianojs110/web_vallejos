"use client";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import ChevronDownIcon from "../../icons/ChevronDownIcon"; // Importar tu icono personalizado

export default function SelectDropDownMenu({
  optionSelected,
  setOptionSelected,
  options,
  className, // Agregar `className` aquí
}: {
  optionSelected: string;
  setOptionSelected: Function;
  options: string[];
  className?: string; // Hacer `className` opcional
}) {
  // Mostrar "Seleccione la localidad" si no hay ninguna opción seleccionada
  const displayText = optionSelected || "Seleccione la localidad";

  return (
    <Dropdown>
      <DropdownTrigger>
      <Button variant="bordered" className={`${className} text-xl`}>
          {/* Mostrar el texto seleccionado o el placeholder */}
          {displayText}
          {/* Agregar tu ícono personalizado */}
          <ChevronDownIcon style={{ marginLeft: "12px" }} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" className={className}>
        {/* Mapeo de las opciones, excluyendo la opción del placeholder */}
        {options
          .filter((option) => option !== "Seleccione la localidad")
          .map((option) => (
            <DropdownItem
              key={option}
              onClick={() => setOptionSelected(option)}
              className={className}
            >
              {option}
            </DropdownItem>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
}
