import streamlit as st
from dotenv import load_dotenv
import pickle
from PyPDF2 import PdfReader
from streamlit_extras.add_vertical_space import add_vertical_space
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.callbacks import get_openai_callback
import os
 
os.environ["OPENAI_API_KEY"] = "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"
st.set_page_config(page_title="HealthGPT", page_icon=None, layout="centered", initial_sidebar_state="auto", menu_items=None)
# Sidebar contents
with st.sidebar:
    st.title('HealthSync GPT')
    hide_streamlit_style = """
            <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            </style>
            """
    st.markdown(hide_streamlit_style, unsafe_allow_html=True) 
    st.markdown('''
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
    st.write('Made with ❤️ during [GeeksForGeeks x Google Cloud Hackathon]')
 
load_dotenv()
 
def main():
    st.header("Chat with Medical / Lab Record 💬")
 
 
    # upload a PDF file
    pdf = st.file_uploader("Upload your PDF", type='pdf')
 
    # st.write(pdf)
    if pdf is not None:
        pdf_reader = PdfReader(pdf)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
 
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
            )
        chunks = text_splitter.split_text(text=text)
 
        # # embeddings
        store_name = pdf.name[:-4]
        st.write(f'{store_name}')
        # st.write(chunks)
 
        if os.path.exists(f"{store_name}.pkl"):
            with open(f"{store_name}.pkl", "rb") as f:
                VectorStore = pickle.load(f)
            # st.write('Embeddings Loaded from the Disk')s
        else:
            embeddings = OpenAIEmbeddings()
            VectorStore = FAISS.from_texts(chunks, embedding=embeddings)
            with open(f"{store_name}.pkl", "wb") as f:
                pickle.dump(VectorStore, f)
 
        # embeddings = OpenAIEmbeddings()
        # VectorStore = FAISS.from_texts(chunks, embedding=embeddings)
 
        # Accept user questions/query
        query = st.text_input("Ask questions about your PDF file:")
        # st.write(query)
 
        if query:
            docs = VectorStore.similarity_search(query=query, k=3)
 
            llm = OpenAI()
            chain = load_qa_chain(llm=llm, chain_type="stuff")
            with get_openai_callback() as cb:
                response = chain.run(input_documents=docs, question=query)
                print(cb)
            st.write(response)
 
if __name__ == '__main__':
    main()