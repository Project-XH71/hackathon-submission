import streamlit as sl
from streamlit_extras.add_vertical_space import add_vertical_space
import seaborn as sns
from matplotlib import pyplot
import pandas as pd
from pandas import read_csv
import numpy as np

sl.set_page_config(page_title="HealthGPT", page_icon=None, layout="centered", initial_sidebar_state="auto", menu_items=None)
# Sidebar contents
with sl.sidebar:
    sl.title('HealthSync GPT')
    hide_streamlit_style = """
            <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            </style>        """
    sl.markdown(hide_streamlit_style, unsafe_allow_html=True) 
    sl.markdown('''
    ## About
    Welcome to our revolutionary chatbot application designed to enhance your healthcare experience. Our innovative ChatGPT-based chatbot utilizes cutting-edge technology to read medical records and facilitate interactive conversations with PDF documents. With our app, you can engage in natural language conversations, gaining valuable insights and information from your medical records in a convenient and user-friendly manner.
    
    Our chatbot leverages advanced machine learning algorithms to analyze complex medical data, providing you with personalized and context-aware responses.
    
    ## Key Features:
    
    Seamlessly interact with your medical records through natural language conversations.
    Access information from PDF documents in a user-friendly and conversational manner.
    Gain valuable insights and understanding from your medical records.
    Personalized responses tailored to your specific queries and needs.
    User-friendly interface for a seamless and intuitive user experience.
    Secure and confidential handling of your medical data.
    Experience the future of healthcare communication with our ChatGPT-based chatbot. Take control of your health journey and unlock the power of your medical records like never before.
    
    HealthGPT - Empowering Conversations with Medical Records
    
     
    ''')
    add_vertical_space(5)
    sl.write('Made with ❤️ during [GeeksForGeeks x Google Cloud Hackathon]')
sl.title("HealthSync Static Analytics 📈")
# Read the data 
diabetesData = read_csv('diabetes.csv')

# to show the plot between glucose, BMI, Age and Outcome
fig=pyplot.figure(figsize = (15,10))
sl.header("Relation of Diabetic condition with BMI, Glucose Level and Age")
sl.write("This scatterplot defines the correlation of people having/not having diabetes with their glucose level, BMI and age. From this graph we can clearly see a positive correlation between glucose level and diabetes. Here blue dots represent people who don't have diabetes and the orange dots represent the people who have diabetes.")
sns.scatterplot(data = diabetesData, x="Glucose", y="BMI", hue="Outcome", size="Age")
sl.write(fig)


# shows the relation between glucose, insulin, age and outcome
fig=pyplot.figure(figsize=(15,10))
sns.scatterplot(x = 'Glucose', y = 'Insulin', data = diabetesData, alpha = 0.7, hue = 'Outcome', size = "Age")
sl.header("Relation of Diabetic condition with Insulin, Glucose Level and Age")
sl.write("This scatterplot defines the correlation of people having/not having diabetes with their glucose level, Insulin and age. From this graph we can clearly see a positive correlation between glucose level and diabetes. Here blue dots represent people who don't have diabetes and the orange dots represent the people who have diabetes.")
sl.pyplot(fig)

# relation between glucose and outcome
fig=pyplot.figure(figsize=(15,10))
sl.header("Relation between glucose and outcome")
sl.write("We can infer that people with higher glucose level have higher probability of getting diabetes while those with middle to lower level of glucose have lower probability of sufferinf from diabetes.")
sns.violinplot(data = diabetesData, x = "Outcome", y = "Glucose", linewidth = 2, split = True, inner = "quart")
sl.write(fig)


# to show the plot between glucose, BMI, Age and Outcome
fig=pyplot.figure(figsize = (15,10))
sl.header("Diabetes Heatmap")
sl.write("This map displays the Pearson Correlation Coefficient for the corresponding x and y diseases/medical values. This can be used to identify relations between different medical conditions.")
sns.heatmap (diabetesData.corr(), annot=True, fmt = ".2f", cmap = "cool")
sl.write(fig)

# individual pair-wise relatons between glucose, diabetes pedigree function, outcomes, pregnancies and bmi
pyplot.rcParams['figure.figsize'] = [10, 5]
sl.header("PairPlots of Attributes affecting Diabetes")
sl.write("It represents the individual pairwise relations between Glucose, Insulin, Pregnancies, BMI and Diabetes Pedigree Function in accordance to whether the outcome for diabetes is positive or not.")
fig = sns.pairplot(data = diabetesData, vars=['Glucose', 'Insulin', 'Pregnancies', 'BMI', 'DiabetesPedigreeFunction'], hue = 'Outcome')
sl.pyplot(fig)

def main():
    sl.title("Histogram for Different Attributes")
    sl.write("These are histograms showing frequency distribution of different medical things.")
    
    # Load the dataset
    df = pd.read_csv("diabetes.csv")
    
    # Get the numerical columns
    numeric_columns = df.select_dtypes(include=np.number).columns.tolist()
    
    # Create subplots
    fig, axes = pyplot.subplots(nrows=len(numeric_columns), ncols=1, figsize=(8, 5 * len(numeric_columns)))
    
    # Create histograms for each numerical attribute
    for i, column in enumerate(numeric_columns):
        ax = axes[i]
        ax.hist(df[column], bins="auto")
        ax.set_xlabel(column)
        ax.set_ylabel("Frequency")
        ax.set_title(f"Histogram of {column}")
    
    # Adjust layout
    pyplot.tight_layout()
    
    # Display the histograms using Streamlit
    sl.pyplot(fig)

if __name__ == "__main__":
    main()