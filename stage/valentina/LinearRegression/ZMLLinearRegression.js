class LinearRegressionLearner extends ZMLLearner {
  constructor(nPredict){
    super();
    this.algorithm="LinearRegression";
    this.nPredict=nPredict
    this.reg=new LinearRegression({ numX: nPredict+1, numY: 1 })
  }
  addData(y,x){
    this.reg.push({x:[1].concat(x),y:[y]})
  }
  resetData(){
    this.reg=new LinearRegression({ numX: this.nPredict+1, numY: 1 }) 
  }
  train(){
    this.reg.calculateCoefficients()
  }
  getModel(){
    this.train()
    var m=new LinearRegressionModel(this.nPredict)
    var c=this.reg.calculateCoefficients();
    m.coeff=[]
    for(var i=0;i<c.length;i++) m.coeff.push(c[i][0])
    return m;
  }
  getNumberOfPredictors(){
    return this.nPredict;
  }

}

class LinearRegressionModel extends ZMLModel {
  constructor(nPredict){
    super();
    this.learner="LinearRegression"
    this.nPredict=nPredict
    this.coeff=[]
  }
  predictJS(x){
    var i,r=this.coeff[0]
    for(i=1;i<this.coeff.length;i++)
      r+=x[i-1]*this.coeff[i]
    return r
  }
  predictSQL(c){
    var i,r=this.coeff[0].toFixed(4)+""
    for(i=1;i<this.coeff.length;i++)
      r+=" + "+c[i-1]+" * ("+this.coeff[i].toFixed(4)+")"
    return r
  }

}

class ExpRegressionLearner extends LinearRegressionLearner {
  constructor(){
    super(1)
    this.algorithm="ExpRegression"
  }
  addData(y,x){
    //super(Math.log(y),x)
    this.reg.push({x:[1].concat(x),y:[Math.log(y)]})
    //this.reg.push({x:[1].concat([Math.exp(x)]),y:[y]})
  }
  resetData(){
    super.resetData();
  }
  getModel(){
    this.train()
    var m=new ExpRegressionModel()
    var c=this.reg.calculateCoefficients();
    m.coeff=[]
    for(var i=0;i<c.length;i++) m.coeff.push(c[i][0])
    return m;
  }
}

class ExpRegressionModel extends LinearRegressionModel {
  constructor(){
    super(1);
    this.learner="ExpRegression"
  }
  predictJS(x){
    var i,r=this.coeff[0]
    for(i=1;i<this.coeff.length;i++)
      r+=x[i-1]*this.coeff[i]
    return Math.exp(r);
    //  r+=Math.exp(x[i-1])*this.coeff[i]
    //return r;
  }
  predictSQL(c){
    var i,r=this.coeff[0].toFixed(4)+""
    for(i=1;i<this.coeff.length;i++)
      r+=" + "+c[i-1]+" * ("+this.coeff[i].toFixed(4)+")"
    return "exp("+r+")"
    //  r+="+exp("+c[i-1]+")*("+this.coeff[i]+")"
    //return r;
  }  
}

class PolinomialRegressionLearner extends LinearRegressionLearner {
  constructor(nDegree){
    super(nDegree)
    this.nDegree=nDegree
    this.algorithm="PolinomialRegression"
  }
  addData(y,x){
    var xx=[1]
    for(var i=1;i<=this.nDegree;i++)
      xx.push(Math.pow(x[0],i))
    this.reg.push({x:xx,y:[y]})
  }
  resetData(){
    super.resetData();
  }
  getModel(){
    this.train()
    var m=new PolinomialRegressionModel(this.nDegree)
    var c=this.reg.calculateCoefficients();
    m.coeff=[]
    for(var i=0;i<c.length;i++) m.coeff.push(c[i][0])
    return m;
  }
}

class PolinomialRegressionModel extends LinearRegressionModel {
  constructor(nDegree){
    super(nDegree);
    this.nDegree=nDegree
    this.learner="PolinomialRegression"
  }
  predictJS(x){
    var i,r=this.coeff[0]
    for(i=1;i<=this.nDegree;i++)
      r+=Math.pow(x[0],i)*this.coeff[i]
    return r; 
  }
  predictSQL(c){
    var i,r=this.coeff[0].toFixed(4)+""
    for(i=1;i<=this.nDegree;i++)
      r+=" + power ("+c[0]+","+i+") * ("+this.coeff[i].toFixed(4)+")"
    return r
  }  
}

class knnRegressionLearner extends ZMLLearner {
  constructor(n){
    super()
    this.nn=n
    this.algorithm="knnRegression"
    this.data=[]
  }
  addData(y,x){
    this.data.push([y,x])
  }
  resetData(){
	this.data=[]
  }
  train(){
    // sort data
    this.data.sort(function(a,b){return a[1][0]-b[1][0];})
  }
  getModel(){
    this.train()
    var m=new knnRegressionModel(this.nn)
    for(var i=0;i<this.data.length;i++)
      m.data.push(this.data[i])
    return m
  }

  getNumberOfPredictors(){
    return this.data.length;
  }
}

class knnRegressionModel extends ZMLModel {
  constructor(){
    super()
    this.nn=n
    this.learner="knnRegression"
    this.data=[]
  }
  predictJS(x){
    var min_d=Math.abs(x[0]-this.data[0][1][0]);
    var p=0,d,r;
    for(var i=1;i<this.data.length;i++){
      d=Math.abs(x[0]-this.data[i][1][0])
      if (d<min_d) {
        min_d=d
        p=i
      }
    }
    var le=p,ri=p
    for(i=1;i<this.nn;i++){
      if (Math.abs(x[0]-this.data[le][1][0])<Math.abs(x[0]-this.data[ri][1][0])){
        if (le>0) le--;
      } else {
        if (ri+1<this.data.length) ri++;
      }
    }
    r=0
    for(i=le;i<=ri;i++) 
      r+=this.data[i][0]
    r=r/(ri-le+1)
    return r
  }

   predictSQL(c){
    return "No predizione in SQL"
  }  
}