import React from "react";

const PDFViewer = () => {
  const pdfUrl = "https://res.cloudinary.com/dn91itzwc/raw/upload/v1748025253/coursePdfs/aayPramanBalmiki2-1748025253382.pdf";

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        title="PDF Viewer"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default PDFViewer;
