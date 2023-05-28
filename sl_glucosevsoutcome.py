import streamlit as sl
from matplotlib import pyplot
import seaborn as sns
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# to show the plot between glucose, BMI, Age and Outcome
fig=pyplot.rcParams['figure.figsize'] = [45, 30]
sns.pairplot(data = diabetesData, vars=['Glucose'], hue = 'Outcome')
sl.header("Relation of Diabetic condition with Glucose Level")
sl.write("This scatterplot defines the correlation of people having/not having diabetes with their glucose level, BMI and age. From this graph we can clearly see a positive correlation between glucose level and diabetes. Here blue dots represent people who don't have diabetes and the orange dots represent the people who have diabetes.")
sl.write(fig)
pyplot.show()
