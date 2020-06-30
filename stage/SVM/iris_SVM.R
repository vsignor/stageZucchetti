library("e1071")
library(GGally)
library(ggplot2)

set.seed(42)
data(iris)
head(iris, 20)

ggplot(iris, aes(x = Petal.Length, y = Petal.Width, colour = Species)) +
  geom_point() +
  labs(title = 'Petal Length vs Petal Width')

#oppure
ggpairs(iris, ggplot2::aes(colour = Species)) ##matrice di grafici


##dagli Istogrammi di Petal.length e Petal.width noto che possiamo chiaramente separare le specie Setosa con la massima 
##fiducia (estrema sx); le specie Versicolor e Virginica sono invece sovrapposte -> Petal.Width e Petal.Length sono
# buoni parametri per ottenere un buon modello.

##creazione del modello
sp = sample(150, 100) ##in 150 vado a prendere un sottoinsieme de 100

train = iris[sp, c("Petal.Length", "Petal.Width", "Species")]
test = iris[-sp, c("Petal.Length", "Petal.Width", "Species")]
##dim(test) --> 50,3  dim(train) --> 100,3

##svm(formula, data= , kernel= , cost= , scale= )
##cost indica quanto vuoi evitare di classificare erroneamente ogni esempio di addestramento
##Piu' lo metto grande e piu' diminuisce il numero di vettori di supporto

svm.model.linear <- svm(Species ~ ., data=train, kernel="linear", cost = 0.1, scale = FALSE) ## addestramento
svm.model.linear ##mi indica 47 vettori di supporto

plot(svm.model.linear, train)

tab.l <- table(Prediction=predict(svm.model.linear, train), Real=train$Species) ##confusion matrix
tab.l 
1-sum(diag(tab.l)/sum(tab.l)) ##tasso di classificazione errata 0.04

svm.model.poly <-  svm(Species ~ ., data=train, kernel="polynomial", cost = 0.1, scale = FALSE) ## addestramento
svm.model.poly ##12 vettori di supporto
plot(svm.model.poly, train)

tab.p <- table(Prediction=predict(svm.model.poly, train), Real=train$Species) 
tab.p
1-sum(diag(tab.p)/sum(tab.p)) ##tasso di classificazione errata 0.04

svm.model.rad <- svm(Species ~ ., data=train, kernel='radial')
svm.model.rad
plot(svm.model.rad, train)## 30

tab.r <- table(Prediction=predict(svm.model.rad, train), Real=train$Species) ##confusion matrixtab.r
1-sum(diag(tab.r)/sum(tab.r)) ##tasso di classificazione errata 0.04

svm.model.sig <- svm(Species ~ ., data = train, kernel = 'sigmoid')
svm.model.sig
plot(svm.model.sig, train)## 41

tab.s <- table(Prediction=predict(svm.model.sig, train), Real=train$Species) ##confusion matrix
tab.s
1-sum(diag(tab.s)/sum(tab.s)) ##tasso di classificazione errata 0.13


##confronto fra piu' modelli lineari
sp = sample(150, 100) ##in 150 vado a prendere un sottoinsieme de 100

train = iris[sp, c("Petal.Length", "Petal.Width", "Sepal.Length", "Sepal.Width", "Species")] 
test = iris[-sp, c("Petal.Length", "Petal.Width", "Sepal.Length", "Sepal.Width", "Species")]

model1 = svm(formula = Species~., data = train, kernel = 'linear')
model2 = svm(formula = Species~ Petal.Width + Petal.Length, data = train, kernel = 'linear')

summary(model1) ##22
summary(model2) ##26

tab.mod1 <- table(Prediction=predict(model1, train), Real=train$Species) ##confusion matrix
tab.mod1 
1-sum(diag(tab.mod1)/sum(tab.mod1)) ##tasso di classificazione errata 0.04

tab.mod2 <- table(Prediction=predict(model2, train), Real=train$Species) ##confusion matrix
tab.mod2
1-sum(diag(tab.mod2)/sum(tab.mod2)) ##tasso di classificazione errata 0.06

##entrambi sono modelli solidi, comunque il primo e' meglio






