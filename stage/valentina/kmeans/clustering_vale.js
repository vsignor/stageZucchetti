class BaseClassifier extends ZMLUnsupervisedLearner{
  constructor(k ,alg){
    super();
    this.k=k  // n. cluster
    this.algorithm=alg
    this.data=[]   
    this.lebels=[]
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
  getNumberOfCluster(){
    return this.k;
  }
}

// Clustering libreria
class KmeansLearner extends BaseClassifier {
  constructor(k){
    super(k, "K-means");
  }
  getModel(){
    var kmeans = new KMEANS();
    kmeans.run(this.data,this.k)
    var m=new KmeansModel(this.k)
    m.kmeans=kmeans
    return m;
  }
}

class KmeansModel extends ZMLModel {
  constructor(k){
    super()
    this.learner="K-means"
    this.k=k
    this.dbscan=null
  }
  predictJS(x){
    var p = this.kmeans.assign(x)  
    console.log(p)
  }

  predictSQL(c){
    return "No predizione in SQL"
  }
}

class DbscanLearner extends BaseClassifier {
  constructor(k){
    super(k, "Dbscan");
  }
  getModel(){
    var dbscan = new DBSCAN();
    dbscan.run(this.data,this.k)
    var m=new DbscanModel(this.k)
    m.dbscan= dbscan
    return m;
  }
}

class DbscanModel extends ZMLModel {
  constructor(k){
    super()
    this.learner="Dbscan"
    this.k=k
    this.dbscan=null
  }
  predictJS(x){
    var p = this.dbscan.assign(x)  
  }

  predictSQL(c){
    return "No predizione in SQL"
  }
}

class OpticsLearner extends BaseClassifier {
  constructor(k){
    super(k, "Optics");
  }
  getModel(){
    var optics = new OPTICS();
    optics.run(this.data,this.k)
    var m=new OpticsModel(this.k)
    m.optics=optics
    return m;
  }
}

class OpticsModel extends ZMLModel {
  constructor(k){
    super()
    this.learner="Optics"
    this.k=k
    this.optics=null
  }
  predictJS(x){
    var p = this.optics.assign(x)  
  }

  predictSQL(c){
    return "No predizione in SQL"
  }
}
