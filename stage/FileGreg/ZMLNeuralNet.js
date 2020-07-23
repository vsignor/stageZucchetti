class NNLearner extends ZMLSupervisedLearner {
  constructor(nPredict){
    super();
    this.algorithm="NeuralNet"
    //
    this.nPredict=nPredict
    this.epochs=5000
    this.data=[]   
    this.labels=[]
  }
  addData(c,x){
    super.addData()
    this.data.push(x)
    this.labels.push(c)
  }
  resetData(){
    super.resetData()
    this.data=[]
    this.labels=[]
  }
  getModel(){
    var layer_defs = [];
    // input layer of size 1x1x2 (all volumes are 3D)
    layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:this.nPredict});
    // some fully connected layers
    layer_defs.push({type:'fc', num_neurons:10, activation:'relu'});
    layer_defs.push({type:'fc', num_neurons:10, activation:'relu'});
    // a softmax classifier predicting probabilities for two classes: 0,1
    layer_defs.push({type:'softmax', num_classes:2});
    // create a net out of it
    var net = new convnetjs.Net();
    net.makeLayers(layer_defs);
    //var trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.9, batch_size:16, l2_decay:0.001});
    var trainer = new convnetjs.Trainer(net, {method: 'adadelta', l2_decay: 0.001,batch_size: 10});
    for(var e=0;e<this.epochs;e++){
      for(var i=0;i<this.data.length;i++) {
         //var x = new convnetjs.Vol(1,1,2,0.0); // a 1x1x2 volume initialized to 0's.
         //x.w[0] = this.data[i][0]; // Vol.w is just a list, it holds your data
         //x.w[1] = this.data[i][1];
         var x = new convnetjs.Vol([this.data[i][0],this.data[i][1]])
         trainer.train(x, (this.labels[i]==1?1:0));
      }
    }
    var m=new NNModel()
    m.net=net
    return m
  }
}

class NNModel extends ZMLModel {
  constructor(nPredict){
    super()
    this.learner="NeuralNet"
    //
    this.nPredict=nPredict
    this.net=null
  }
  predictJS(x){
     var v = new convnetjs.Vol([x[0],x[1]]);
     var p = this.net.forward(v);
     return (p.w[0]>0.5?-1:1)
  }
}
