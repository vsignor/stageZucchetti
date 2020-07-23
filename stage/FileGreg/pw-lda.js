/* 
https://github.com/pwstegman/pw-lda
MIT license
*/

/**
 * An LDA object.
 * @constructor
 * @param {...number[][]} classes - Each parameter is a 2d class array. In each class array, rows are samples, columns are variables.
 * @example
 * let classifier = new LinearDiscriminantAnalysis(class1, class2, class3);
 */

class LinearDiscriminantAnalysis {
  
  constructor(...classes) {
    // Compute pairwise LDA classes (needed for multiclass LDA)
    if(classes.length < 2) {
      throw new Error('Please pass at least 2 classes');
    }

    let numberOfPairs = classes.length * (classes.length - 1) / 2;
    let pair1 = 0;
    let pair2 = 1;

    let pairs = new Array(numberOfPairs);

    for(let i = 0; i < numberOfPairs; i++){
      pairs[i] = this.computeLdaParams(classes[pair1], classes[pair2], pair1, pair2);

      pair2++;
      if(pair2 == classes.length) {
        pair1++;
        pair2 = pair1 + 1;
      }
    } 

    this.pairs = pairs;
    this.numberOfClasses = classes.length;
  }

  computeLdaParams(class1, class2, class1id, class2id) {
    let mu1 = this.mean(class1);
    let mu2 = this.mean(class2);
    let pooledCov = numeric.add(this.cov(class1), this.cov(class2));
    let theta = numeric.dot(numeric.inv(pooledCov), numeric.sub(mu2, mu1));
    let b = numeric.mul(numeric.dot(numeric.mul(-1, theta), numeric.add(mu1, mu2)), 1 / 2);
    return {
      theta: theta,
      b: b,
      class1id: class1id,
      class2id: class2id
    }
    /*
    let mu1M = math.transpose(this.meanM(class1));
    let mu2M = math.transpose(this.meanM(class2));
    let pooledCovM = math.add(this.covM(class1), this.covM(class2));
    let thetaM = math.multiply(math.inv(pooledCovM), math.subtract(mu2M, mu1M));
    let bM = math.multiply(-1, math.transpose(thetaM), math.add(mu1M, mu2M), 1 / 2);
    */
    /*
    return {
      theta: thetaM,
      b: bM.get([0,0]),
      class1id: class1id,
      class2id: class2id
    }
    */
  }

  /**
   * Project the unknown data point to one dimension.
   * Currently only supports binary LDA.
   * @param {number[]} point - The data point to be projected.
   * @returns {number} value less than 0 if predicted to be in class 1, 0 if exactly in between, greater than 0 if class 2
   */
  project(point) {
    if(this.pairs.length != 1) {
      throw new Error('LDA project currently only supports 2 classes. LDA classify can be used to perform multiclass classification.');
    }

    return projectPoint(point, this.pairs[0].theta, this.pairs[0].b);
  }

  projectPoint(point, theta, b) {
    var r = numeric.add(numeric.dot(point,theta),b)
    return r;
    //var rM=math.add(math.multiply(point, theta), b);
    //return rM.get([0]);
  }

  /**
   * Classify an unknown point. Uses a pairwise voting system in the event of multiclass classification.
   * @param {number[]} point - The data point to be classified.
   * @returns {number} Returns the predicted class. Class numbers range from 0 to (number_of_classes - 1).
   */
  classify(point) {
    // In the event of a binary classifier, skip the voting process
    if(this.numberOfClasses == 2) {
      return this.projectPoint(point, this.pairs[0].theta, this.pairs[0].b) <= 0 ? 0 : 1;
    }

    // Start each class with 0 votes
    let votes = new Array(this.numberOfClasses);
    for(let i = 0; i < this.numberOfClasses; i++) {
      votes[i] = 0;
    }

    // Allow each pair to cast a vote
    for(let i = 0; i < this.pairs.length; i++) {
      let params = this.pairs[i];
      let projection = this.projectPoint(point, params.theta, params.b);

      if(projection <= 0) {
        votes[params.class1id]++;
      } else {
        votes[params.class2id]++;
      }
    }

    // Find the winning class
    let classification = 0;
    let maxVotes = votes[0];
    for(let i = 1; i < votes.length; i++){
      if(votes[i] > maxVotes) {
        classification = i;
        maxVotes = votes[i];
      }
    }

    return classification;
  }
  /*
  covM(a) {
    a=math.matrix(a)
    // From https://math.stackexchange.com/questions/561340/how-to-calculate-the-covariance-matrix
    var n = a.size()[0];
    var x = math.subtract(a, math.multiply((1 / n), math.ones(n, 1), math.ones(1, n), a));
    var y = math.multiply(math.transpose(x), x);
    return math.multiply(1 / (n - 1), y);
  }
  meanM(a) {
    a=math.matrix(a)
    // Compute the mean of each column
    var result = math.zeros(1, a.size()[1]);
    var n = a.size()[0];
    for (var i = 0; i < n; i++) {
      result = math.add(result, math.matrix([a.toArray()[i]]));
    }
    return math.multiply(1 / n, result);
  }
  */
  cov(a) {
    // From https://math.stackexchange.com/questions/561340/how-to-calculate-the-covariance-matrix
    var n = numeric.dim(a)[0]
    var x = numeric.sub(a,numeric.mul((1/n) , numeric.dot(numeric.dot(numeric.rep([n,1],1),numeric.rep([1,n],1)),a)))
    var y = numeric.dot(numeric.transpose(x),x)
    return numeric.mul(1/(n-1),y)
  }
  mean(a) {
    var m=[],i,j
    var rows=a.length,cols=a[0].length
    for(i=0;i<cols;i++)
      m.push(0)
    for(var i=0;i<rows;i++){
      var aa=a[i]
      for(j=0;j<cols;j++)
        m[j]+=aa[j]
    }
    for(i=0;i<cols;i++)
      m[i]=m[i]/rows
    return m
  }
  
}

class OneClassGaussian {
  constructor(data){
    this.mu=this.mean(data)
    var sigma=this.cov(data,this.mu)
    var det=numeric.det(sigma)
    this.isigma=numeric.inv(sigma)
    this.coeff=1/Math.sqrt(2*Math.PI*det) 
    /*
    this.muM=math.matrix(this.meanM(data)._data[0])
    var sigmaM=this.covM(data)
    var detM=math.det(sigmaM)
    this.isigmaM=math.inv(sigmaM)
    this.coeffM=1/Math.sqrt(2*Math.PI*detM) 
    */
  }
  density(x){
    var am=numeric.sub(x,this.mu)
    return Math.exp(-numeric.dot(numeric.dot(am,this.isigma),am)/2)*this.coeff
    // calcolo diretto nel caso di due dimensioni ... forse si riesce a fare anche in SQL
    //var theta=this.isigma
    //var rr = Math.exp(-(am[0]*am[0]*theta[0][0]+am[0]*am[1]*(theta[0][1]+theta[1][0])+am[1]*am[1]*theta[1][1])/2)*this.coeff
    /*
    var a=math.matrix(x)
    var amM=math.subtract(a,this.muM)
    var rM=Math.exp(-math.multiply(math.multiply(math.transpose(amM),this.isigmaM),amM)/2)*this.coeffM
    return rM
    */
  }
  cov(a,mu) {
    // From https://math.stackexchange.com/questions/561340/how-to-calculate-the-covariance-matrix
    var n = numeric.dim(a)[0],x,xm
    if (mu) {
      x = []
      for(var i=0;i<n;i++){
        x.push([])
        for(var j=0;j<a[0].length;j++)
          x[i][j]=a[i][j]-mu[j]
      }
    } else {
      x = numeric.sub(a,numeric.mul((1/n) , numeric.dot(numeric.dot(numeric.rep([n,1],1),numeric.rep([1,n],1)),a)))
    }
    var y = numeric.dot(numeric.transpose(x),x)
    return numeric.mul(1/(n-1),y)
  }
  /*
  covM(a){
    a=math.matrix(a)
    // From https://math.stackexchange.com/questions/561340/how-to-calculate-the-covariance-matrix
    var n = a.size()[0];
    var x = math.subtract(a, math.multiply((1 / n), math.ones(n, 1), math.ones(1, n), a));
    var y = math.multiply(math.transpose(x), x);
    return math.multiply(1 / (n - 1), y);
  }
  */
  mean(a) {
    var m=[],i,j
    var rows=a.length,cols=a[0].length
    for(i=0;i<cols;i++)
      m.push(0)
    for(var i=0;i<rows;i++){
      var aa=a[i]
      for(j=0;j<cols;j++)
        m[j]+=aa[j]
    }
    for(i=0;i<cols;i++)
      m[i]=m[i]/rows
    return m
  }
  /*
  meanM(a){
    a=math.matrix(a)
    // Compute the mean of each column
    var result = math.zeros(1, a.size()[1]);
    var n = a.size()[0];
    for (var i = 0; i < n; i++) {
      result = math.add(result, math.matrix([a.toArray()[i]]));
    }
    return math.multiply(1 / n, result);
  }
  */
}

class QuadraticDiscriminantAnalysis {
  constructor(...classes){
    this.gaussians=[]
    for(var i=0;i<classes.length;i++){
      var g=new OneClassGaussian(classes[i])
      this.gaussians.push(g)
    }
  }
  classify(point){
    var max=0,id=null
    for(var i=0;i<this.gaussians.length;i++){
      var p=this.gaussians[i].density(point)
      if(p>max) {
        max=p
        id=i
      }
    }
    return id
  }
}
