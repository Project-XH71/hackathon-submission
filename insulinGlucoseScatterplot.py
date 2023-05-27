import numpy as np 
import pandas as pd 
from matplotlib import pyplot
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# shows the relation between glucose and insulin
import seaborn as sns
sns.scatterplot(x = 'Glucose', y = 'Insulin', data = diabetesData, alpha = 0.7, hue = 'Outcome')
pyplot.show()