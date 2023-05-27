from matplotlib import pyplot
import seaborn as sns
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# to display the heatmap of all attributes
pyplot.figure(figsize = (15,10))
sns.heatmap (diabetesData.corr(), annot=True, fmt = ".2f", cmap = "cool")
pyplot.show()