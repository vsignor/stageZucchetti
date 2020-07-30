class ZMLLearner {
  constructor() {
    this.name=''
    this.algorithm=''
    this.trainDate=null
  }
  addData(){this.trainDate=null;}
  resetData(){this.trainDate=null;}
  addDataBlock(){throw new Error('not implemented.')}
  trainFromVQR(){throw new Error('not implemented.')}
  trainFromCSV(){throw new Error('not implemented.')}
  // ---
  train(){this.trainDate=new Date();}
  retrain(){throw new Error('not implemented.')}
  //
  getModel(){throw new Error('not implemented.')}
  saveModelFile(){throw new Error('not implemented.')}
  saveLearnerFile(){throw new Error('not implemented.')}
  readLearnerFile(){throw new Error('not implemented.')}
}

class ZMLModel {
  constructor() {
    this.expirationDate=null
    this.learner=''    
  }
  readModelFile(){throw new Error('not implemented.')}
  //
  predictJS(){throw new Error('not implemented.')}
  predictJava(){throw new Error('not implemented.')}
  predictSQL(){throw new Error('not implemented.')}
}

class ZMLSupervisedLearner extends ZMLLearner {
  addData(y,x){super.addData()}
  resetData(y,x){super.resetData()}
}

// da fare: regressione lineare, SVM, Regressione Logistica, Random Forest

class ZMLUnsupervisedLearner extends ZMLLearner {
  addData(x){super.addData()}
  resetData(){super.resetData()}
}

// da fare: k-means, Abc 
