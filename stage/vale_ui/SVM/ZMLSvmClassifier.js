class SvmLearner extends ZMLSupervisedLearner {
  constructor(nPredict,kernel){
    super();
    this.kernel=kernel || "linear"
    this.algorithm="Svm("+kernel+")"
    this.nPredict=nPredict
   /* this.rbfkernelsigma=[]
    this.svmC=[]*/
    this.data=[]   
    this.labels=[]
  }
  addData(c,x){
    this.data.push(x)
    this.labels.push(c)
  }
  resetData(){
    this.data=[]
    this.labels=[]  
    }
  train(){
    // fa tutto nella getModel    
  }
 /*retrain(){
 this.getModel();
 }*/
  getModel(){
    var svm=new svmjs.SVM()
    svm.train(this.data,this.labels,{kernel:this.kernel})
  //  testlabels = svm.predict(testdata); //io
    var m=this.modelFactory()
    m.svm=svm
    return m;
  }
  modelFactory(){
    // crea un modello specifico per il tipo di Svm
    return new SvmModel(this.nPredict,this.kernel)
  }
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
    var w=this.svm.w
    if (this.kernel!="linear") return "No predizione in SQL"
    var r=''+this.svm.b.toFixed(4)
    for(var i=0;i<c.length;i++)
      r+=" + "+c[i]+' * ('+w[i].toFixed(4)+')'
    return "case when ("+r+") > 0 then 1 else -1 end"
  }  
}

class LinearSvmLearner extends SvmLearner {  //svm lineare
  constructor(nPredict){
    super(nPredict,"linear");
    this.algorithm="Svm(linear)" // io
  }
}

class RbfSvmLearner extends SvmLearner {  //svm non lineare: metodo del kernel
  constructor(nPredict){
    super(nPredict,"rbf");
    this.algorithm="Svm(rbf)" // io
  }  
}

class Pol2SvmLearner extends SvmLearner {  //svm lineare
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
  /*  n.push(x[0]*x[0]*x[0])
    n.push(x[1]*x[1]*x[1])*/
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
    //n.push(x[0]*x[0]+x[1]*x[1])  /*era per il grado */
    n.push(x[0]*x[1])
    n.push(x[0]*x[0])
    n.push(x[1]*x[1])
  /*  n.push(x[0]*x[0]*x[0])    /*era per il grado */
  /*  n.push(x[1]*x[1]*x[1])*/
	return this.svm.predict([n])
  }
  predictSQL(c){
    var w=this.svm.w
    var r=""+this.svm.b.toFixed(4)
    r+=" + "+c[0]+" * ("+w[0].toFixed(4)+")"
    r+=" + "+c[1]+" * ("+w[1].toFixed(4)+")"
    r+=" + "+c[0]+" * "+c[1]+" * ("+w[2].toFixed(4)+")"
    r+=" + "+c[0]+" * "+c[0]+" * ("+w[3].toFixed(4)+")"
    r+=" + "+c[1]+" * "+c[1]+" * ("+w[4].toFixed(4)+")"
    return "case when ("+r+") > 0 then 1 else -1 end"
  }  
}




/* select codiceCliente, x, 3.52 + x * (-0.14) as prediction from clienti   */
/* voglio fare espressioni da mettere fra select e from che siano semplici, quindi predittori semplici e che abbiano le operazioni da fare in SQL   */