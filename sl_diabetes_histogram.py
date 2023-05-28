import streamlit as sl
from matplotlib import pyplot
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# To display the histograms
pyplot.rcParams['figure.figsize'] = [15, 10]
sl.header("Histograms of Various Attributes in the Diabetes Dataset")
sl.write("It represents the distribution of every attribute in the diabetes dataset in the form of histograms.")
fig = diabetesData.hist()
sl.pyplot(fig)
pyplot.show()