library("e1071")
library(GGally)
library(ggplot2)

data(iris)

svm_model <- svm(Species ~ ., data=iris, kernel="linear") #linear/polynomial/sigmoid
summary(svm_model) ##29 vettori di supporto - classi 3

ggpairs(iris, ggplot2::aes(colour = Species)) ##matrice di grafici


##dagli Istogrammi di Petal.length e Petal.width noto che possiamo chiaramente separare le specie Setosa con la massima fiducia
##(estrema sx); le specie Versicolor e Virginica sono invece sovrapposte. Se osserviamo il grafico a dispersione di 
##(Sepal.Length, Petal.Length e (Petal.Length, Petal.Width) possiamo chiaramente vedere un separatore che può essere disegnato 
##tra i gruppi di Specie.
##Petal.Width e Petal.Length sono quindi buoni parametri per ottenere un buon modello (l'ho capisco anche dallo scatter plot). SVM sembra essere un ottimo modello per questo tipo di dati.

plot(svm_model, data=iris, Petal.Width~Petal.Length)

pred = predict(svm_model,iris)  ##predizione
system.time(pred <- predict(svm_model, iris)) ##tempo di esecuzione 

tab = table(Predicted=pred, Real=iris$Species)
tab