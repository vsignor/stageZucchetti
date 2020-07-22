class BaseClassifier extends ZMLSupervisedLearner{
  constructor(nPredict,alg){
    super();
    this.nPredict=nPredict
    this.algorithm=alg
    this.data=[]   
    this.labels=[]
  }  
  addData(c,x){
    this.data.push(x)
    this.labels.push(c)
    super.addData()
  }
  resetData(){
    this.data=[]
    this.labels=[]
    super.resetData()
  }
  train(){
    // fa tutto nella getModel    
  }
  getNumberOfPredictors(){
    return this.nPredict;
  }
}

// Random forest usando la libreria di Karpathy 
class RandomForestLearner extends BaseClassifier {
  constructor(nPredict){
    super(nPredict,"RandomForest");
  }
  getModel(){
    // Random Forest di Karpathy
    var rf=new forestjs.RandomForest({type:1}) //{numTrees:25,maxDepth:10})
    rf.train(this.data,this.labels)
    var m=new RandomForestModel(this.nPredict)
    m.rf=rf
    return m;
  }
}

class RandomForestModel extends ZMLModel {
  constructor(nPredict){
    super()
    this.learner="RandomForest"
    this.nPredict=nPredict
    this.rf=null
  }
  predictJS(x){
    var r=this.rf.predict([x])
    // Random Forest di Karpathy
    return (r[0]>0.5?1:-1)
  }

  predictSQL(c){
    return "No predizione in SQL"
  }
}
