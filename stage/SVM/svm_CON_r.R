library(tidyverse)    # data manipulation and visualization
library(kernlab)      # SVM methodology
library(e1071)        # SVM methodology
library(ISLR)         # contains example data set "Khan"
library(RColorBrewer) # customized coloring of plots



##genero 40 osservazioni casuali e le assegno a due classi -> esistono infinite linee che dividono le due classi.

x <- matrix(rnorm(20*2), ncol = 2) 
y <- c(rep(-1,10), rep(1,10))  ##rep(-1,10) replica il numero -1 per 10 volte
x[y==1,] <- x[y==1,] + 3/2
dat <- data.frame(x=x, y=as.factor(y))

# Plot data
ggplot(data = dat, aes(x = x.2, y = x.1, color = y, shape = y)) + 
  geom_point(size = 2) +
  scale_color_manual(values=c("#000000", "#FF0000")) +
  theme(legend.position = "none")

