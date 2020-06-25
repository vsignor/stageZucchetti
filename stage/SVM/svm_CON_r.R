library(tidyverse)    # data manipulation and visualization
library(kernlab)      # SVM methodology
library(e1071)        # SVM methodology
library(ISLR)         # contains example data set "Khan"
library(RColorBrewer) # customized coloring of plots


##DISTRIBUZIONE LIENARE: TROVO IL CLASSIFICATORE MAX
##genero 40 osservazioni casuali e le assegno a due classi -> esistono infinite linee che dividono le due classi

## il  fattore è un tipo di dato che permette di etichettare un gruppo di osservazioni utilizzando delle categorie 
    ##predefinite al fine di ragrupparle (es. sesso = m/f oppure anche 0/1)

set.seed(10) ##essendo che voglio risultati riproducibili e non casuali, imposto il seme
x <- matrix(rnorm(20*2), nrow=20, ncol=2) ##array di 40 el., 2 colonne 20 righe
##x
y <- c(rep(-1,10), rep(1,10))  ##rep(-1,10) replica il numero -1 per 10 volte: c=-1,-1,...,1,1
##y                     
x[y==1,] <- x[y==1,] + 1  ##Per y=1, sposta le medie da 0 a 1 in ciascuna delle coordinate.
plot(x, pch = 17, col=y+3, cex=1.5)   ##mi da rosso o blu in base a se in y c'e' 1 o -1

dat <- data.frame(x=x, y = as.factor(y)) ##trasformando y (-1, 1) diventa la mia var fattore   
                                  ##il frame decomprime la matrice x in 2 colonne denominate x1 e x2 (predittori)
# Plot data
ggplot(data = dat, aes(x = x.2, y = x.1, color = y, shape = y)) + ##meta' di una forma/colore e meta' dell'altro
  geom_point(size = 2.5) +
  scale_color_manual(values=c("green", "magenta"))

##Successivamente, si effettua una chiamata svm sul frame, dove y=variabile risp. e altre variabili come predittori. 
##Dite a SVM che il kernel è lineare, il costo del parametro di sintonizzazione è 10 e la scala è uguale a falsa. 
##In questo esempio, viene richiesto di non standardizzare le variabili.

svmfit <- svm(y~., data = dat, kernel = "linear", scale = FALSE)  ##x sono i vettori di supporto che incidono 
                                                    ##sulla linea di classificazione mentre i cerchi sono gli altri dati
                                                    ##che non incidono sul calcolo della linea

plot(svmfit, dat)     ##vedo che ho 6 verroti di supporto!!!                                
print(svmfit) ##riepilogo -> ho 6 vettori di supporto (li vedo anche dalle x)  

kernfit <- ksvm(x, y, type = "C-svc", kernel = 'vanilladot') ##le figure nere sono i vettori di supporto ovvero i dati che influiscono sul calcolo della linea 
## mentre gli altri non influiscono sul calcolo
plot(kernfit, data = x) ##anche qui mi conferma che ho 6 vettori di supporto!!!

##creo la trama di punti x1 e x2 che mi servira' per fare la predizione dei punti piu'influenti -> e' qui che si fa previsione 
make.grid = function(x, n = 25*25) { ## griglia 25*25
  rang = apply(x, 2, range) ##ally(X, MARGIN, fun)  dove MARGIN=1 row, MARGIN=2 col -> mi da' gli intervalli per colonna
  x1 = seq(from = rang[1,1], to = rang[2,1], length = n) ##creo una sequenza dal lim min al lim max
  x2 = seq(from = rang[2,1], to = rang[2,2], length = n) ##distribuzione omogenea
  expand.grid(X1 = x1, X2 = x2) ##incasta tutto il reticolo 
}
xgrid = make.grid(x)
xgrid[1:10,] ##prime 10 osservazioni

ygrid = predict(svmfit, xgrid) ##faccio la predizione 
plot(xgrid, col = c("red","blue")[as.numeric(ygrid)]) ##mi converte la variabile fattore in numero
plot(x, pch = 17, col=y+3, cex=1.5) ##metto i punti originari
points(x[svmfit$index,], pch = 5, cex=2.5) ##index  indica quali sono i punti di supporto. 
                                            