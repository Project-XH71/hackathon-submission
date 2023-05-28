"""Load html from files, clean up, split, ingest into Weaviate."""
import pickle

from langchain.document_loaders import ReadTheDocsLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores.faiss import FAISS
from langchain.document_loaders import PyPDFLoader 
import io
from urllib.request import Request, urlopen
from langchain.document_loaders import UnstructuredPDFLoader



def ingest_docs():
    """Get documents from web pages."""
    # url = "https://firebasestorage.googleapis.com/v0/b/western-throne-383909.appspot.com/o/Z614.pdf?alt=media&token=ed88e894-f320-4581-9a56-c622e0eaf319"
    # remote_file = urlopen(Request(url)).read()
    # memory_file = io.BytesIO(remote_file)
    # raw_documents = PdfReader(memory_file)

    # loader = ReadTheDocsLoader("langchain.readthedocs.io/en/latest/")
    # raw_documents = loader.load()
    loader = PyPDFLoader("./trial/Z614.pdf")
    pages = loader.load_and_split()
    # text_splitter = RecursiveCharacterTextSplitter(
    #     chunk_size=1000,
    #     chunk_overlap=200,
    # )
    # documents = text_splitter.split_text(text=raw_documents)

    # with open("trial/dummy.json") as f:
    #     documents = json.load(f)

    embeddings = OpenAIEmbeddings()
    
    vectorstore = FAISS.from_documents(pages, embeddings)

    # Save vectorstore
    with open("vectorstore.pkl", "wb") as f:
        pickle.dump(vectorstore, f)


if __name__ == "__main__":
    ingest_docs()
