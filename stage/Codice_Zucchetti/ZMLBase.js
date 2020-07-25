class ZMLLearner {
  constructor() {
    this.name=''
    this.algorithm=''
    this.trainDate=null
  }
  addData(){this.trainDate=null;}
  addDataBlock(){this.trainDate=null;}
  trainFromVQR(){throw new Error('not implemented.')}
  trainFromCSV(){throw new Error('not implemented.')}
  resetData(){this.trainDate=null;}
  // ---
  train(){this.trainDate=new Date();}
  retrain(){throw new Error('not implemented.')}
  ensureTrained(){if(this.trainDate==null) this.train();}
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
  addData(y,x){super.addData();}
}

// da fare: regressione lineare, SVM, Regressione Logistica, Random Forest

class ZMLUnsupervisedLearner extends ZMLLearner {
  addData(x){super.addData();}
}

// da fare: k-means, Abc 