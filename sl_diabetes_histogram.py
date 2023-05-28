import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

def main():
    st.title("Histogram for Different Attributes")
    
    # Load the dataset
    df = pd.read_csv("diabetes.csv")
    
    # Get the numerical columns
    numeric_columns = df.select_dtypes(include=np.number).columns.tolist()
    
    # Create subplots
    fig, axes = plt.subplots(nrows=len(numeric_columns), ncols=1, figsize=(8, 5 * len(numeric_columns)))
    
    # Create histograms for each numerical attribute
    for i, column in enumerate(numeric_columns):
        ax = axes[i]
        ax.hist(df[column], bins="auto")
        ax.set_xlabel(column)
        ax.set_ylabel("Frequency")
        ax.set_title(f"Histogram of {column}")
    
    # Adjust layout
    plt.tight_layout()
    
    # Display the histograms using Streamlit
    st.pyplot(fig)

if __name__ == "__main__":
    main()
