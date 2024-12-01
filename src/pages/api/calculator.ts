import type { APIRoute } from "astro";
import {
  getAccesoriesProducts,
  getPvcProducts,
  getQuantitiesProducts,
  getStructuresList,
} from "../../services/calculator.services";
import type { IProductCatalogResponse as Product } from "../../types/ICatalog";
import type {
  ProductList,
  PvcType,
  StructureOption,
} from "../../types/structureOption";
import type { QuantityRequest } from "../../types/quantityRequest";
import type { IAccesory } from "../../types/accesories";
import {
  CALCULATOR_CART,
  CALCULATOR_STEP,
  CALCULATOR_ACTIONS,
} from "../../config/constants";
import { v4 as uuid } from "uuid";
import { getProductsByCodes } from "../../services";

let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

let pvcProducts = [] as Product[];

let accesories = [] as IAccesory[];

let memoryStore: any = {};

let structures = {
  list: [] as StructureOption[],
  ttl: new Date().getTime(),
};

let products: Product[] = [];

const init = async () => {
  await getAccesories();
  await getPvc();

  const structureList = await getStructuresList();
  structures.list = structureList;
  structures.ttl = new Date().getTime() + 1000 * 60 * 60 * 2;

  await getProductList(structureList);

  // update productsOptions in structures.list when product code in productsOptions not exist in products
  structures.list = structures.list.map((structure) => {
    return {
      ...structure,
      productList: structure.productList.map((productList) => {
        return {
          ...productList,
          productsOptions: productList.productsOptions.filter((po) =>
            products.some((p) => p.code === po.code)
          ),
        };
      }),
    };
  });

  // update productList.select with first product code in productsOptions if productList.productOptions.length === 1 || productList.calc === 'tornillos' || productList.calc === 'tarugos' || productList.calc === 'masilla' || productList.calc === 'cinta'
  structures.list = structures.list.map((structure) => {
    return {
      ...structure,
      productList: structure.productList.map((productList) => {
        if (
          productList.productsOptions.length === 1 ||
          productList.calc === "tornillos" ||
          productList.calc === "tarugos" ||
          productList.calc === "masilla" ||
          productList.calc === "cinta"
        ) {
          return {
            ...productList,
            select: productList.productsOptions[0].code,
          };
        } else {
          return productList;
        }
      }),
    };
  });
};

const getPvc = async () => {
  pvcProducts = await getPvcProducts();
};

const getAccesories = async () => {
  accesories = await getAccesoriesProducts();
};

const getProductList = async (structureList: StructureOption[]) => {
  const codes = structureList
    .map((structure) =>
      structure.productList
        .map((pl) => pl.productsOptions.map((po) => po.code))
        .flat()
    )
    .flat();

  const response = await getProductsByCodes(codes);
  products = response;
};

init();

const calculatorInit = {
  cintaId: null,
  masillaId: null,
  step: CALCULATOR_STEP.STRUCTURES_SCREEN,
};

export const GET: APIRoute = async ({ cookies }) => {
  if (structures.ttl < new Date().getTime() || structures.list.length === 0) {
    await init();
  }

  const calculatorCartCookie = cookies.get(CALCULATOR_CART) || null;

  let calculatorCart = uuid();

  if (!calculatorCartCookie?.value) {
    cookies.set(CALCULATOR_CART, calculatorCart);
  } else {
    calculatorCart = calculatorCartCookie.value;
  }

  if (!memoryStore[calculatorCart]) {
    memoryStore[calculatorCart] = { ...calculatorInit };
    memoryStore[calculatorCart].structureList = []; // reset structureList
  }

  const { productList, totalPrice } = await getProductsAndTotalPrice(
    calculatorCart
  );
  const res = {
    ...memoryStore[calculatorCart],
    structures: structures.list,
    productList,
    totalPrice,
    calculatorCartId: calculatorCart,
  };

  return Response.json(res, { status: 200 });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (structures.ttl < new Date().getTime() || structures.list.length === 0) {
    await init();
  }

  const calculatorCartCookie = cookies.get(CALCULATOR_CART) || null;

  let calculatorCart = uuid();

  if (!calculatorCartCookie?.value) {
    cookies.set(CALCULATOR_CART, calculatorCart);
  } else {
    calculatorCart = calculatorCartCookie.value;
  }

  if (!memoryStore[calculatorCart]) {
    memoryStore[calculatorCart] = { ...calculatorInit };
  }

  const { step, action, data } = await request.json();

  if (
    action === CALCULATOR_ACTIONS.ADD_STRUCTURE &&
    step === CALCULATOR_STEP.STRUCTURES_SCREEN
  ) {
    const structSelected = structures.list.find(
      (struct) => struct.id === data.structure_id
    ) as StructureOption;

    let getProductList = [] as (ProductList | PvcType)[];

    // verificar si structSelected categoria es === cielorrasos-pvc

    if (structSelected.category === "cielorrasos-pvc") {
      getProductList.push({
        type: "pvc",
        deep: 0,
        width: 0,
        color: null,
        molduraId: null,
      });
    }

    // getProductList push ...structSelected.productList
    getProductList.push(...structSelected.productList);

    memoryStore[calculatorCart].currentStructure = {
      structure_id: data.structure_id,
      structure_name: structSelected.name,
      img: structSelected.imageUrl,
      getProductList,
    };

    const pvcStructure = memoryStore[
      calculatorCart
    ].currentStructure.getProductList.find((pl: any) => pl.type === "pvc");

    if (pvcStructure) {
      // get diferents colors of pvcProducts
      const colors = pvcProducts
        .filter((p) => p.isPlacaPvc)
        .map((p) => p.colorDetail)
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v.id === value.id) === index
        );

      return Response.json(
        {
          step: CALCULATOR_STEP.STRUCTURES_SCREEN,
          action: CALCULATOR_ACTIONS.SELECT_COLOR,
          colors: colors.map((c) => {
            return {
              id: `color-${c.id}`,
              title: c.name,
              hex: c.hex,
            };
          }),
        },
        { status: 200 }
      );
    } else {
      if (
        memoryStore[calculatorCart].currentStructure.getProductList.some(
          (pl: ProductList) => pl.calc === "masilla" || pl.calc === "cinta"
        ) &&
        (!memoryStore[calculatorCart].cintaId ||
          !memoryStore[calculatorCart].masillaId)
      ) {
        // primero verificar masillaId === null
        if (!memoryStore[calculatorCart].masillaId) {
          // buscar en accesories la masilla
          const masillas = accesories.filter(
            (a) => a.tipo === "masilla"
          ) as IAccesory[];

          return Response.json(
            {
              step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
              action: CALCULATOR_ACTIONS.SELECT_MASILLA,
              data: {
                productList: masillas.map((a) => ({
                  id: a.id,
                  title: a.nombre,
                })),
              },
            },
            { status: 200 }
          );
        } else {
          // buscar en accesories las cinta
          const cintas = accesories.filter(
            (a) => a.tipo === "cinta"
          ) as IAccesory[];

          return Response.json(
            {
              step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
              action: CALCULATOR_ACTIONS.SELECT_CINTA,
              data: {
                productList: cintas.map((a) => ({
                  id: a.id,
                  title: a.nombre,
                })),
              },
            },
            { status: 200 }
          );
        }
      } else {
        // verificar si alguno de los productList tiene un productsOptions con mas de un producto

        const productList = memoryStore[
          calculatorCart
        ].currentStructure.getProductList.filter(
          (pl: ProductList) => pl?.productsOptions?.length > 1 && !pl?.select
        ) as ProductList[];

        if (productList.length === 0) {
          return Response.json(
            {
              step: CALCULATOR_STEP.DIMENSIONS_SCREEN,
              action: CALCULATOR_ACTIONS.SET_DIMENSIONS,
              data: {
                structure_id: data.structure_id,
                structure_name: structSelected.name,
                img: structSelected.imageUrl,
              },
            },
            { status: 200 }
          );
        } else {
          // find first product with more than one option and select is null
          return Response.json(
            {
              step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
              action: CALCULATOR_ACTIONS.ADD_MULTIPLE_PRODUCT,
              data: {
                productList: productList.map((pl) => {
                  // return product
                  return {
                    productsOptions: pl.productsOptions.map(
                      (po) =>
                        products.find((p) => p.code === po.code) as Product
                    ),
                  };
                }),
              },
            },
            { status: 200 }
          );
        }
      }
    }
  }

  if (
    action === CALCULATOR_ACTIONS.ADD_PRODUCT &&
    step === CALCULATOR_STEP.SELECT_PRODUCT_SCREEN
  ) {
    let pvcStructure = memoryStore[
      calculatorCart
    ].currentStructure.getProductList.find((pl: any) => pl.type === "pvc");

    if (pvcStructure) {
      if (data.product_id.includes("color-")) {
        const newPvcStructure = {
          ...memoryStore[calculatorCart].currentStructure.getProductList[0],
          color: data.product_id.replace("color-", ""),
        };

        memoryStore[calculatorCart].currentStructure.getProductList =
          memoryStore[calculatorCart].currentStructure.getProductList.map(
            (pl: any) => {
              if (pl.type === "pvc") {
                return newPvcStructure;
              } else {
                return pl;
              }
            }
          );

        // get products of pvcProducts with colorDetail.id === data.product_id
        const pvcProductsFiltered = pvcProducts.filter(
          (p) => p.colorDetail.id === data.product_id.replace("color-", "")
        );

        // get diferentes width of pvcProductsFiltered
        const widths = pvcProductsFiltered
          .filter((p) => p.isPlacaPvc)
          .map((p) => p.width)
          .filter(
            (value, index, self) => self.findIndex((v) => v === value) === index
          );
        if (widths.length === 1) {
          data.product_id = `width-${widths[0].toString()}`;
        } else {
          return Response.json(
            {
              step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
              action: CALCULATOR_ACTIONS.SELECT_WIDTH,
              data: {
                productList: widths.map((p) => ({
                  id: `width-${p.toString()}`,
                  title: `${(p * 100).toString()} cms de Ancho`,
                })),
              },
            },
            { status: 200 }
          );
        }
      }

      if (data.product_id.includes("width-")) {
        const newPvcStructure = {
          ...memoryStore[calculatorCart].currentStructure.getProductList[0],
          width: Number(data.product_id.replace("width-", "")),
        };
        memoryStore[calculatorCart].currentStructure.getProductList =
          memoryStore[calculatorCart].currentStructure.getProductList.map(
            (pl: any) => {
              if (pl.type === "pvc") {
                return newPvcStructure;
              } else {
                return pl;
              }
            }
          );

        // get products of pvcProducts with colorDetail.id === pvcStructure.color and width === data.product_id
        const pvcProductsFiltered = pvcProducts.filter(
          (p) =>
            p.isPlacaPvc &&
            p.colorDetail.id === newPvcStructure.color &&
            p.width === Number(data.product_id.replace("width-", ""))
        );
        // get diferentes deeps of pvcProductsFiltered
        const deeps = pvcProductsFiltered
          .map((p) => p.deep)
          .filter(
            (value, index, self) => self.findIndex((v) => v === value) === index
          );

        if (deeps.length === 1) {
          data.product_id = `deep-${deeps[0].toString()}`;
        } else {
          return Response.json(
            {
              step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
              action: CALCULATOR_ACTIONS.SELECT_DEEP,
              data: {
                productList: deeps.map((p) => ({
                  id: `deep-${p.toString()}`,
                  title: `${p.toString()} mm de espesor`,
                })),
              },
            },
            { status: 200 }
          );
        }
      }

      if (data.product_id.includes("deep-")) {
        const newPvcStructure = {
          ...memoryStore[calculatorCart].currentStructure.getProductList[0],
          deep: Number(data.product_id.replace("deep-", "")),
        };

        memoryStore[calculatorCart].currentStructure.getProductList =
          memoryStore[calculatorCart].currentStructure.getProductList.map(
            (pl: any) => {
              if (pl.type === "pvc") {
                return newPvcStructure;
              } else {
                return pl;
              }
            }
          );

        // get diferentes molduraId of pvcProductsFiltered
        const molduras = pvcProducts.filter(
          (p) =>
            p.isMolduraPvc &&
            p.deep === Number(data.product_id.replace("deep-", ""))
        );

        if (molduras.length === 1) {
          data.product_id = `moldura-${molduras[0].code}`;
        } else if (molduras.length > 0) {
          return Response.json(
            {
              step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
              action: CALCULATOR_ACTIONS.SELECT_MOLDURA,
              data: {
                productList: molduras.map((p) => ({
                  id: `moldura-${p.code}`,
                  name: p.name,
                  code: p.code,
                  mainImage: p.mainImage,
                  priceWithIvaAndDiscount: `${USDollar.format(
                    p.priceDifferenceWithIvaAndDiscount
                  )}`,
                })),
              },
            },
            { status: 200 }
          );
        }
      }

      if (data.product_id.includes("moldura-")) {
        const newPvcStructure = {
          ...memoryStore[calculatorCart].currentStructure.getProductList[0],
          molduraId: data.product_id.replace("moldura-", ""),
        };

        memoryStore[calculatorCart].currentStructure.getProductList =
          memoryStore[calculatorCart].currentStructure.getProductList.map(
            (pl: any) => {
              if (pl.type === "pvc") {
                return newPvcStructure;
              } else {
                return pl;
              }
            }
          );

        const productList = memoryStore[
          calculatorCart
        ].currentStructure.getProductList.filter(
          (pl: ProductList) => pl?.productsOptions?.length > 1 && !pl?.select
        ) as ProductList[];

        if (productList.length > 0) {
          // find first product with more than one option and select is null
          return Response.json(
            {
              step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
              action: CALCULATOR_ACTIONS.ADD_MULTIPLE_PRODUCT,
              data: {
                productList: productList.map((pl) => {
                  // return product
                  return {
                    productsOptions: pl.productsOptions.map(
                      (po) =>
                        products.find((p) => p.code === po.code) as Product
                    ),
                  };
                }),
              },
            },
            { status: 200 }
          );
        }
      }

      return Response.json(
        {
          step: CALCULATOR_STEP.DIMENSIONS_SCREEN,
          action: CALCULATOR_ACTIONS.SET_DIMENSIONS,
          data: {
            structure_id:
              memoryStore[calculatorCart].currentStructure.structure_id,
            structure_name:
              memoryStore[calculatorCart].currentStructure.structure_name,
            img: memoryStore[calculatorCart].currentStructure.img,
          },
        },
        { status: 200 }
      );
    } else {
      // memoryStore[calculatorCart].currentStructure.getProductList =
      //   newGetProductList;

      // verificar si data.product_id pertecene al id de un accesories
      if (accesories.some((a) => a.id === data.product_id)) {
        // verificar si es masilla o cinta
        const accesory = accesories.find(
          (a) => a.id === data.product_id
        ) as IAccesory;

        if (accesory.tipo === "masilla") {
          memoryStore[calculatorCart].masillaId = data.product_id;
        } else {
          memoryStore[calculatorCart].cintaId = data.product_id;
        }
      }

      // verificar si memoryStore[calculatorCart].currentStructure.getProductList contiene algun calc que sea masilla o cinta
      // y ademas si cintaId o masillaId es null
      // y si la calculadora es distinta de BASIC
      if (
        memoryStore[calculatorCart].currentStructure.getProductList.some(
          (pl: ProductList) => pl.calc === "masilla" || pl.calc === "cinta"
        ) &&
        (!memoryStore[calculatorCart].cintaId ||
          !memoryStore[calculatorCart].masillaId)
      ) {
        // primero verificar masillaId === null
        if (!memoryStore[calculatorCart].masillaId) {
          // buscar en accesories la masilla
          const masillas = accesories.filter(
            (a) => a.tipo === "masilla"
          ) as IAccesory[];

          return Response.json(
            {
              step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
              action: CALCULATOR_ACTIONS.SELECT_MASILLA,
              data: {
                productList: masillas.map((a) => ({
                  id: a.id,
                  title: a.nombre,
                  description: "",
                })),
              },
              structureList: memoryStore[calculatorCart].structures || [],
            },
            { status: 200 }
          );
        } else {
          // buscar en accesories las cinta
          const cintas = accesories.filter(
            (a) => a.tipo === "cinta"
          ) as IAccesory[];

          return Response.json(
            {
              step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
              action: CALCULATOR_ACTIONS.SELECT_CINTA,
              data: {
                productList: cintas.map((a) => ({
                  id: a.id,
                  title: a.nombre,
                  description: "",
                })),
              },
            },
            { status: 200 }
          );
        }
      } else {
        const productList = memoryStore[
          calculatorCart
        ].currentStructure.getProductList.filter(
          (pl: ProductList) => pl.productsOptions.length > 1 && !pl.select
        ) as ProductList[];

        if (productList.length === 0) {
          return Response.json(
            {
              step: CALCULATOR_STEP.DIMENSIONS_SCREEN,
              action: CALCULATOR_ACTIONS.SET_DIMENSIONS,
              data: {
                structure_id:
                  memoryStore[calculatorCart].currentStructure.structure_id,
                structure_name:
                  memoryStore[calculatorCart].currentStructure.structure_name,
                img: memoryStore[calculatorCart].currentStructure.img,
              },
            },
            { status: 200 }
          );
        } else {
          return Response.json(
            {
              step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
              action: CALCULATOR_ACTIONS.ADD_MULTIPLE_PRODUCT,
              data: {
                // productList,
                productList: productList.map((pl) => {
                  // return product
                  return {
                    productsOptions: pl.productsOptions.map(
                      (po) =>
                        products.find((p) => p.code === po.code) as Product
                    ),
                  };
                }),
              },
            },
            { status: 200 }
          );
        }
      }
    }
  }

  if (
    action === CALCULATOR_ACTIONS.ADD_MULTIPLE_PRODUCT &&
    step === CALCULATOR_STEP.SELECT_PRODUCT_SCREEN
  ) {
    data.products_id.forEach((product_id: string) => {
      memoryStore[calculatorCart].currentStructure.getProductList = memoryStore[
        calculatorCart
      ].currentStructure.getProductList.map((pl: ProductList) => {
        if (
          pl.productsOptions &&
          pl.productsOptions.some((po) => po.code === product_id)
        ) {
          return {
            ...pl,
            select: product_id,
          };
        } else {
          return pl;
        }
      });
    });

    return Response.json(
      {
        step: CALCULATOR_STEP.DIMENSIONS_SCREEN,
        action: CALCULATOR_ACTIONS.SET_DIMENSIONS,
        data: {
          structure_id:
            memoryStore[calculatorCart].currentStructure.structure_id,
          structure_name:
            memoryStore[calculatorCart].currentStructure.structure_name,
          img: memoryStore[calculatorCart].currentStructure.img,
        },
      },
      { status: 200 }
    );
  }

  if (step === CALCULATOR_STEP.DIMENSIONS_SCREEN) {
    // si la estructura es de tipo pvc
    const pvcStructure = memoryStore[
      calculatorCart
    ].currentStructure.getProductList.find((pl: any) => pl.type === "pvc");

    if (pvcStructure) {
      memoryStore[calculatorCart].structureList.push({
        ...pvcStructure,
        structure_id: data.structure_id,
        structure_name: data.structure_name,
        width: data.width,
        height: data.height,
        structureProductList: memoryStore[
          calculatorCart
        ].currentStructure.getProductList.map((productList: ProductList) => {
          return {
            calc: productList.calc,
            productCode: productList.select,
          };
        }),
        placaWidth: pvcStructure.width,
      });
    } else {
      memoryStore[calculatorCart].structureList.push({
        structure_id: data.structure_id,
        structure_name: data.structure_name,
        width: data.width,
        height: data.height,
        structureProductList: memoryStore[
          calculatorCart
        ].currentStructure.getProductList.map((productList: ProductList) => {
          return {
            calc: productList.calc,
            productCode: productList.select,
          };
        }),
      });
    }

    const { productList, totalPrice } = await getProductsAndTotalPrice(
      calculatorCart
    );

    return Response.json(
      {
        step: CALCULATOR_STEP.LIST_STRUCTURES_ADDED_SCREEN,
        structures: structures.list,
        structureList: memoryStore[calculatorCart].structureList,
        productList,
        totalPrice,
      },
      { status: 200 }
    );
  }

  if (step === CALCULATOR_STEP.END_SCREEN) {
    memoryStore[calculatorCart].structureList = []; // reset structureList
    memoryStore[calculatorCart].cintaId = null;
    memoryStore[calculatorCart].masillaId = null;
    memoryStore[calculatorCart].step = CALCULATOR_STEP.STRUCTURES_SCREEN;
    memoryStore[calculatorCart].currentStructure = null;
    memoryStore[calculatorCart].productList = [];

    return Response.json(
      {
        step: CALCULATOR_STEP.STRUCTURES_SCREEN,
        structures: structures.list,
        structureList: memoryStore[calculatorCart].structureList,
      },
      { status: 200 }
    );
  }

  return Response.json({ success: "ok" }, { status: 200 });
};

const getProductsAndTotalPrice = async (calculatorCart: string) => {
  const structuresAdded = memoryStore[calculatorCart].structureList;
  // get array of quantityRequest from structuresAdded
  const quantityRequest = structuresAdded
    .filter((s: any) => s.structureProductList)
    .map((structure: any) => {
      return structure.structureProductList
        .filter((s: any) => s.calc)
        .map((sp: any) => {
          // get product
          const product = products.find(
            (p) => p.code === sp.productCode
          ) as Product;

          // get structureOption
          const structureOption = structures.list.find(
            (so) => so.id === structure.structure_id
          ) as StructureOption;

          return {
            id: sp.productCode,
            performance: Number(product.performance),
            calc: sp.calc,
            category: structureOption.category,
            width: Number(structure.width),
            height: Number(structure.height),
            gap:
              structureOption.productList.find((pl) => pl.calc === sp.calc)
                ?.gap || 0,
          };
        });
    })
    .flat();

  // reduce quantityRequest to get total m2 of each product when calc === 'tornillos' || calc === 'tarugos' || calc === 'masilla' || calc === 'cinta' and set object with key productCode and value totalM2 and category of structure

  const arrayProductsInM2 = quantityRequest
    .filter(
      (qr: QuantityRequest) =>
        qr.calc === "tornillos" ||
        qr.calc === "tarugos" ||
        qr.calc === "masilla" ||
        qr.calc === "cinta"
    )
    .reduce((acc: any, qr: any) => {
      const key = qr.id;

      acc[key] = acc[key]
        ? acc[key]
        : {
            ...qr,
            totalM2: 0,
          };

      acc[key].totalM2 += qr.width * qr.height;

      return acc;
    }, {});

  // filter quantityRequest when calc !== 'tornillos' || calc !== 'tarugos' || calc !== 'masilla' || calc !== 'cinta'
  const quantityRequestFiltered = quantityRequest.filter(
    (qr: QuantityRequest) =>
      qr.calc !== "tornillos" &&
      qr.calc !== "tarugos" &&
      qr.calc !== "masilla" &&
      qr.calc !== "cinta"
  );

  // map arrayProductsInM2 to RequestQuantity

  const requestQuantity = Object.keys(arrayProductsInM2).map((key) => {
    const qr = arrayProductsInM2[key];
    // raiz cuadrada de qr.totalM2
    const sqrt = Math.sqrt(qr.totalM2);
    return {
      id: qr.id,
      performance: qr.performance,
      calc: qr.calc,
      category: qr.category,
      width: sqrt,
      height: sqrt,
      gap: qr.gap,
    };
  });

  // concat quantityRequestFiltered with requestQuantity
  const finalQuantityRequest = quantityRequestFiltered.concat(
    requestQuantity.filter((qr) => qr.calc !== "masilla" && qr.calc !== "cinta")
  );

  // calc masilla and cintas
  const otherProducts = [] as Product[];

  requestQuantity.forEach((qr) => {
    if (qr.calc === "masilla") {
      let masillas = [] as Product[];
      const m2 = (qr.height * qr.width) / 0.9;
      console.log({ m2 });
      if (memoryStore[calculatorCart].masillaId) {
        // find masilla in accesories
        const masillasSet = accesories.find(
          (a) => a.id === memoryStore[calculatorCart].masillaId
        ) as IAccesory;

        masillas = masillasSet.productListResult;
      } else {
        // find masilla in accesories
        const masillasSet = accesories.find(
          (a) => a.tipo === "masilla"
        ) as IAccesory;

        masillas = masillasSet.productListResult;
      }

      let m2Cubiertos = 0;
      // buscar el producto dentro de masilla.productListResult cuya performance sea las mas alta pero que no supere m2
      while (m2Cubiertos < m2) {
        let product = masillas
          .sort((a, b) => Number(a.performance) - Number(b.performance))
          .find(
            (p) => Number(p.performance) > Math.ceil(m2 - m2Cubiertos)
          ) as Product;

        if (!product) {
          product = masillas
            .sort((a, b) => Number(b.performance) - Number(a.performance))
            .find(
              (p) => Number(p.performance) <= Math.ceil(m2 - m2Cubiertos)
            ) as Product;
        }

        if (!product) {
          // product = the product with de lower performance
          product = masillas.sort(
            (a, b) => Number(a.performance) - Number(b.performance)
          )[0] as Product;
        }
        console.log({ product });
        m2Cubiertos = m2Cubiertos + Number(product.performance);
        console.log({ m2Cubiertos, m2 });
        otherProducts.push({ ...product, quantity: 1 });
      }
    }

    if (qr.calc === "cinta") {
      let cintas = [] as Product[];
      const m2 = Math.ceil((qr.height * qr.width) / 9);

      if (memoryStore[calculatorCart].cintaId) {
        // find cinta in accesories
        const cintasSet = accesories.find(
          (a) => a.id === memoryStore[calculatorCart].cintaId
        ) as IAccesory;

        cintas = cintasSet.productListResult;
      } else {
        // find cinta in accesories
        const cintasSet = accesories.find(
          (a) => a.tipo === "cinta"
        ) as IAccesory;

        cintas = cintasSet.productListResult;
      }

      let m2Cubiertos = 0;
      // buscar el producto dentro de cintas.productListResult cuya performance sea las mas alta pero que no supere m2
      while (m2Cubiertos < m2) {
        let product = cintas
          .sort((a, b) => Number(a.performance) - Number(b.performance))
          .find(
            (p) => Number(p.performance) > Math.ceil(m2 - m2Cubiertos)
          ) as Product;

        if (!product) {
          product = cintas
            .sort((a, b) => Number(b.performance) - Number(a.performance))
            .find(
              (p) => Number(p.performance) <= Math.ceil(m2 - m2Cubiertos)
            ) as Product;
        }

        if (!product) {
          // product = the product with de lower performance
          product = cintas.sort(
            (a, b) => Number(a.performance) - Number(b.performance)
          )[0] as Product;
        }
        m2Cubiertos = m2Cubiertos + Number(product.performance);
        otherProducts.push({ ...product, quantity: 1 });
      }
    }
  });

  // console.log(finalQuantityRequest);

  const quantitiesProducts = await getQuantitiesProducts(finalQuantityRequest);

  // map quantitiesProducts and make array of products with quantity
  const productsWithQuantity = quantitiesProducts
    .map((qp) => {
      const product = products.find((p) => p.code === qp.id) as Product;

      return {
        ...product,
        quantity: qp.quantity,
      };
    })
    .concat(otherProducts);

  const productsPvcQuantity = getProductsPvcQuantity(
    calculatorCart
  ) as (Product & { quantity: number })[];

  const productsWithQuantityReducer = productsWithQuantity
    .concat(productsPvcQuantity)
    .reduce((acc: any, p: any) => {
      const key = p.code;

      acc[key] = acc[key]
        ? acc[key]
        : {
            ...p,
            quantity: 0,
          };

      acc[key].quantity += p.quantity;

      return acc;
    }, {});

  // productsWithQuantityReducer convert to array
  const productsWithQuantityReducerArray = Object.keys(
    productsWithQuantityReducer
  ).map((key) => productsWithQuantityReducer[key]);

  const totalPrice = productsWithQuantityReducerArray.reduce(
    (acc: any, p: any) => acc + p.priceWithIvaAndDiscount * p.quantity,
    0
  );

  return {
    productList: productsWithQuantityReducerArray,
    totalPrice: `${USDollar.format(totalPrice)}`,
  };
};

const getProductsPvcQuantity = (calculatorCartId: string) => {
  let pvcProductsAdded = [] as (Product & { quantity: number })[];

  let pvcStructures = memoryStore[calculatorCartId].structureList.filter(
    (pl: any) => pl.type === "pvc"
  );

  pvcStructures.forEach((pvcStructure: any) => {
    if (pvcStructure.molduraId) {
      const perimetro =
        Number(pvcStructure.width) * 2 + Number(pvcStructure.height) * 2;
      // get moldura
      const moldura = pvcProducts.find(
        (p) => p.code === pvcStructure.molduraId
      ) as Product;

      pvcProductsAdded.push({
        ...moldura,
        quantity: Math.ceil(perimetro / Number(moldura.performance)),
      });
    }

    // obtener placas de la lista de pvcProducts filtrando por color, width y deep
    const pvcProductsFiltered = pvcProducts.filter(
      (p) =>
        p.isPlacaPvc &&
        p.color === pvcStructure.color &&
        p.width === pvcStructure.placaWidth &&
        p.deep === pvcStructure.deep
    );
    // ordenar pvcProductsFiltered por performance de menor a mayor
    const pvcProductsOrdered = pvcProductsFiltered.sort(
      (a, b) => a.height - b.height
    );

    // determinar entre Number(pvcStructure.width) y Number(pvcStructure.height) cual es el mayor
    const mayor = Math.max(
      Number(pvcStructure.width),
      Number(pvcStructure.height)
    );
    // determinar entre Number(pvcStructure.width) y Number(pvcStructure.height) cual es el menor
    const menor = Math.min(
      Number(pvcStructure.width),
      Number(pvcStructure.height)
    );

    let mtsCubiertos = 0;

    while (mtsCubiertos < menor) {
      // determinar si alguna placa de Number(pvcProductsOrdered.performance) es mayor o igual a mayor
      const pvcProductsMayorMatched = pvcProductsOrdered.find(
        (p) => p.height >= menor - mtsCubiertos
      );

      if (pvcProductsMayorMatched) {
        pvcProductsAdded.push({
          ...pvcProductsMayorMatched,
          quantity: Math.ceil(
            mayor /
              pvcStructure.placaWidth 
              // / (pvcProductsMayorMatched.height / menor)
          ),
        });

        mtsCubiertos = mtsCubiertos + pvcProductsMayorMatched.height;
      } else {
        // dividir menor en 3 partes dejando la parte del medio con un 50% de menor y las otras dos partes con un 25% de menor
        const parteMedia = menor * 0.5;
        const parteLateral = menor * 0.25;
        // buscar en pvcProductsOrdered la placa que sea mayor o igual a parteMedia
        const pvcProductsParteMediaMatched = pvcProductsOrdered.find(
          (p) => p.height >= parteMedia
        );
        if (pvcProductsParteMediaMatched) {
          pvcProductsAdded.push({
            ...pvcProductsParteMediaMatched,
            quantity: Math.ceil(
              mayor /
                pvcStructure.placaWidth 
                // / (pvcProductsParteMediaMatched.height / parteMedia)
            ),
          });
          mtsCubiertos = mtsCubiertos + pvcProductsParteMediaMatched.height;
        }
        // buscar en pvcProductsOrdered la placa que sea mayor o igual a parteLateral
        const pvcProductsParteLateralMatched = pvcProductsOrdered.find(
          (p) => p.height >= parteLateral
        );
        if (pvcProductsParteLateralMatched) {
          pvcProductsAdded.push({
            ...pvcProductsParteLateralMatched,
            quantity:
              Math.ceil(
                mayor /
                  pvcStructure.placaWidth 
                  //  / (pvcProductsParteLateralMatched.height / parteLateral)
              ) * 2,
          });
          mtsCubiertos =
            mtsCubiertos + pvcProductsParteLateralMatched.height * 2;
        }
      }
    }

    // si no lo es, obtener la placa de mayor Number(performance) y restar ((mayor - Number(mayorPlacaPerformanceEncontrada.performance) / 2) y buscar en pvcProductsOrdered la placa que sea mayor o igual a ese resultado
  });

  return pvcProductsAdded;
};
