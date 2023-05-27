import seaborn as sns
from matplotlib import pyplot
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# relation between glucose and outcome
pyplot.rcParams['figure.figsize'] = [45, 30]
sns.pairplot(data = diabetesData, vars=['Glucose'], hue = 'Outcome')
pyplot.show()