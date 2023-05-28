import streamlit as sl
from matplotlib import pyplot
import seaborn as sns
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# to show the plot between glucose, BMI, Age and Outcome
fig=pyplot.figure(figsize = (15,10))
sl.header("Diabetes Heatmap")
sl.write("")
sns.heatmap (diabetesData.corr(), annot=True, fmt = ".2f", cmap = "cool")
sl.write(fig)
pyplot.show()