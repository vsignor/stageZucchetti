library(tidyverse)
library(caret)


data("swiss")
##swiss
sample_n(swiss, 3) ##seleziono 3 osservazioni di swiss
set.seed(123) 

train.control <- trainControl(method = "cv", number = 10) ##ricampionamento
modello <- train(Fertility ~., data = swiss, method = "lm", trControl = train.control)
print(modello)
## mi da' RMSE R^2 e MAE


##MSE (Mean Squared Error) = differenza tra i valori originali e previsti estratti da quadrati.
##RMSE (Root Mean Squared Error) = tasso di errore della radice quadrata di MSE.
##MAE (errore assoluto medio) = differenza tra i valori originali e previsti estratti dalla media della differenza assoluta 
                                ##rispetto al set di dati.

##posso fare anche il metodo k-folt con ripetizioni: es. 3 ripetizioni

set.seed(123)
train.control <- trainControl(method = "repeatedcv", number = 10, repeats = 3) ##aumentando gli errori tendondono a crescere 
                                                      ##rimanendo sempre inferiori a quello con k-foult senza ripetizioni
modello1 <- train(Fertility ~., data = swiss, method = "lm", trControl = train.control)
print(modello1)

##differenze rispetto a prima 
##-> L'errore del modello finale viene considerato come errore medio dal numero di ripetizioni;
##-> Da' dei valori piu' sicuri prorio perche' svolge una ripetizione;
##-> Osservo che la bonta' del modello tende a salire e gli errori a calare.

##in generale: 
##In genere consigliamo la convalida incrociata (ripetuta) k-fold per stimare il tasso di errore di previsione. 
