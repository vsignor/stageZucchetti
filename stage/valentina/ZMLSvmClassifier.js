class SvmLearner extends ZMLSupervisedLearner {
  constructor(nPredict,kernel){
    super();
    this.kernel=kernel || "linear"
    this.algorithm="Svm("+kernel+")"
    this.nPredict=nPredict
    this.data=[]   
    this.labels=[]
    //this.testdata=[] //io
  }
  addData(c,x){
    this.data.push(x)
    this.labels.push(c)
  }
  resetData(){
    this.data=[]
    this.labels=[]  // io
    }
  train(){
    // fa tutto nella getModel    
  }
  
  getModel(){
    var svm=new svmjs.SVM()
    //svm.train(this.data,this.labels,{kernel:this.kernel})
  //  testlabels = svm.predict(testdata); //io
    var m=this.modelFactory()
    m.svm=svm
    return m;
  }
  modelFactory(){
    // crea un modello specifico per il tipo di Svm
    return new SvmModel(this.nPredict,this.kernel)
  }

 /* getNumberOfPredictors(){
    return this.nPredict;
  }*/

}

class SvmModel extends ZMLModel {
  constructor(nPredict,kernel){
    super()
    this.learner="Svm("+kernel+")"
    //
    this.nPredict=nPredict
    this.kernel=kernel
  }
  predictJS(x){
    return this.svm.predict([x])  // mi dice se il dato x che segno nel grafico appartiene alla classe 1 o -1
  }

  predictSQL(c){
    return "No predizione in SQL"
  }  
}

class LinearSvmLearner extends SvmLearner {
  constructor(nPredict){
    super(nPredict,"linear");
    this.algorithm="Svm(linear)" // io
  }
}

class RbfSvmLearner extends SvmLearner {
  constructor(nPredict){
    super(nPredict,"rbf");
    this.algorithm="Svm(rbf)" // io
  }  
}

class Pol2SvmLearner extends SvmLearner {
  constructor(nPredict){
    super(nPredict*2,"linear")
    this.algorithm="Svm(pol2)"
  }

  addData(c,x){
    var n=[]
    //for(var i=0;i<this.nPredict;i++)
    //  n.push(x[i])
    //for(var i=0;i<this.nPredict;i++)
    //  n.push(x[i]*x[i])
    n.push(x[0])
    n.push(x[1])
    //n.push(x[0]*x[0]+x[1]*x[1])
    n.push(x[0]*x[1])
    n.push(x[0]*x[0])
    n.push(x[1]*x[1])
    n.push(x[0]*x[0]*x[0])
    n.push(x[1]*x[1]*x[1])
    super.addData(c,n)
  }

  modelFactory(){
    return new Pol2SvmModel()
  }
}

class Pol2SvmModel extends SvmModel {
  predictJS(x){
    var n=[]
    //for(var i=0;i<this.nPredict;i++)
    //  n.push(x[i])
    //for(var i=0;i<this.nPredict;i++)
    //  n.push(x[i]*x[i])
    n.push(x[0])
    n.push(x[1])
    //n.push(x[0]*x[0]+x[1]*x[1])
    n.push(x[0]*x[1])
    n.push(x[0]*x[0])
    n.push(x[1]*x[1])
    n.push(x[0]*x[0]*x[0])
    n.push(x[1]*x[1]*x[1])
	return this.svm.predict([n])
  }

  predictSQL(c){
    return "No predizione in SQL"
  }  
}