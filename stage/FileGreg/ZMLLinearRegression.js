class LinearRegressionLearner extends ZMLLearner {
  constructor(nPredict){
    super();
    this.algorithm="LinearRegression";
    this.nPredict=nPredict
    this.reg=new LinearRegression({ numX: nPredict+1, numY: 1 })
  }
  addData(y,x){
    super.addData(y,x);
    this.reg.push({x:[1].concat(x),y:[y]})
  }
  resetData(){
    super.resetData();
    this.reg=new LinearRegression({ numX: this.nPredict+1, numY: 1 }) 
  }
  train(){
    this.reg.calculateCoefficients()
    super.train()
  }
  getModel(){
    this.ensureTrained()
    var m=new LinearRegressionModel(this.nPredict)
    var c=this.reg.calculateCoefficients();
    m.coeff=[]
    for(var i=0;i<c.length;i++) m.coeff.push(c[i][0])
    return m;
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
      r+="+"+c[i-1]+"*("+this.coeff[i].toFixed(4)+")"
    return r
  }
}

class ExpRegressionLearner extends LinearRegressionLearner {
  constructor(){
    super(1)
    this.algorithm="ExpRegression"
  }
  addData(y,x){
    super.addData(Math.log(y),x)
    //this.reg.push({x:[1].concat(x),y:[Math.log(y)]})
    //this.reg.push({x:[1].concat([Math.exp(x)]),y:[y]})
  }
  getModel(){
    this.ensureTrained()
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
      r+="+"+c[i-1]+"*("+this.coeff[i].toFixed(4)+")"
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
    var xx=[]
    for(var i=1;i<=this.nDegree;i++)
      xx.push(Math.pow(x[0],i))
    super.addData(y,xx)
  }
  getModel(){
    this.ensureTrained()
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
      r+="+power("+c[0]+","+i+")*("+this.coeff[i].toFixed(4)+")"
    return r
  }  
}

class BrokenLineRegressionLearner extends LinearRegressionLearner {
  constructor(breakOn){
    super(2)
    this.algorithm="BrokenLineRegression"
    this.breakOn=breakOn || 0
  }
  addData(y,x){
    var xx=[]
    xx.push((x[0]<this.breakOn?x[0]:0))
    xx.push((x[0]>this.breakOn?x[0]:0))
    super.addData(y,xx)
  }
  getModel(){
    this.ensureTrained()
    var m=new BrokenLineRegressionModel(this.breakOn)
    var c=this.reg.calculateCoefficients();
    m.coeff=[]
    for(var i=0;i<c.length;i++) m.coeff.push(c[i][0])
    return m;
  }
}

class BrokenLineRegressionModel extends LinearRegressionModel {
  constructor(breakOn){
    super(2);
    this.learner="BrokenLineRegression"
    this.breakOn=breakOn || 0
  }
  predictJS(x){
    var i,r=this.coeff[0]
    r+=(x[0]<this.breakOn?x[0]:0)*this.coeff[1]
    r+=(x[0]>this.breakOn?x[0]:0)*this.coeff[2]
    return r; 
  }
  predictSQL(c){
    var i,r=this.coeff[0].toFixed(4)+""
    r+=c+"*("+this.coeff[1].toFixed(4)+")"
    r+=" .... "
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
    super.addData()
    this.data.push([y,x])
  }
  resetData(){
    super.resetData()
    this.data=[]
  }
  train(){
    // sort data
    this.data.sort(function(a,b){return a[1][0]-b[1][0];})
    super.train()
  }
  getModel(){
    this.ensureTrained()
    var m=new knnRegressionModel(this.nn)
    for(var i=0;i<this.data.length;i++)
      m.data.push(this.data[i])
    return m
  }
}

class knnRegressionModel extends ZMLModel {
  constructor(n){
    super()
    this.nn=n
    this.learner="knnRegression"
    this.data=[]
  }
  predictJS(x){
    var le=0,ri=this.data.length-1,ce,i,r
    if (x[0]<this.data[0][1][0]) return this.data[0][0]; // fuori dall'intervallo a sinistra del il primo
    if (x[0]>this.data[ri][1][0]) return this.data[ri][0]; // fuori dall'intervallo a destra dell'ultimo
    // trova il punto più vicino a quello richiesto per bisezione
    while (ri-le>1){
      ce=Math.round((ri+le)/2)
      if (x[0]<this.data[ce][1][0]) ri=ce; else le=ce;
    }
    for(i=1;i<this.nn;i++){
      if (Math.abs(x[0]-this.data[le][1][0])<Math.abs(x[0]-this.data[ri][1][0])){
        if (le>0) le--;
      } else {
        if (ri+1<this.data.length) ri++;
      }
    }
    r=0
    for(i=le;i<ri;i++) 
      r+=this.data[i][0]
    r=r/(ri-le)
    return r
  }
}

class rbfRegressionLearner extends ZMLLearner {
  constructor(){
    super()
    this.algorithm="rbfRegression"
    this.data=[]
  }
  addData(y,x){
    super.addData()
    this.data.push([y,x])
  }
  resetData(){
    super.resetData()
    this.data=[]
  }
  getModel(){
    var m=new rbfRegressionModel()
    for(var i=0;i<this.data.length;i++)
      m.data.push(this.data[i])
    return m
  }
}

class rbfRegressionModel extends ZMLModel {
  constructor(){
    super()
    this.learner="rbfRegression"
    this.data=[]
  }
  predictJS(x){
    var i,r=0,d,sum_d=0
    for(i=0;i<this.data.length;i++){
      d=Math.exp(-5*Math.pow(x[0]-this.data[i][1][0],2))  // e^-(d^2)
      r+=this.data[i][0]*d
      sum_d+=d
    }
    return r/sum_d;
  }
}

class TheilSenRegression extends ZMLLearner {
  constructor(){
    super()
    this.algorithm="TheilSenRegression"
    this.data=[]
    this.values=[]
  }
  addData(y,x){
    super.addData()
    this.data.push(x)
    this.values.push(y)
  }
  resetData(){
    super.resetData()
    this.data=[]
    this.values=[]
  }
  getModel(){
    var m=new TheilSenModel(this.nn)
    m.tsr=new ML.TheilSenRegression(this.data,this.values)
    return m
  }    
}

class TheilSenModel extends ZMLModel {
  constructor(n){
    super()
    this.nn=n
    this.learner="TheilSenRegression"
  }
  predictJS(x){
    return this.tsr.predict(x)
  }
}

class GPRegression extends ZMLLearner {
  constructor(){
    super()
    this.algorithm="GPRegression"
    this.data=[]
    this.values=[]
  }
  addData(y,x){
    super.addData()
    this.data.push(x)
    this.values.push(y)
  }
  resetData(){
    super.resetData()
    this.data=[]
    this.values=[]
  }
  getModel(){
    /* non funziona quando è molto spostato dall'origine ... 
       provare a fare la mediana di rette per coppie di punti
     */
    var i,j=0,a=0.8,b=0,x,delta,old_a,old_b,learning_rate=1
    while (j<5000 && (j<3 || Math.abs(a-old_a)+Math.abs(b-old_b)>0.001)) {
      for(i=0;i<this.data.length;i++){
        old_a=a
        old_b=b
        x=this.data[i][0]
        delta=a*x+b-this.values[i]
          
        //a+=(this.data[i][0]*2*delta) * -learning_rate
        //b+=(2*delta)                 * -learning_rate
        
        a+=(this.data[i][0]*delta>0?1:-1) * -learning_rate
        b+=(delta>0?1:-1)                 * -learning_rate
          
        console.log("j+i="+(j+i)+" a="+a.toFixed(3)+" b="+b.toFixed(3)+" delta="+delta.toFixed(2)+" lr="+learning_rate.toFixed(3))
      }
      learning_rate=99*learning_rate/100
      j+=this.data.length
    }
    var m=new GPModel(this.nn)    
    m.a=a
    m.b=b
    return m
  }    
}

class GPModel extends ZMLModel {
  constructor(){
    super()
    this.learner="GPRegression"
    this.a=0
    this.b=0
  }
  predictJS(x){
    return this.a*x[0]+this.b
  }
}

