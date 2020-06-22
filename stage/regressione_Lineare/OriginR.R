library(datasets)
data(iris)

help(iris) ##mi da' informazioni sul dataset
summary(iris) ##mi permette di vedere la "tabella" di iris
dim(iris) ##mi dice che ho  entry con 5 colonne in totale
n <- nrow(iris) ##assegno ad n=150
n #stampo n

summary(iris$Petal.Width) ##mi da' informazioni utili sulla variabile (mediana, quartili ecc.) 

plot(iris$Petal.Length,iris$Sepal.Width) ##mostra il grafico (x, y): noto che vi e' una buona separazione dei dati

plot(iris) #mostra i vari grafici di iris; posso capire quali sono gli assi che di volta in volta mostrano una distribuzione migliore dei punti, es. y=Petal.Lenght  e x=Petal.Width

lm(Sepal.Length ~ Petal.Width, data=iris) ##creo il modello di regressione (y, predittore), inoltre mi da' info utili su intercetta e corfficiente angolare

modello <- lm(Sepal.Length ~ Petal.Width, data=iris) ##assegno il modello a una variabile cosi la posso usare con piu' seemplicita'
summary(modello) ##mi da' info utili sulla regressione fatta + grafico

plot(modello) 

modello1<-lm(Sepal.Length ~ Petal.Length+Petal.Width, data=iris)  ## pw non e' significativo e R= 0.76
summary(modello1)
 
 modello5<-lm(Sepal.Length ~ Petal.Length, data=iris) ##R=0.76
 
 modello2<- lm(Sepal.Length ~ Sepal.Width+Petal.Width, data=iris) ## tutti significativi e 2 e R=0.707
 summary(modello2)
 
 modello3 <- (lm(Sepal.Length ~ Petal.Length+Sepal.Width, data=iris)) ## significativi entrambi e R= 0.84
 summary(modello3)

 anova(modello, modello1)
 anova(modello, modello2)
 
 
 bk<-lm(Sepal.Length ~ Petal.Length+Petal.Width+Sepal.Width, data=iris) ## tutti 3 e R=0.85 --> BEST, lo capisco anche facendo backword selection
 summary(bk)
 sunmmary(update(bk))
 
 plot(bk)
 
 valori.stimati <- fitted(bk)
 plot(iris$Petal.Length, iris$Sepal.Length, xlab="petal length", ylab='sepal length')  ## aggiungiamo i valori stimati
 points(iris$Petal.Length, valori.stimati, pch='x', col='green') ## aggiungiamo la retta stimata ai minimi quadrati  points(x, …)
 abline(coef(bk)[1], coef(bk)[2], lty=2, col='red', lwd=3) ## equivale a abline(beta0, beta1, lty=2, col='red')
 
 modello6 <- lm(Sepal.Length ~ log(Petal.Length), data=iris)
 summary(modello6)
 plot(iris$Petal.Length, iris$Sepal.Length)
 lines(iris$Petal.Length, predict(modello6), col="magenta")
 
 modello5<-lm(Sepal.Length ~ Petal.Length, data=iris) ##R=0.76
 valori.stimati<-fitted(modello5)
 plot(iris$Petal.Length, iris$Sepal.Length, xlab='petal length', ylab='sepal length')
 points(iris$Petal.Length, valori.stimati, pch='x', col='green')
 abline(coef(modello5)[1], coef(modello5)[2], lty=2, col='red', lwd=3)
 
 valori.stimati<-fitted(modello3)
 plot(iris$Sepal.Width, iris$Sepal.Length, xlab='sepal width', ylab='sepal length')
 points(iris$Sepal.Width, valori.stimati, pch='x', col='green')
 abline(coef(modello3)[1], coef(modello3)[3], lty=2, col='red', lwd=3)
 

 


 ##ESEMPIO BOSTON
 library(MASS)
 data(Boston)
 hist(Boston$medv, prob=TRUE, xlab='Prezzo mediano delle abitazioni',  main='Istogramma')
 plot(Boston$medv, prob=TRUE, xlab='Prezzo mediano delle abitazioni',  main='grafico a punti')
 plot(Boston$medv, Boston$lstat, main='Diagramma di dispersione med vs lstat', xlab='% di proprietari con basso stato socioeconomico', ylab='Prezzo mediano', pch=19, cex=0.5)
 cor(Boston$medv, Boston$lstat) ##mostra la correlazione fra le variabili
 modello <- lm(medv ~ lstat, data=Boston)
 valori.stimati <- fitted(modello)
 plot(Boston$lstat, Boston$medv, pch=19, cex=0.5, xlab='% proprietari con basso stato socioeconomico',  ylab='Prezzo mediano')  ## aggiungiamo i valori stimati
 points(Boston$lstat, valori.stimati, pch='x', col='green')  ## aggiungiamo la retta stimata ai minimi quadrati
 abline(coef(modello)[1], coef(modello)[2], lty=2, col='red', lwd=3) ## equivale a abline(beta0, beta1, lty=2, col='red')