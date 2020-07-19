class ZMLLearner {
  constructor() {
    this.name=''
    this.algorithm=''
    this.trainDate=null
  }
  addData(){throw new Error('not implemented.')}
  resetData(){throw new Error('not implemented.')}
  addDataBlock(){throw new Error('not implemented.')}
  trainFromVQR(){throw new Error('not implemented.')}
  trainFromCSV(){throw new Error('not implemented.')}
  resetData(){throw new Error('not implemented.')}
  // ---
  train(){throw new Error('not implemented.')}
  retrain(){throw new Error('not implemented.')}
  //
  getModel(){throw new Error('not implemented.')}
  saveModelFile(){throw new Error('not implemented.')}
  saveLearnerFile(){throw new Error('not implemented.')}
  readLearnerFile(){throw new Error('not implemented.')}
  cleanGrafico(){throw new Error('not implemented.')}
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
  addData(y,x){throw new Error('not implemented.')}
  resetData(){throw new Error('not implemented.')}
  cleanGrafico(){throw new Error('not implemented.')}
}

// da fare: regressione lineare, SVM, Regressione Logistica, Random Forest

class ZMLUnsupervisedLearner extends ZMLLearner {
  addData(x){throw new Error('not implemented.')}
  resetData(){throw new Error('not implemented.')}
  cleanGrafico(){throw new Error('not implemented.')}
}

// da fare: k-means, Abc 