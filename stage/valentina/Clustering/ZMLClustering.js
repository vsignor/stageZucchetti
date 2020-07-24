class KmeansLearner extends ZMLUnsupervisedLearner{
  constructor(k, alg){
    super();
    this.k=k  // n. cluster
    this.algorithm="k-means"
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
  getModel(){  /* 
    var kmeans = new KMEANS();
    var clusters=[];
    var km = kmeans.run(this.data, this.k)
    var m=new KmeansModel()
    for(var c=0;c<km.length;c++){
      var cc=km[c]
      for(var i=0;i<cc.length;i++)
        clusters[cc[i]]=c
    }
    m.clusters = clusters;
    return m;
  }*/
  var kmeans=ML.KMeans(this.data,this.k)
  var m=new KmeansModel(this.k)
  m.kmeans=kmeans
  return m
}
  getNumberOfCluster(){
    return this.k;
  }
  getAlgorithm(){
    return this.algorithm;
  }
}

class KmeansModel extends ZMLModel {
  constructor(k){
    super()
    this.learner="K-means"
    this.k=k
    this.kmeans=null
  }
  predictJS(x){ // punto centroide 
    var min_d=ML.Distance.squaredEuclidean(this.kmeans.centroids[0].centroid,x),c=0;
    for(var i=1;i<this.kmeans.centroids.length;i++){
      var d=ML.Distance.squaredEuclidean(this.kmeans.centroids[i].centroid,x)
      if (d<min_d){
        min_d = d
        c = i
      }
    }
    return c;  
  }
  clusterJS(i){
    //return this.clusters[i];
    return this.kmeans.clusters[i];
  }
  predictSQL(c){
    return "No predizione in SQL"
  }
}

// -----------------------------   DBSCAN  -----------------------------------------------
class DbscanLearner extends ZMLUnsupervisedLearner{
  constructor(k, alg){
    super();
    this.k=k  // n. cluster
    this.algorithm="Dbscan"
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
  getModel(){   
    var dbscan = new DBSCAN();
    var clusters=[];
    var db = dbscan.run(this.data, this.k)
    var m=new DbscanModel()
    for(var c=0;c<db.length;c++){
      var cc=db[c]
      for(var i=0;i<cc.length;i++)
        clusters[cc[i]]=c
    }
    for(var i=0;i<dbscan.noise.length;i++)  // noise restituisce il valore del rumore delle coordinate specificate
      clusters[dbscan.noise[i]]=-1;
    m.clusters = clusters;
    return m;
  }
  getNumberOfCluster(){
    return this.k;
  }
  getAlgorithm(){
    return this.algorithm;
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
    return -2;  // non fa nulla
  }
  clusterJS(i){
    return this.clusters[i];
  }
  predictSQL(c){
    return "No predizione in SQL"
  }
}


// -----------------------------   OPTICS  -----------------------------------------------

class OpticsLearner extends ZMLUnsupervisedLearner{
  constructor(k, alg){
    super();
    this.k=k  // n. cluster
    this.algorithm="Optics"
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
  getModel(){   
    var optics = new OPTICS();
    var clusters=[];
    var op = optics.run(this.data, this.k)
    var m=new OpticsModel(), nc = 0;
    for(var c=0;c<op.length;c++){
      var cc=op[c]
      if (cc.length==1){  // un punto: anomalo
        clusters[cc[0]]=-1
      } else {
        for(var i=0;i<cc.length;i++)
          clusters[cc[i]]=nc
        nc++
      }
    }
    m.clusters=clusters
    return m
  }
  getNumberOfCluster(){
    return this.k;
  }
  getAlgorithm(){
    return this.algorithm;
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
    return -2; // non fa nulla
  }
  clusterJS(i){
    return this.clusters[i];
  }
  predictSQL(c){
    return "No predizione in SQL"
  }
}

