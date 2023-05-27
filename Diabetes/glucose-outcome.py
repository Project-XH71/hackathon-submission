import seaborn as sns
from matplotlib import pyplot
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# relation between glucose and outcome
pyplot.figure(figsize=(15,10))
sns.violinplot(data = diabetesData, x = "Outcome", y = "Glucose", linewidth = 2, split = True, inner = "quart")
pyplot.show()
# shows that diabetes is more probable on people with higher glucose levels