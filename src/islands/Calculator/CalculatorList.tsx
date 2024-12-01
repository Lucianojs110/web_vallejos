import React from "react";

export default function CalculatorList({
  calculatorList,
  selectStructure,
}: any) {
  return (
    <div className="bg-white w-[100%]">
      <h3 className="text-center">Estructuras</h3>
      <div
        className="grid md:grid-cols-2 gap-2 mb-6 mt-1 md:p-2 w-[100%] sm:w-5/6 lg:w-5/6 xl:w-4/6 justify-center items-center"
        style={{ margin: "0 auto" }}
      >
        {calculatorList.map((structure: any) => (
          <div
            key={structure.id}
            className={`bg-white shadow-md flex hover:shadow-lg rounded-md md:h-[130px] hover:cursor-pointer md:p-2 p-1 w-[100%]`}
            onClick={() => selectStructure(structure.id)}
          >
            <div className="md:w-[220px] flex-[0.5]">
              <img
                src={structure.imageUrl}
                width="100%"
                height="100%"
                className="h-[120px] md:w-[220px] object-cover hover:opacity-80 rounded-l-md flex"
              />
            </div>
            <div className="p-2 flex flex-1 flex-col justify-between">
              <div className="flex flex-col">
                <p className="text-base md:text-md">{structure.name}</p>
                <p className="text-xs">{structure.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
