import streamlit as sl
from matplotlib import pyplot
import seaborn as sns
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# shows the relation between glucose, insulin, age and outcome
fig=pyplot.figure(figsize=(15,10))
sns.scatterplot(x = 'Glucose', y = 'Insulin', data = diabetesData, alpha = 0.7, hue = 'Outcome', size = "Age")
sl.header("Relation of Diabetic condition with Insulin, Glucose Level and Age")
sl.write("This scatterplot defines the correlation of people having/not having diabetes with their glucose level, Insulin and age. From this graph we can clearly see a positive correlation between glucose level and diabetes. Here blue dots represent people who don't have diabetes and the orange dots represent the people who have diabetes.")
sl.pyplot(fig)
pyplot.show()