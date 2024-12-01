import { makeStore, useStore } from "statery";

export enum CalculatorSteps {
  INITIAL = "initial",
  SIZED_SETED = "sized_seted",
}

export interface IStructure {
  name: string;
  category: string;
  width: number;
  height: number;
  products: any[];
}

export interface ICalculatorStore {
  structureCurrent: any;
  width: number;
  height: number;
  step: CalculatorSteps;
  structures: IStructure[];
}

const initStore: ICalculatorStore = {
  step: CalculatorSteps.INITIAL,
  structures: [],
  structureCurrent: null,
  width: 0,
  height: 0,
};

export const store = makeStore(initStore);

export const state = () => useStore(store);

export const setCalculatorStep = (step: CalculatorSteps) => {
  store.set((state: ICalculatorStore) => {
    return { ...state, step };
  });
};

export const getCalculatorStep = () => {
  const data: ICalculatorStore = state();
  return data.step;
};

export const addStructure = (structure: IStructure) => {
  const structures = [...state().structures, structure];
  store.set((state) => {
    return { ...state, structures };
  });
};

export const removeStructure = (structure: IStructure) => {
  const structures = state().structures.filter(
    (item) => item.name !== structure.name
  );
  store.set((state) => {
    return { ...state, structures };
  });
};

export const getStructures = () => {
  const data: ICalculatorStore = state();
  return data.structures;
};

export const setStructureCurrent = (structure: any) => {
  store.set((state) => {
    return { ...state, structureCurrent: structure };
  });
};

export const getStructureCurrent = () => {
  const data: ICalculatorStore = state();
  return data.structureCurrent;
};

export const setWidth = (width: number) => {
  store.set((state) => {
    return { ...state, width };
  });
};

export const getWidth = () => {
  const data: ICalculatorStore = state();
  return data.width;
};

export const setHeight = (height: number) => {
  store.set((state) => {
    return { ...state, height };
  });
};

export const getHeight = () => {
  const data: ICalculatorStore = state();
  return data.height;
};
