import streamlit as sl
import seaborn as sns
from matplotlib import pyplot
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# individual pair-wise relatons between glucose, diabetes pedigree function, outcomes, pregnancies and bmi
pyplot.rcParams['figure.figsize'] = [10, 5]
sl.header("PairPlots of Attributes affecting Diabetes")
sl.write("It represents the individual pairwise relations between Glucose, Insulin, Pregnancies, BMI and Diabetes Pedigree Function in accordance to whether the outcome for diabetes is positive or not.")
fig = sns.pairplot(data = diabetesData, vars=['Glucose', 'Insulin', 'Pregnancies', 'BMI', 'DiabetesPedigreeFunction'], hue = 'Outcome')
sl.pyplot(fig)
pyplot.show()