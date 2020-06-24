library(datasets)
library(MASS)
cars(data)

plot(cars)
plot(cars$dist, cars$speed)
plot(cars$speed, cars$dist)

modello <- lm(dist ~  speed, data=cars) ##R2=0.6511, speed e' un regressore significativo
summary(modello)
plot(modello) ##guardo i vari plot e faccio considerazioni su normalita' e omoschedasticita'

bc <- boxcox(modello, lambda = seq(-3, 3)) ##trasformata, mi da lamda
## lamda puo' assumere qualunque valore da -3 a +3, comunque per valori <-2 e >2 mnon ha seso applicare box-cox

lambda <- bc$x[which(bc$y==max(bc$y))] ##0.4545
summary(lambda)

trasf <- (((cars$dist)^lambda)-1)/lambda

model.inv <- lm(trasf ~ speed, data=cars)
plot(model.inv)
summary(model.inv)