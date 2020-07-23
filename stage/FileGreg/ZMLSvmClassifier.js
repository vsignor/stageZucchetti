class SvmLearner extends ZMLSupervisedLearner {
  constructor(nPredict,kernel){
    super();
    this.kernel=kernel || "linear"
    this.algorithm="Svm("+kernel+")"
    this.nPredict=nPredict
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
  getModel(){
    var svm=new svmjs.SVM()
    svm.train(this.normalizeData(),this.labels,{kernel:this.kernel})
    var m=this.modelFactory()
    m.svm=svm
    return m;
  }
  modelFactory(){
    // crea un modello specifico per il tipo di Svm
    return new SvmModel(this.nPredict,this.kernel)
  }
  normalizeData(){
    return this.data;
  }
}

class SvmModel extends ZMLModel {
  constructor(nPredict,kernel){
    super()
    this.learner="Svm("+kernel+")"
    //
    this.nPredict=nPredict
    this.kernel=kernel
    this.svm=null
  }
  predictJS(x){
    return this.svm.predict([x])
  }
  predictSQL(c){
    var w=this.svm.w
    if (this.kernel!="linear") throw new Error('not implemented.');
    var r=''+this.svm.b.toFixed(4)
    for(var i=0;i<c.length;i++)
      r+="+"+c[i]+'*('+w[i].toFixed(4)+')'
    return "case when ("+r+")>0 then 1 else -1 end"
  }
}

class LinearSvmLearner extends SvmLearner {
  constructor(nPredict){
    super(nPredict,"linear");
  }
}

class RbfSvmLearner extends SvmLearner {
  constructor(nPredict){
    super(nPredict,"rbf");
  }  
}

function makePolinomialKernel(nDegree){
    return function(v1,v2){
             let s=0;
             for(let q=0;q<v1.length;q++) { s += v1[q] * v2[q]; }
             s+=10
             return Math.pow(s,nDegree);
           };
}

class PolinomialKernelSvmLearner extends SvmLearner {
  constructor(nPredict,nDegree){
    super(nPredict,makePolinomialKernel(nDegree))
  }  
}

class Pol2SvmLearner extends SvmLearner {
  constructor(nPredict){
    super(nPredict*2,"linear")
    this.algorithm="Svm(pol2)"
  }
  modelFactory(){
    var m=new Pol2SvmModel()
    return m
  }
  normalizeData(){
    var i,n,x,r=[]
    for(i=0;i<this.data.length;i++){
      x=this.data[i]
      n=[]
      n.push(x[0])
      n.push(x[1])
      n.push(x[0]*x[1])
      n.push(x[0]*x[0])
      n.push(x[1]*x[1])      
      r.push(n)
    }
    return r;
  }
}

class Pol2SvmModel extends SvmModel {
  predictJS(x){
    var n=[]
    n.push(x[0])
    n.push(x[1])
    n.push(x[0]*x[1])
    n.push(x[0]*x[0])
    n.push(x[1]*x[1])
    return this.svm.predict([n])
  }
  predictSQL(c){
    var w=this.svm.w
    var r=""+this.svm.b.toFixed(4)
    r+="+("+c[0]+")*("+w[0].toFixed(4)+")"
    r+="+("+c[1]+")*("+w[1].toFixed(4)+")"
    r+="+("+c[0]+")*("+c[1]+")*("+w[2].toFixed(4)+")"
    r+="+power(("+c[0]+"),2)*("+w[3].toFixed(4)+")"
    r+="+power(("+c[1]+"),2)*("+w[4].toFixed(4)+")"
    return "case when ("+r+")>0 then 1 else -1 end"
  }
}

class Pol2NormSvmLearner extends SvmLearner {
  constructor(nPredict){
    super(nPredict*2,"linear")
    this.algorithm="Svm(pol2-norm)"
    this.minx=0
    this.miny=0
    this.dx=0
    this.dy=0
  }
  modelFactory(){
    var m=new Pol2NormSvmModel()
    m.minx=this.minx
    m.miny=this.miny
    m.dx=this.dx
    m.dy=this.dy
    return m
  }
  normalizeData(){
    var i,d=[],p=this.data[0]
    var maxx=p[0],minx=p[0],maxy=p[1],miny=p[1]
    for(i=1;i<data.length;i++){
      p=this.data[i]
      if (p[0]>maxx) maxx=p[0];
      if (p[0]<minx) minx=p[0];
      if (p[1]>maxy) maxy=p[1];
      if (p[1]<miny) miny=p[1];
    }
    this.dx=maxx-minx
    this.dy=maxy-miny
    this.minx=minx
    this.miny=miny
    for(i=0;i<this.data.length;i++){
      p=this.data[i]
      d.push([this.normalizeX(p[0]),this.normalizeY(p[1]),this.normalizeX(p[0])*this.normalizeY(p[1]),
              this.normalizeX(p[0])*this.normalizeX(p[0]),this.normalizeY(p[1])*this.normalizeY(p[1])])
    }
    return d
  }
  normalizeX(p){
    return (2*(p-this.minx)/this.dx-1)
  }
  normalizeY(p){
    return (2*(p-this.miny)/this.dy-1)
  }
}

class Pol2NormSvmModel extends SvmModel {
  predictJS(x){
    var n=[]
    n.push(this.normalizeX(x[0]))
    n.push(this.normalizeY(x[1]))
    n.push(this.normalizeX(x[0])*this.normalizeY(x[1]))
    n.push(this.normalizeX(x[0])*this.normalizeX(x[0]))
    n.push(this.normalizeY(x[1])*this.normalizeY(x[1]))
    return this.svm.predict([n])
  }
  predictSQL(c){
    var w=this.svm.w
    var r=""+this.svm.b.toFixed(4)
    r+="+((2*("+c[0]+")-("+this.minx.toFixed(4)+"))/"+this.dx.toFixed(4)+"-1)*("+w[0].toFixed(4)+")"
    r+="+((2*("+c[1]+")-("+this.miny.toFixed(4)+"))/"+this.dy.toFixed(4)+"-1)*("+w[1].toFixed(4)+")"
    r+="+((2*("+c[0]+")-("+this.minx.toFixed(4)+"))/"+this.dx.toFixed(4)+"-1)*((2*("+c[1]+")-("+this.miny.toFixed(4)+"))/"+this.dy.toFixed(4)+"-1)*("+w[2].toFixed(4)+")"
    r+="+power(((2*("+c[0]+")-("+this.minx.toFixed(4)+"))/"+this.dx.toFixed(4)+"-1),2)*("+w[3].toFixed(4)+")"
    r+="+power(((2*("+c[1]+")-("+this.miny.toFixed(4)+"))/"+this.dy.toFixed(4)+"-1),2)*("+w[4].toFixed(4)+")"
    return "case when ("+r+")>0 then 1 else -1 end"
  }
  normalizeX(p){
    return (2*(p-this.minx)/this.dx-1)
  }
  normalizeY(p){
    return (2*(p-this.miny)/this.dy-1)
  }
}

class Pol2BariSvmLearner extends SvmLearner {
  constructor(nPredict){
    super(nPredict*2,"linear")
    this.algorithm="Svm(pol2-bari)"
    this.dx=0
    this.dy=0
  }
  modelFactory(){
    var m=new Pol2BariSvmModel()
    m.dx=this.dx
    m.dy=this.dy
    return m
  }
  normalizeData(){
    var i,d=[],p,bax1=0,bay1=0,bax0=0,bay0=0,d0=0,d1=0,n0=0,n1=0
    // cerca i baricentri
    for(i=0;i<this.data.length;i++){
      p=this.data[i]
      if (this.labels[i]==1){
        bax1+=p[0]
        bay1+=p[1]
        n1++
      } else { 
        bax0+=p[0]
        bay0+=p[1]
        n0++
      }
    }
    bax1=bax1/n1
    bay1=bay1/n1
    bax0=bax0/n0
    bay0=bay0/n0
    // misura la dispersione
    for(i=0;i<this.data.length;i++){
      p=this.data[i]
      if(this.labels[i]==1){
        d1+=Math.pow(p[0]-bax1,2)+Math.pow(p[1]-bay1,2)
      } else {
        d0+=Math.pow(p[0]-bax0,2)+Math.pow(p[1]-bay0,2)
      }
    }
    // prende come centro il baricentro della classe meno dispersa
    this.dx=(d1>d0?bax0:bax1)
    this.dy=(d1>d0?bay0:bay1)
    //
    for(i=0;i<this.data.length;i++){
      p=this.data[i]
      var n=[]
      n.push(this.normalizeX(p[0]))
      n.push(this.normalizeY(p[1]))
      n.push(this.normalizeX(p[0])*this.normalizeY(p[1]))
      n.push(this.normalizeX(p[0])*this.normalizeX(p[0]))
      n.push(this.normalizeY(p[1])*this.normalizeY(p[1]))
      d.push(n)
    }
    return d
  }
  normalizeX(p){
    return p-this.dx
  }
  normalizeY(p){
    return p-this.dy
  }
}

class Pol2BariSvmModel extends SvmModel {
  predictJS(x){
    var n=[]
    n.push(this.normalizeX(x[0]))
    n.push(this.normalizeY(x[1]))
    n.push(this.normalizeX(x[0])*this.normalizeY(x[1]))
    n.push(this.normalizeX(x[0])*this.normalizeX(x[0]))
    n.push(this.normalizeY(x[1])*this.normalizeY(x[1]))
    return this.svm.predict([n])
  }
  predictSQL(c){
    var w=this.svm.w
    var r=""+this.svm.b.toFixed(4)
    r+="+("+c[0]+"-("+this.dx.toFixed(4)+"))*("+w[0].toFixed(4)+")"
    r+="+("+c[1]+"-("+this.dy.toFixed(4)+"))*("+w[1].toFixed(4)+")"
    r+="+("+c[0]+"-("+this.dx.toFixed(4)+"))*("+c[1]+"-("+this.dy.toFixed(4)+"))*("+w[2].toFixed(4)+")"
    r+="+power("+c[0]+"-("+this.dx.toFixed(4)+"),2)*("+w[3].toFixed(4)+")"
    r+="+power("+c[1]+"-("+this.dy.toFixed(4)+"),2)*("+w[4].toFixed(4)+")"
    return "case when ("+r+")>0 then 1 else -1 end"
  }
  normalizeX(p){
    return p-this.dx
  }
  normalizeY(p){
    return p-this.dy
  }
}

class Pol3SvmLearner extends SvmLearner {
  constructor(nPredict){
    super(nPredict*2,"linear")
    this.algorithm="Svm(pol3)"
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
    return new Pol3SvmModel()
  }
}

class Pol3SvmModel extends SvmModel {
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
}
