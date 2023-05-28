import streamlit as sl
from matplotlib import pyplot
import seaborn as sns
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# to show the plot between glucose, BMI, Age and Outcome
pyplot.rcParams['figure.figsize'] = [45, 30]
fig=sns.pairplot(data = diabetesData, vars=['Glucose'], hue = 'Outcome')
sl.header("Relation of Diabetic condition with Glucose Level")
sl.write("This graph shows the frequency distribution curve of glucose level for people who have diabetes (orange) and who don't (blue).")
sl.pyplot(fig)
pyplot.show()
