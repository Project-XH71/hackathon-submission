import numpy as np 
import pandas as pd 
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')
# Determine the type of ‘data’
print(type(diabetesData))

# To display the histograms
from matplotlib import pyplot
# setting the figure size
pyplot.rcParams['figure.figsize'] = [15, 15];
diabetesData.hist()
pyplot.show()

# shows the relation between glucose and insulin
import seaborn as sns
sns.scatterplot(x = 'Glucose', y = 'Insulin', data = diabetesData, alpha = 0.7, hue = 'Outcome')
pyplot.show()