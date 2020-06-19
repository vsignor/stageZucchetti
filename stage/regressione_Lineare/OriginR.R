library(datasets)
data(iris)

##help(iris) ##mi da' informazioni sul dataset
summary(iris) ##mi permette di vedere la "tabella" di iris
##dim(iris) ##mi dice che ho  entry con 5 colonne in totale
##n <- nrow(iris) ##assegno ad n=150
##n #stampo n

##summary(iris$Petal.Width) ##mi da' informazioni utili sulla variabile (mediana, quartili ecc.) 

plot(iris$Petal.Length,iris$Sepal.Width) ##mostra il grafico (x, y): noto che vi e' una buona separazione dei dati

##plot(iris) #mostra i vari grafici di iris; posso capire quali sono gli assi che di volta in volta mostrano una distribuzione migliore dei punti, es. y=Petal.Lenght  e x=Petal.Width

##lm(Sepal.Length ~ Petal.Width, data=iris) ##creo il modello di regressione (y, predittore), inoltre mi da' info utili su intercetta e corfficiente angolare

modello <- lm(Sepal.Length ~ Petal.Width, data=iris) ##assegno il modello a una variabile cosi la posso usare con piu' seemplicita'

##summary(modello) ##mi da' info utili sulla regressione fatta + grafico

plot(modello) 