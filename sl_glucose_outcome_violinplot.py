import streamlit as sl
import seaborn as sns
from matplotlib import pyplot
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# relation between glucose and outcome
fig = pyplot.figure(figsize=(15,10))
sl.header("Relation between glucose and outcome")
sl.write("We can infer that people with higher glucose level have higher probability of getting diabetes while those with middle to lower level of glucose have lower probability of sufferinf from diabetes.")
sns.violinplot(data = diabetesData, x = "Outcome", y = "Glucose", linewidth = 2, split = True, inner = "quart")
sl.write(fig)
pyplot.show()
# shows that diabetes is more probable on people with higher glucose levels