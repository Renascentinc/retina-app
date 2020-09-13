import html2pdf from 'html2pdf.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default {
  methods: {
    generatePdfFromObject: async function (data, header, filename, imageIndex) {
      const doc = new jsPDF()
      var currentImage = null
      doc.autoTable({
        head: [header],
        body: data,
        CellDef: 30,
        didParseCell: (data) => {
          if (rowHasPhoto(data, imageIndex)) {
            // remove image url from row data, and increase height for thumbnail
            data.cell.text = ''
            data.row.height = 15
          }
        },
        didDrawCell: (data) => {
          if (rowHasPhoto(data, imageIndex)) {
            doc.addImage(data.row.raw[imageIndex], 'JPEG', data.cell.x + 2, data.cell.y + 2, 10, 10)
          }
        },
      })
      doc.save(filename)
    }
  }
}

function rowHasPhoto(rowData, imageIndex) {
  if (imageIndex === undefined) {
    return false
  }
  else {
    return rowData.section === 'body' && rowData.column.index === 0 && rowData.row.raw[imageIndex] !== null
  }
}