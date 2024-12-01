import React from "react";
import NextButton from "./NextButton";

import { getContribuyente } from "../../services";

const ContactInformation = () => {
  const user: any = {};

  const [tipoIVA, setTipoIVA] = React.useState(user?.userData?.tipoIVA || "C");
  const [loading, setLoading] = React.useState(false);

  const [contribuyente, setContribuyente] = React.useState({
    name: user?.userData?.name || "",
    typeContribution: user?.userData?.tipoIVA || "C",
  });

  return (
    <>
      <div>
        <div className="flex gap-10 justify-center">
          <div
            className="inline-flex items-center cursor-pointer"
            onClick={() => setTipoIVA("C")}
          >
            <label
              className="relative flex cursor-pointer items-center rounded-full p-3"
              htmlFor="consumidorFinal"
              data-ripple-dark="true"
            >
              <input
                id="consumidorFinal"
                name="typeDocument"
                type="radio"
                checked={tipoIVA === "C"}
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-yellow-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-yellow-500 checked:before:bg-yellow-500 hover:before:opacity-10"
              />
              <div
                className={`pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-yellow-500  transition-opacity ${
                  tipoIVA === "C" ? "opacity-100" : "opacity-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                </svg>
              </div>
            </label>
            <label
              className="mt-px cursor-pointer select-none font-light text-gray-700"
              htmlFor="consumidorFinal"
            >
              Consumidor Final
            </label>
          </div>
          <div
            className="inline-flex items-center cursor-pointer"
            onClick={() => setTipoIVA("R")}
          >
            <label
              className="relative flex cursor-pointer items-center rounded-full p-3"
              htmlFor="ingresaCuit"
              data-ripple-dark="true"
            >
              <input
                id="ingresaCuit"
                name="typeDocument"
                type="radio"
                checked={tipoIVA !== "C"}
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-yellow-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-yellow-500 checked:before:bg-yellow-500 hover:before:opacity-10"
              />
              <div
                className={`pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-yellow-500  transition-opacity ${
                  tipoIVA !== "C" ? "opacity-100" : "opacity-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                </svg>
              </div>
            </label>
            <label
              className="mt-px cursor-pointer select-none font-light text-gray-700"
              htmlFor="ingresaCuit"
            >
              Ingresar CUIT
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {tipoIVA !== "C" && (
          <div>
            <span>CUIT: </span>
            <input
              id="nameReceiver"
              type="text"
              maxLength={300}
              defaultValue={user.userData?.documento}
              className={`border-2 border-gray-300 rounded-md p-2 w-full`}
              onChange={async (e) => {
                if (e.target.value.length === 11) {
                  setLoading(true);
                  getContribuyente(e.target.value)
                    .then((res) => {
                      setContribuyente(res);
                      setLoading(false);
                    })
                    .catch((err) => {
                      setLoading(false);
                    });
                }
              }}
            />
          </div>
        )}

        <div>
          <span>Nombre:</span>
          <input
            id="nameReceiver"
            type="text"
            maxLength={300}
            className={`border-2 border-gray-300 rounded-md p-2 w-full`}
            value={contribuyente.name}
            onChange={(e) => {
              setContribuyente({ ...contribuyente, name: e.target.value });
            }}
            disabled={loading}
          />
        </div>
        <div>
          <span>Celular:</span>
          <input
            id="phoneReceiver"
            type="text"
            maxLength={300}
            className={`border-2 border-gray-300 rounded-md p-2 w-full`}
          />
        </div>
      </div>
      <div style={{ height: "20px" }}></div>
      <NextButton step={4} onClick={() => {}} />
    </>
  );
};

export default ContactInformation;
