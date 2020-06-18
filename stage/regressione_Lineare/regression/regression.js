
class Regression {

  add(xs,ys){this.addObservation({x:[1].concat(xs),y:[ys]})}
  calculate(){return this.calculateCoefficients()}
  predict(xs){return this.hypothesize({x:[1].concat(xs)})}
  push(options){this.addObservation(options)}
  
  constructor(options){
    if(!options)
      throw new Error('missing options')
    if(!('numX' in options))
      throw new Error('you must give the width of the X dimension as the property numX')
    if(!('numY' in options))
      throw new Error('you must give the width of the X dimension as the property numY')
    this.transposeOfXTimesX = this.rectMatrix({numRows: options.numX,numColumns: options.numX})
    this.transposeOfXTimesY = this.rectMatrix({numRows: options.numX,numColumns: options.numY})
    this.identity = this.identityMatrix(options.numX)  
  }
  
  addObservation(options){
    if(!options)
      throw new Error('missing options')
    if(!(options.x instanceof Array) || !(options.y instanceof Array))
      throw new Error('x and y must be given as arrays')
    this.addRowAndColumn(this.transposeOfXTimesX,{lhsColumn: options.x,rhsRow: options.x})
    this.addRowAndColumn(this.transposeOfXTimesY,{lhsColumn: options.x,rhsRow: options.y})
    // Adding an observation invalidates our coefficients.
    delete this.coefficients
  }
   
  calculateCoefficients(){
    var xTx = this.transposeOfXTimesX
    var xTy = this.transposeOfXTimesY
    var inv = this.inverse(xTx, this.identity)
    this.coefficients = this.multiply(inv, xTy)
    return this.coefficients
  }

  hypothesize(options) {
    if(!options)
      throw new Error('missing options')
    if(!(options.x instanceof Array))
      throw new Error('x property must be given as an array')
    if(!this.coefficients) 
      this.calculateCoefficients()
    var hypothesis = []
    for(var x = 0; x < this.coefficients.length; x++) {
      var coefficientRow = this.coefficients[x]
      for(var y = 0; y < coefficientRow.length; y++)
        hypothesis[y] = (hypothesis[y] || 0) + coefficientRow[y] * options.x[x]
    }
    return hypothesis
  }
  
  inverse(matrix, identity) {
    var size = matrix.length
    var result = new Array(size)
    for(var i = 0; i < size; i++)
      result[i] = matrix[i].concat(identity[i])
    result = this.rref(result)
    for(var i = 0; i < size; i++) result[i].splice(0, size)
    return result
  }

  rref(A) {
    var rows = A.length;
    var columns = A[0].length;
    
    var lead = 0;
    for (var k = 0; k < rows; k++) {
        if (columns <= lead) return;
        
        var i = k;
        while (A[i][lead] === 0) {
            i++;
            if (rows === i) {
                i = k;
                lead++;
                if (columns === lead) return;
            }
        }
        var irow = A[i], krow = A[k];
        A[i] = krow, A[k] = irow;
         
        var val = A[k][lead];
        for (var j = 0; j < columns; j++) {
            A[k][j] /= val;
        }
         
        for (var i = 0; i < rows; i++) {
            if (i === k) continue;
            val = A[i][lead];
            for (var j = 0; j < columns; j++) {
                A[i][j] -= val * A[k][j];
            }
        }
        lead++;
    }
    return A;
  }
  
  multiply(lhs, rhs) {
    var options = { numRows: lhs.length, numColumns: rhs[0].length }
    var streamingProduct = this.rectMatrix(options)
    for(var x = 0; x < rhs.length; x++) {
      var lhsColumn = []
      // Get the xth column of lhs.
      for(var r = 0; r < lhs.length; r++)
        lhsColumn.push(lhs[r][x])
      // Get the xth row of rhs.
      var rhsRow = rhs[x]
      this.addRowAndColumn(streamingProduct,{
        lhsColumn: lhsColumn,
        rhsRow: rhsRow
      })
    }
    return streamingProduct
  }

  identityMatrix(size){
    var matrix = this.rectMatrix({ numRows: size, numColumns: size })
    for(var i = 0; i < size; i++) 
      matrix[i][i] = 1
    return matrix
  }

  rectMatrix(options){
    var matrix = new Array(options.numRows)
    for(var r = 0; r < options.numRows; r++) {
      var row = new Array(options.numColumns)
      matrix[r] = row
      for(var c = 0; c < options.numColumns; c++) {
        row[c] = 0
      }
    }
    return matrix
  }
  
  addRowAndColumn(product,options){
    for(var c = 0; c < options.lhsColumn.length; c++)
      for(var r = 0; r < options.rhsRow.length; r++)
        product[c][r] += options.lhsColumn[c] * options.rhsRow[r]
  }
  
}
