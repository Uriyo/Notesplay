// types/html2pdf.d.ts

declare module 'html2pdf.js' {
    interface Html2PdfOptions {
      margin?: number | [number, number, number, number];
      filename?: string;
      image?: {
        type?: string;
        quality?: number;
      };
      html2canvas?: {
        scale?: number;
        [key: string]: any;
      };
      jsPDF?: {
        unit?: string;
        format?: string;
        orientation?: string;
        [key: string]: any;
      };
    }
  
    interface Html2PdfInstance {
      set: (options: Html2PdfOptions) => Html2PdfInstance;
      from: (element: string | HTMLElement) => Html2PdfInstance;
      save: () => Promise<void>;
    }
  
    function html2pdf(): Html2PdfInstance;
    function html2pdf(element: string | HTMLElement, opts?: Html2PdfOptions): Html2PdfInstance;
  
    export default html2pdf;
  }