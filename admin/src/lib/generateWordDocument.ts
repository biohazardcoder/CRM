import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableCell,
  TableRow,
  WidthType,
} from "docx";

export const generateCustomerDoc = async (customer: any) => {
  const { name, phone, location, buyedProducts } = customer;

  const totalSum = buyedProducts.reduce(
    (acc: number, p: any) => acc + p.price * p.quantity,
    0
  );

  const createHeader = (label: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: label, bold: true, break: 1 }),
        new TextRun({ text: `\nIsm: ${name}`, bold: true }),
        new TextRun(`\nTelefon: ${phone}`),
        new TextRun(`\nManzil: ${location}`),
      ],
    });

  const makeRow = (p: any) =>
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("☐")] }),
        new TableCell({ children: [new Paragraph(`${p.product} (${p.size})`)] }),
        new TableCell({ children: [new Paragraph(p.type)] }),
        new TableCell({ children: [new Paragraph(`${p.price.toLocaleString()} so'm`)] }),
        new TableCell({ children: [new Paragraph(`${(p.price * p.quantity).toLocaleString()} so'm`)] }),
      ],
    });

  const createTable = () =>
    new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("✔️")], width: { size: 5, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph("Mahsulot (o'lcham)")] }),
            new TableCell({ children: [new Paragraph("Turi")] }),
            new TableCell({ children: [new Paragraph("Narxi")] }),
            new TableCell({ children: [new Paragraph("Jami")] }),
          ],
        }),
        ...buyedProducts.map(makeRow),
        new TableRow({
          children: [
            new TableCell({ children: [] }),
            new TableCell({ children: [] }),
            new TableCell({ children: [] }),
            new TableCell({
              children: [new Paragraph({ text: "Umumiy:",  })],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: `${totalSum.toLocaleString()} so'm`,
                }),
              ],
            }),
          ],
        }),
      ],
    });

  const doc = new Document({
    sections: [
      {
        children: [
          createHeader(""),
          new Paragraph(" "),
          createTable(),
          new Paragraph(" "),
          createHeader(""),
          new Paragraph(" "),
          createTable(),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${name}_mahsulotlar.docx`);
};
