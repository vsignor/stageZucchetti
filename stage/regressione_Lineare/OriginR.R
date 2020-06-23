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
 
 bk<-lm(Sepal.Length ~ Petal.Length+Petal.Width+Sepal.Width, data=iris) ## tutti 3 e R=0.85 --> BEST, lo capisco anche facendo backword selection
 summary(bk)
 sunmmary(update(bk))
 
 plot(bk)
 
 modello6 <- lm(Sepal.Length ~ log(Petal.Length), data=iris)
 summary(modello6)
 plot(iris$Petal.Length, iris$Sepal.Length)  ##logaritmo
 lines(iris$Petal.Length, predict(modello6), col="magenta")
 
 modello5<-lm(Sepal.Length ~ Petal.Length, data=iris) ##R=0.76
 valori.stimati<-fitted(modello5)
 plot(iris$Petal.Length, iris$Sepal.Length, xlab='petal length', ylab='sepal length')
 points(iris$Petal.Length, valori.stimati, pch='x', col='green')
 abline(coef(modello5)[1], coef(modello5)[2], lty=2, col='red', lwd=3)
 
 install.packages("scatterplot3d", dependencies = TRUE) ##ti serve questa libreria in teoria per fare la rl mulvariata

 library(scatterplot3d) ## (X1, X2, Y)  --> utile se 2 regressori
 multv <- scatterplot3d(Iris$x1, Iris$x2, Iris$y, pch=16)
 
 library(car)
 ceresPlots(bk) ##multivariato
 
 
 ##confronto fra modelli
 modello5<-lm(Sepal.Length ~ Petal.Length, data=iris) 
 bk ##possiede 2 regressori significativi che mi portano a rifiutare h0 (se faccio l'opposto mi dice che le -2 variabili che tolgo sono comunque significative e quindi vale sempre bk)
 
 modello7 <- lm(Sepal.Length ~ Petal.Length, data=iris)
 modello1 <- lm(Sepal.Length ~ Petal.Length + Petal.Width , data=iris) ##aggiungere width non dovrebbe portare contributi significativi
 anova(modello7, modello1) # confermato
 
 modello <- lm(Sepal.Length ~ Petal.Width, data=iris)
 modello1 <- lm(Sepal.Length ~ Petal.Width + Petal.Length , data=iris) ## qui il peso di width non e' cosi forte ma lenght dovrebbe essere importante
 anova(modello, modello1) # confermato
 
 
 ##valori discreti
 modello8<-lm(Sepal.Length ~ Petal.Length+Petal.Width+Sepal.Width+Species, data=iris)
 summary(modello8)
 
 library(RGraphics)
 library(grid)
 library(gridExtra)
 library(ggplot2) 
 ##grafici carini in base alle specie
 g1<-ggplot(iris,aes(x=Sepal.Width,y=Sepal.Length, shape=Species, color=Species))+
         geom_point(size=2.5)
 g2<-ggplot(iris,aes(x=Petal.Width,y=Sepal.Length, shape=Species, color=Species))+
         geom_point(size=2.5)
 g3<-ggplot(iris,aes(x=Petal.Length,y=Sepal.Length, shape=Species, color=Species))+
         geom_point(size=2.5)
 
 grid.arrange(g1,g2,g3, nrow=2, ncol=2,  top = "Species Distributions")
 
 
 ##ESEMPIO BOSTON: regressione lineare semplice
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
 
 ##TRASFORMAZIONE DI MODELLI: Metodo Box Cop
 library(MASS)
 
 bk<-lm(Sepal.Length ~ Petal.Length+Petal.Width+Sepal.Width, data=iris) 
 boxcox(bk, plotit=T) ## grafico per individuare il valore di lamda
 
 trasy<-((mortalal^0.1)-1)/0.1    ## trasformata
 bktras<-lm(trasy~Petal.Length+Petal.Width+Sepal.Width, data=iris)
 summary(bktras) 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 