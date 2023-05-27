from matplotlib import pyplot
from pandas import read_csv
# Read the data 
diabetesData = read_csv('diabetes.csv')

# To display the histograms
pyplot.rcParams['figure.figsize'] = [15, 10]
diabetesData.hist()
pyplot.show()

