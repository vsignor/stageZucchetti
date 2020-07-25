class kMeansLearner extends ZMLUnsupervisedLearner {
  constructor(nGroups){
    super()
    this.algorithm="k-means"
    this.nGroups=nGroups
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
    
  }
  getModel(){
    var kmm=ML.KMeans(this.data,this.nGroups)
    var m=new kMeansModel(this.nGroups)
    m.kmm=kmm
    return m
  }
}

class kMeansModel extends ZMLModel {
  constructor(nGroups){
    super()
    this.learner="k-means"
    this.nGroups=nGroups
    this.kmm=null
  }
  predictJS(x){
    var min_d=ML.Distance.squaredEuclidean(this.kmm.centroids[0].centroid,x),c=0;
    for(var i=1;i<this.kmm.centroids.length;i++){
      var d=ML.Distance.squaredEuclidean(this.kmm.centroids[i].centroid,x)
      if (d<min_d){
        min_d = d
        c = i
      }
    }
    return c;  
  }
  clusterJS(i){
    return this.kmm.clusters[i]
  }
}

class kMedoidsLearner extends ZMLUnsupervisedLearner {
  constructor(nGroups){
    super()
    this.algorithm="k-medoids"
    this.nGroups=nGroups
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
    
  }
  getModel(){
    var kmd=ML.fromCytoscape.kMedoids(this.data,{k:this.nGroups})
    var m=new kMedoidsModel(this.nGroups)
    var clusters=[]
    for(var c=0;c<kmd.length;c++){
      var cc=kmd[c];
      for(var i=0;i<cc.length;i++)
        clusters[cc[i].id]=c;
    }
    m.clusters=clusters
    return m
  }
}

class kMedoidsModel extends ZMLModel {
  constructor(nGroups){
    super()
    this.learner="k-medoids"
    this.nGroups=nGroups
    this.clusters=null
  }
  predictJS(x){
    return -2;
  }
  clusterJS(i){
    return this.clusters[i]
  }
}

class fuzzyCMeansLearner extends ZMLUnsupervisedLearner {
  constructor(nGroups){
    super()
    this.algorithm="fuzzyCMeans"
    this.nGroups=nGroups
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
    
  }
  getModel(){
    var fcm=ML.fromCytoscape.fuzzyCMeans(this.data,{k:this.nGroups})
    var m=new fuzzyCMeansModel(this.nGroups)
    var clusters=[]
    for(var c=0;c<fcm.clusters.length;c++){
      var cc=fcm.clusters[c];
      for(var i=0;i<cc.length;i++)
        clusters[cc[i].id]=c;
    }
    m.clusters=clusters
    return m
  }
}

class fuzzyCMeansModel extends ZMLModel {
  constructor(nGroups){
    super()
    this.learner="fuzzyCMeans"
    this.nGroups=nGroups
    this.clusters=null
  }
  predictJS(x){
    return -2;
  }
  clusterJS(i){
    return this.clusters[i]
  }
}

class dbscanLearner extends ZMLUnsupervisedLearner {
  constructor(){
    super()
    this.algorithm="dbscan"
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
  getModel(){
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
  }
}

class dbscanModel extends ZMLModel {
  constructor(){
    super()
    this.learner="dbscan"
    this.clusters=null
  }
  predictJS(x){
    return -2;
  }
  clusterJS(i){
    return this.clusters[i]
  }
}

class opticsLearner extends ZMLUnsupervisedLearner {
  constructor(){
    super()
    this.algorithm="optics"
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
  getModel(){
    var opt=new OPTICS()
    var clusters=[],optr=opt.run(this.data,0.7,2)
    var m=new opticsModel(),nc=0
    for(var c=0;c<optr.length;c++){
      var cc=optr[c]
      if (cc.length==1){
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
}

class opticsModel extends ZMLModel {
  constructor(){
    super()
    this.learner="optics"
    this.clusters=null
  }
  predictJS(x){
    return -2;    
  }
  clusterJS(i){
    return this.clusters[i]
  }
}

class HierClustLearner extends ZMLUnsupervisedLearner {
  constructor(nGroups){
    super()
    this.algorithm="hierarchical-clustering"
    this.nGroups=nGroups
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
  getModel(){
    var hc=ML.HClust.agnes(data)
    // ora rende l'albero sotto forma di clusters
    var ee=[],p=0,n=2,i
    ee.push(hc.children[1])
    ee.push(hc.children[0])
    while(n<this.nGroups){
      while (ee[p].isLeaf) p+=1; // il nodo è una foglia, devo espandere quello che segue
      ee.push(ee[p].children[1])
      ee.push(ee[p].children[0])
      ee=ee.slice(p+1)
      ee.sort(function(a,b){return b.height-a.height;})
      n+=1
    }
    // qui ho tutti i Cluster pronti ad essere esplorati
    var clusters=[]
    for(i=0;i<ee.length;i++)
      this.exploreNode(ee[i],clusters,i)
    var m=new HierClustModel()
    m.clusters=clusters
    return m
  }  
  exploreNode(n,clusters,i){
    if (n.isLeaf) {
      clusters[n.index]=i;
    } else {
      this.exploreNode(n.children[0],clusters,i)
      this.exploreNode(n.children[1],clusters,i)
    }
  }
}

class HierClustModel extends ZMLModel {
  constructor(nGroups){
    super()
    this.learner="hierarchical-clustering"
    this.nGroups=nGroups
    this.hc=null
    this.clusters=[]
  }  
  predictJS(x){
    return -2;
  }  
  clusterJS(i){
    return this.clusters[i]
  }
}

class EMLearner extends ZMLUnsupervisedLearner {
  constructor(nGroups){
    super()
    this.algorithm="em"
    this.nGroups=nGroups
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
  getModel(){
    var groups =  multivariate_gaussian_fit(this.data, this.nGroups);
    var i,j,clusters=[],probs=[],p
    for(i=0;i<groups.length;i++){
      var g=new Gaussian(groups[i])
      for(j=0;j<this.data.length;j++){
        p=g.density(this.data[j])
        if (i==0 || p>probs[j]){
          clusters[j]=i
          probs[j]=p
        }
      }
    }    
    var m=new EMModel(this.nGroups)
    m.clusters=clusters
    m.groups=groups
    return m
  }
}

class EMModel extends ZMLModel {
  constructor(){
    super()
    this.learner="em"
    this.clusters=null
    this.groups=null
  }
  predictJS(x){
    var max_p=0,r=-2
    for(var i=0;i<this.groups.length;i++){
      var g = new Gaussian(this.groups[i])
      var p = g.density(x)
      if (p>max_p){
        max_p = p
        r = i
      }
    }    
    return r;
  }
  clusterJS(i){
    return this.clusters[i]
  }
}

class OneClassGaussianLearner extends ZMLUnsupervisedLearner {
  constructor(){
    super()
    this.algorithm="OneClassGaussian"
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
  getModel(){
    var ocg = new OneClassGaussian(this.data)
    var m=new OneClassGaussianModel()
    var clusters=[]
    for(var i=0;i<this.data.length;i++){
      clusters.push((ocg.density(this.data[i])>0.01?0:-1))
    }
    m.ocg=ocg
    m.clusters=clusters
    return m
  }  
}

class OneClassGaussianModel extends ZMLModel {
  constructor(){
    super()
    this.learner="OneClassGaussian"
    this.clusters=null
    this.ocg=null
  }
  predictJS(x){
    return (this.ocg.density(x)>0.01?0:-1);
  }
  clusterJS(i){
    return this.clusters[i]
  }
}

class IsolationForestLearner extends ZMLUnsupervisedLearner {
  constructor(){
    super()
    this.algorithm="Isolation Forest"
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
  getModel(){
    var ifo = new IsolationForest()
    ifo.fit(this.data)
    var scores = ifo.scores()
    var m=new IsolationForestModel()
    m.ifo=ifo
    var clusters=[]
    for(var i=0;i<this.data.length;i++){
      clusters.push((scores[i]>0.7?-1:0))
    }
    m.clusters=clusters
    return m
  }  
}

class IsolationForestModel extends ZMLModel {
  constructor(){
    super()
    this.learner="IsolationForestGaussian"
    this.ifo=null
    this.clusters=null
  }
  predictJS(x){
    return (this.ifo.predict([x])>0.7?-1:0)
  }
  clusterJS(i){
    return this.clusters[i]
  }
}

class tSNELearner extends ZMLUnsupervisedLearner {
  constructor(){
    super()
    this.algorithm="t-SNE"
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
  getModel(){
    var opt = {}
    opt.epsilon = 10; // epsilon is learning rate (10 = default)
    opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
    opt.dim = 2; // dimensionality of the embedding (2 = default)
    var tsne = new tsnejs.tSNE(opt); // create a tSNE instance
    tsne.initDataRaw(this.data);
    for(var k = 0; k < 500; k++) {
      tsne.step(); // every time you call this, solution gets better
    }
    var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot    
    // da fare !!!
    return null
  }  
}

class tSNEModel extends ZMLModel {
  constructor(){
    super()
    this.learner="t-SNE"
    this.clusters=null
  }
  clusterJS(i){
    return this.clusters[i]
  }
}

class UMAPLearner extends ZMLUnsupervisedLearner {
  constructor(){
    super()
    this.algorithm="UMAP"
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
  getModel(){
    const umap = new UMAP();
    const embedding = umap.fit(this.data);    
    // da fare !!!
    return null
  }  
}

class UMAPModel extends ZMLModel {
  constructor(){
    super()
    this.learner="UMAP"
    this.clusters=null
  }
  clusterJS(i){
    return this.clusters[i]
  }
}
