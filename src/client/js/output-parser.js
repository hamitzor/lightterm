class OutputParser {
   constructor({ contentMatrix }) {
      this._cm = contentMatrix
   }

   extractEscapes(str) {
      const styleEscapes = []
      let match
      let cleanStr = str

      do {
         match = new RegExp(/\u001b\[(\d*)(?:;?(\d*))*m/gmiu).exec(cleanStr)
         if (match) {
            const styleCodes = []
            for (let i = 1; i < match.length; i++) {
               if (match[i]) {
                  styleCodes.push(parseInt(match[i]))
               }
            }
            styleEscapes.push([styleCodes, match.index, match.index + match[0].length])
            cleanStr = cleanStr.replace(match[0], '')
         }
      } while (match)

      return { cleanStr, styleEscapes }
   }

   parse(output) {

      output = output.replace(/\r\n/gmiu, '\n')

      output = output.replace(/\r/gmiu, '\n')

      const rows = output.split(/\n/gmiu)

      //@TODO if it has new line, go new line otherwise change cursorY..
      if (rows[rows.length - 1] === '') {
         rows.splice(-1, 1)
      }
      rows.forEach(row => {
         const { cleanStr, styleEscapes } = this.extractEscapes(row)
         this._cm.setStyleData(this._cm.getCursorX(), styleEscapes)
         this._cm.setRow(this._cm.getCursorX(), cleanStr.split(''))
         this._cm.setCursorX(this._cm.getCursorX() + 1)
      })
   }
}

module.exports = OutputParser