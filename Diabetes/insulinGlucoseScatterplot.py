from matplotlib import pyplot
import seaborn as sns
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# shows the relation between glucose, insulin, age and outcome
pyplot.figure(figsize=(15,10))
sns.scatterplot(x = 'Glucose', y = 'Insulin', data = diabetesData, alpha = 0.7, hue = 'Outcome', size = "Age")
pyplot.show()
