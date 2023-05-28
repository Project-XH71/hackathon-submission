import seaborn as sns
from matplotlib import pyplot
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# individual pair-wise relatons between glucose, outcome, diabetes pedigree function, outcomes, pregnancies and bmi
pyplot.rcParams['figure.figsize'] = [10, 5]
sns.pairplot(data = diabetesData, vars=['Glucose', 'Insulin', 'Pregnancies', 'BMI', 'DiabetesPedigreeFunction'], hue = 'Outcome')
pyplot.show()