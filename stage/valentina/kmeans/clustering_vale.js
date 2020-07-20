class BaseClassifier extends ZMLUnsupervisedLearner{
  constructor(k,alg){
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
    var clusters = kmeans.run(data, this.k)
  }

  predictSQL(c){
    return "No predizione in SQL"
  }
}

class DbscanLearner extends BaseClassifier {
  constructor(k){
    super(k, "K-means");
  }
  getModel(){
    var dbscan = new DBSCAN();
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
    var clusters = dbscan.run(data, this.k)
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
    var clusters = optics.run(data, this.k)
  }

  predictSQL(c){
    return "No predizione in SQL"
  }
}
