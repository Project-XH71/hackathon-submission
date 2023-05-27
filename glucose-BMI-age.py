from matplotlib import pyplot
import seaborn as sns
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# to show the plot between glucose, BMI, Age and Outcome
pyplot.figure(figsize = (15,10))
sns.scatterplot(data = diabetesData, x="Glucose", y="BMI", hue="Outcome", size="Age")
pyplot.show()