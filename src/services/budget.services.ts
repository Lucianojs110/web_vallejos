import { configDataResponse, getProductsByCodes } from ".";
import { API_ENDPOINT } from "../config/constants";
import {
  PDFArray,
  PDFDocument,
  PDFName,
  StandardFonts,
  TextAlignment,
  rgb,
} from "pdf-lib";

export interface IPurchaseRequest {
  cliente: string;
  fecha: string;
  articulos: {
    articulo: string;
    cantidad: number;
    renglon: number;
  }[];
}

export const createBudget = async (purchaseRequest: IPurchaseRequest) => {
  const response = await fetch(`${API_ENDPOINT}/api/v1/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(purchaseRequest),
  });

  const data = await response.json();

  if (response.ok) {
    return await generatePdfDocument(data);
  }

  return data;
};

export const getBudget = async (budgetNumber: Number) => {
  const response = await fetch(
    `${API_ENDPOINT}/api/v1/budgets/${budgetNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  return data;
};

const generatePdfDocument = async (budget) => {
  const productCodes = budget.articulos.map((product) => product.articulo);

  const [productsInfo, config] = await Promise.all([
    getProductsByCodes(productCodes),
    configDataResponse(),
  ]);

  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${today.getFullYear()}`;

  budget.articulos = budget.articulos.map((product) => {
    const productInfo = productsInfo.find(
      (info) => info.code === product.articulo
    );

    return {
      ...product,
      ...productInfo,
      subtotal: product.cantidad * (productInfo?.priceWithIvaAndDiscount || 0),
    };
  });

  const cashTotal = budget.articulos.reduce(
    (acc, product) => acc + product.priceWithIvaAndDiscount * product.cantidad,
    0
  );

  const pageHeight = 841.89;
  const pageWidth = 595.28;

  const fetchImage = async (url: string) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  };

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Carga la imagen (puedes usar una URL o una imagen base64)
  const imageUrl = config.cabecerapdf; // Reemplaza con la URL de tu imagen
  const imageArrayBuffer = await fetchImage(imageUrl);

  const margin = 50;
  let y = pageHeight - margin - 100;

  // Insertar la imagen en el PDF
  const image = await pdfDoc.embedJpg(imageArrayBuffer);
  const { width, height } = image.scale(0.6);
  page.drawImage(image, {
    x: margin,
    y, // Posicionar en la parte superior de la página
    width,
    height,
  });

  y -= 30;

  // Agregar texto de presupuesto
  page.drawText(`Presupuesto No: ${budget.numero}    Fecha: ${formattedDate}`, {
    x: margin,
    y,
    size: 14,
    color: rgb(0, 0, 0),
  });

  y -= 30;

  // Draw table headers
  page.drawText("sku", { x: margin, y, size: 12, font: helveticaFont });
  page.drawText("Descripción", {
    x: margin + 50,
    y,
    size: 12,
    font: helveticaFont,
  });
  page.drawText("Cant", {
    x: margin + 340,
    y,
    size: 12,
    font: helveticaFont,
  });
  page.drawText("Precio", {
    x: margin + 400,
    y,
    size: 12,
    font: helveticaFont,
  });
  page.drawText("Subtotal", {
    x: margin + 460,
    y,
    size: 12,
    font: helveticaFont,
  });

  y -= 20;

  budget.articulos.forEach((product) => {
    page.drawText(product.code, {
      x: margin,
      y,
      size: 10,
      font: helveticaFont,
    });
    page.drawText(product.name, {
      x: margin + 50,
      y,
      size: 10,
      font: helveticaFont,
    });

    page.drawText(product.cantidad.toString(), {
      x: margin + 345,
      y,
      size: 10,
      font: helveticaFont,
    });

    const priceText = `$${formatNumberWithThousandsSeparator(
      Math.ceil(product.priceWithIvaAndDiscount)
    )}`;
    const priceWidth = helveticaFont.widthOfTextAtSize(priceText, 10);
    const priceX = margin + 435 - priceWidth; // Adjust as needed

    const subtotalText = `$${formatNumberWithThousandsSeparator(
      Math.ceil(product.subtotal)
    )}`;
    const subtotalWidth = helveticaFont.widthOfTextAtSize(subtotalText, 10);
    const subtotalX = margin + 505 - subtotalWidth;

    page.drawText(priceText, { x: priceX, y, size: 10, font: helveticaFont });
    page.drawText(subtotalText, {
      x: subtotalX,
      y,
      size: 10,
      font: helveticaFont,
    });

    y -= 20;
  });

  y -= 20;

  // Function to draw text aligned to the right
  const drawTextRightAligned = (text, yPosition) => {
    const textWidth = helveticaFont.widthOfTextAtSize(text, 12);
    const xPosition = pageWidth - margin - textWidth + 10;
    page.drawText(text, {
      x: xPosition,
      y: yPosition,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
  };

  // Draw totals

  drawTextRightAligned(
    `Pago contado: $${formatNumberWithThousandsSeparator(
      Math.ceil(cashTotal)
    )}`,
    y
  );

  y -= 40;

  drawTextRightAligned(config.ptext2, y);

  y -= 20;

  // Agregar texto del enlace
  const linkText = "Visita nuestro sitio web";

  const textWidth = helveticaFont.widthOfTextAtSize(linkText, 12);
  const xPosition = pageWidth / 2 - textWidth / 2 - 15;
  page.drawText(linkText, {
    x: xPosition,
    y: 50,
    size: 15,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(linkText, {
    x: xPosition,
    y: 50,
    size: 15,
    color: rgb(0, 0, 1),
  });

  // Crear una anotación de enlace
  const linkURL = "https://vallejosmateriales.com.ar"; // Reemplaza con tu URL
  page.node.set(PDFName.of("Annots"), pdfDoc.context.obj([]));
  const linkAnnotation = pdfDoc.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [xPosition, 50, xPosition + textWidth + 35, 65], // [left, bottom, right, top]
    Border: [0, 0, 0],
    A: {
      Type: "Action",
      S: "URI",
      URI: linkURL,
    },
  });
  const annots = page.node.get(PDFName.of("Annots"));
  if (annots instanceof PDFArray) {
    annots.push(linkAnnotation);
  } else {
    page.node.set(PDFName.of("Annots"), pdfDoc.context.obj([linkAnnotation]));
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  // Open the PDF in a new window or download it
  const link = document.createElement("a");
  link.href = url;
  link.download = `presupuesto_${budget.numero}.pdf`;
  link.click();

  return {
    url,
    numero: budget.numero,
  };
  // Clean up the URL object
  // URL.revokeObjectURL(url);
};

const formatNumberWithThousandsSeparator = (number: Number) => {
  return number.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
