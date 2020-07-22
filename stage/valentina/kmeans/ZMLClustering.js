class BaseClassifier extends ZMLUnsupervisedLearner{
  constructor(k, alg){
    super();
    this.k=k  // n. cluster
    this.algorithm=alg
    this.data=[]   
  }  
  addData(x){
    super.addData()
    this.data.push(x)
  }
  
  resetData(){
    super.resetData()
    this.data=[]
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
    var clusters=[];
    var km = kmeans.run(this.data,this.k)
    var m=new KmeansModel(this.k)
    for(var c=0;c<km.length;c++){
      var cc=km[c]
      for(var i=0;i<cc.length;i++)
        clusters[cc[i]]=c
    }
    for(var i=0;i<km.noise.length;i++)
      clusters[dbs.noise[i]]=-1;
    m.kmeans=kmeans
    m.clusters = clusters;
    return m;
  }
}

/*getModel(){
  var dbs=new DBSCAN()
  var clusters=[],dbsr=dbs.run(this.data,0.7,2)
  var m=new dbscanModel()
  for(var c=0;c<dbsr.length;c++){
    var cc=dbsr[c]
    for(var i=0;i<cc.length;i++)
      clusters[cc[i]]=c
  }
  for(var i=0;i<dbs.noise.length;i++)
    clusters[dbs.noise[i]]=-1;
  m.clusters=clusters
  return m
}*/

class KmeansModel extends ZMLModel {
  constructor(k){
    super()
    this.learner="K-means"
    this.k=k
    this.kmeans=null
  }
  predictJS(x){
  }

  clusterJS(i){
    return this.kmeans.clusters[i];
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
