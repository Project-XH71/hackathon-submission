
import pandas as pd
data = pd.read_csv('covid_19_india.csv') # Reads the dataset through a DataFrame
print(data) # Displays the dataset
print(data.info()) # Displays a concise summary of a DataFrame.
print(data.describe()) # Returns description of the data in the DataFrame
numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
numeric_data = data.select_dtypes(include=numerics)
print(numeric_data) # Returns a subset of the DataFrame’s columns based on the column dtypes, i.e., returns numerical columns here
len(numeric_data.columns) # Returns number of numerical columns
print(len(numeric_data.columns))
print(data.isna().sum()) # shows total no of missing values of every column
print(data.columns) # prints the name of columns
Confirmed = data.State.value_counts() # to count no of rows of every state n
print(Confirmed)
import seaborn as sns