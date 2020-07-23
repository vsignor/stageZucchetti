/*

    RandomForestKLearner
    RandomForestLearner
    DecisionTreeLearner
    NaiveBayesG
    NaiveBayesM
    knn
    Rbf
    
    -- ID3, no --
    
    SMOTE
    
*/

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
    super.train()
  }
}

// Random forest usando la libreria di Karpathy 
class RandomForestKLearner extends BaseClassifier {
  constructor(nPredict){
    super(nPredict,"RandomForestK");
  }
  getModel(){
    // Random Forest di Karpathy
    var rf=new forestjs.RandomForest({type:1}) //{numTrees:25,maxDepth:10})
    rf.train(this.data,this.labels)
    var m=new RandomForestKModel(this.nPredict)
    m.rf=rf
    return m;
  }
}

class RandomForestKModel extends ZMLModel {
  constructor(nPredict){
    super()
    this.learner="RandomForestK"
    this.nPredict=nPredict
    this.rf=null
  }
  predictJS(x){
    var r=this.rf.predict([x])
    // Random Forest di Karpathy
    return (r[0]>0.5?1:-1)
  }
}

// Random Forest dalla liberia ML.js
class RandomForestLearner extends BaseClassifier {
  constructor(nPredict){
    super(nPredict,"RandomForest")
  }
  getModel(){
    // Random Forest di ml.js
    var rf=new ML. RandomForestClassifier() //{replacement:true,nEstimators: 10}) //{seed: 3,maxFeatures: 2,replacement: true,nEstimators: 25})
    rf.train(this.data,this.labels.map(x=>(x==1?1:0)))
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
    //Random Forest di ml.js
    return (r[0]==1?1:-1)
  }
}

class DecisionTreeLearner extends BaseClassifier {
  constructor(nPredict){
    super(nPredict,"DecisionTree")
  }
  getModel(){
    // Decision Tree da ML.js
    var dt=new ML.DecisionTreeClassifier()
    dt.train(this.data,this.labels.map(x=>(x==1?1:0)))
    var m=new DecisionTreeModel(this.nPredict)
    m.dt=dt
    return m
  }
}
  
class DecisionTreeModel extends ZMLModel {
  constructor(nPredict){
    super()
    this.learner="DecisionTree"
    this.nPredict=nPredict
    this.dt=null
  }
  predictJS(x){
    var r=this.dt.predict([x])
    //Decision Tree di ml.js
    return (r[0]==1?1:-1)
  }  
}  

class NaiveBayesLearner extends BaseClassifier {
  constructor(nPredict,type){
    super(nPredict,"NaiveBayes("+type+")")
    this.type=type
  }
  getModel(){
    var nb=(this.type=="Gauss"?new ML.NaiveBayes.GaussianNB():new ML.NaiveBayes.MultinomialNB())
    nb.train(this.data,this.labels.map(x=>(x==1?1:0)))
    var m=new NaiveBayesModel(this.nPredict,this.type)
    m.nb=nb
    return m
  }
}
  
class NaiveBayesModel extends ZMLModel {
  constructor(nPredict,type){
    super()
    this.learner="NaiveBayes("+type+")"
    this.type=type
    this.nPredict=nPredict
    this.nb=null
  }
  predictJS(x){
    var r=this.nb.predict([x])
    return (r[0]==1?1:-1)
  }  
}  

class FeedForwardNetworkLearner extends BaseClassifier {
  constructor(nPredict,neurons,activation){
    super(nPredict,"FeedForwardNetwork")
    this.neurons=neurons
    this.activation=activation || "tanh"
  }
  getModel(){
    var ffn=new ML.FNN({hiddenLayers:this.neurons,activation:this.activation,iterations:1000})
    ffn.train(this.data,this.labels.map(x=>(x==1?1:0)))
    var m=new FeedForwardNetworkModel(this.nPredict)
    m.ffn=ffn
    return m
  }
}
  
class FeedForwardNetworkModel extends ZMLModel {
  constructor(nPredict){
    super()
    this.learner="FeedForwardNetwork"
    this.nPredict=nPredict
    this.ffn=null
  }
  predictJS(x){
    var r=this.ffn.predict([x])
    return (r[0]==1?1:-1)
  }  
}  

class rbfLearner extends BaseClassifier {
  constructor(nPredict){
    super(nPredict,"rbf");
  }
  getModel(){
    var m=new rbfModel(this.nPredict),i
    for(i=0;i<this.data.length;i++){
      m.data.push(this.data[i])
      m.labels.push(this.labels[i])
    }
    return m;
  }
}

class rbfModel extends ZMLModel {
  constructor(nPredict){
    super()
    this.learner="rbf"
    //
    this.nPredict=nPredict
    this.data=[]
    this.labels=[]
  }
  predictJS(x){
    var i,r=0,d
    for(i=0;i<this.data.length;i++){
      d=Math.pow(x[0]-this.data[i][0],2)+Math.pow(x[1]-this.data[i][1],2) // quadrato della distanza euclidea dall' i-esimo punto
      //d=Math.abs(x[0]-this.data[i][0])+Math.abs(x[1]-this.data[i][1]) // distanza di Manhattan
      r+=Math.exp(-d)*this.labels[i]
    }
    return (r>0?1:-1)
  }
  predictSQL(c){
    var i,r=""
    for(i=0;i<this.data.length;i++)
      r+=(this.labels[i]==1?'+':'-')+"exp(-(power("+c[0]+"-("+this.data[i][0].toFixed(4)+"),2)+power("+c[1]+"-("+this.data[i][1].toFixed(4)+"),2)))"
    return "case when ("+r+")>0 then 1 else -1 end"
  }
}

class knnLearner extends BaseClassifier {
  constructor(nPredict,nn){
    super(nPredict,"knn("+nn+")");
    this.nn=nn
  }
  getModel(){
    var m=new knnModel(this.nPredict,this.nn),i
    // versione mia
    //var p=[]
    //for(i=0;i<this.data.length;i++){
    //  p.push({x:this.data[i][0],y:data[i][1],'l':this.labels[i]})
    //}
    //m.tree=new kdTree(p,function(a, b){return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2);},["x","y"])
    // versione ML.js
    m.tree=new ML.KNN(this.data.map(x=>(x<0?0:x)),this.labels,{k:this.nn})
    return m;
  }
}

class knnModel extends ZMLModel {
  constructor(nPredict,nn){
    super()
    this.learner="knn("+nn+")"
    this.nPredict=nPredict
    this.nn=nn
    this.tree=null
  }
  predictJS(x){
    // versione mia
    //var p=this.tree.nearest({x:x[0],y:x[1]},this.nn),r=0
    //for(var i=0;i<p.length;i++){
    //  r+=p[i][0].l
    // }
    //return (r>0?1:-1)
    // versione ML.js
    return this.tree.predict([x])
  }
}

class knnGLearner extends BaseClassifier {
  constructor(nPredict,nn){
    super(nPredict,"knn("+nn+")");
    this.nn=nn
  }
  getModel(){
    var m=new knnGModel(this.nPredict,this.nn),i
    // versione mia
    var p=[]
    for(i=0;i<this.data.length;i++){
      p.push({x:this.data[i][0],y:data[i][1],'l':this.labels[i]})
    }
    m.tree=new kdTree(p,function(a, b){return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2);},["x","y"])
    // versione ML.js
    //m.tree=new ML.KNN(this.data,this.labels,{k:this.nn})
    return m;
  }
}

class knnGModel extends ZMLModel {
  constructor(nPredict,nn){
    super()
    this.learner="knn("+nn+")"
    this.nPredict=nPredict
    this.nn=nn
    this.tree=null
  }
  predictJS(x){
    // versione mia
    var p=this.tree.nearest({x:x[0],y:x[1]},this.nn),r=0
    for(var i=0;i<p.length;i++){
      r+=p[i][0].l
     }
    return (r>0?1:-1)
    // versione ML.js
    //return this.tree.predict([x])
  }
}

class SmoteLearner extends BaseClassifier {
  constructor(nPredict,nn){
    super(nPredict,"SMOTE");
    this.nn=nn
  }
  getModel(){
    var c0=[],c1=[]
    for(var i=0;i<this.data.length;i++){
      if (this.labels[i]==1)
        c1.push(this.data[i])
      else
        c0.push(this.data[i])
    }
    var new_data=null
    if (c1.length>c0.length){
      // aggiunge dati a c0
      var n=c1.length-c0.length
      var smote = new SMOTE(c0)
      new_data = smote.generate(n)
      for(i=0;i<new_data.length;i++){
        this.data.push(new_data[i])
        this.labels.push(-1)
        data.push(new_data[i])
        labels.push(-1)
      }
    } else {
      // aggiunge dati a c1
      var n=c0.length-c1.length
      var smote = new SMOTE(c1)
      new_data = smote.generate(n)      
      for(i=0;i<new_data.length;i++){
        this.data.push(new_data[i])
        this.labels.push(1)
        data.push(new_data[i])
        labels.push(1)
      }
    }
    return null;
  }
}
