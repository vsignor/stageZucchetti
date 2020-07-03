class LogisticRegressionLearner extends ZMLSupervisedLearner {
  constructor(nPredict){
    super();
    this.algorithm="LogisticRegression"
    //
    this.nPredict=nPredict
    this.data=[]   
    this.Ai=[]
    this.B=0
  }
  addData(c,x){
    this.data.push({c:c,x:x})
  }
  resetData(){
    this.data=[]
  }
  train(){
    // addestramento con steepest descent
    var epochs = 500
    var alpha = 0.2
    var i,ep
    var pErr = 1000
    this.Ai = [];
    for(i=0;i<this.nPredict;i++) this.Ai.push(0)
    this.B = 0.0;
    for (ep=0; ep<epochs; ep++){
      var error,j,d;
      for(j=0;j<data.length;j++){      
        d=this.data[j]
        var predY;
        var lambda=this.B;
        for(i=0;i<this.nPredict;i++)
          lambda+=this.Ai[i]*d.x[i];    
        //func = A*d.x1/100+B*d.x2/100+C; <<-- devo capire questo 100
        predY = 1/(1+Math.exp(-lambda));
        error = predY - (d.c==1?1:0);
        //tempA = A;
        //tempB = B;
        //tempC = C;
        //A = tempA + alpha*-error*predY*(1-predY)*d.x1/100;
        //B = tempB + alpha*-error*predY*(1-predY)*d.x2/100;
        //C = tempC + alpha*-error*predY*(1-predY)*1.0;
        for(i=0;i<this.nPredict;i++)
          this.Ai[i]=this.Ai[i]+alpha*-error*predY*(1-predY)*d.x[i];
        this.B=this.B+ alpha*-error*predY*(1-predY)*1.0;
      }
      //console.log('A', A, 'B', B, 'C', C);
      //console.log('Error', error);
      //errors.push({error:error, epoch:i});
      //var accuracy = 1+Math.round(error*100)/100;
      //console.log("Ai="+this.Ai+ " B="+this.B+" error="+error+" accuracy = "+(1+Math.round(error*100)/100))
      //if (Math.abs(pErr-error)<0.000001) {console.log("at epoc "+ep);ep=epochs;}
      pErr = error
    }
    console.log("Ai="+this.Ai+ " B="+this.B+" error="+error)
  }
  getModel(){
    var m=new LogisticRegressionModel(this.nPredict)
    m.Ai=this.Ai
    m.B=this.B
    return m;
  }
}

class LogisticRegressionModel extends ZMLModel {
  constructor(nPredict){
    super()
    this.learner="LogisticRegression"
    //
    this.nPredict=nPredict
    this.Ai=[]
    this.B=0
  }
  predictJS(x){
    var i,predY,lambda;
    lambda = this.B;
    for(i=0;i<this.nPredict;i++) 
      lambda+=this.Ai[i]*x[i];
    predY = 1/(1+Math.exp(-lambda));
    return (predY>0.5?1:-1)
  }
  predictSQL(c){
    var i,predY,lambda;
    lambda = ""+this.B;
    for(i=0;i<this.nPredict;i++) 
      lambda+=(this.Ai[i]>0?'+':'')+this.Ai[i]+'*'+c[i];
    predY = '1/(1+exp(-('+lambda+')))';
    return ('case when '+predY+'>0.5 then 1 else -1 end')
  }
}
