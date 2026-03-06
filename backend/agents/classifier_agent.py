from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini")

def classify_query(query):

    prompt = f"""
    Classify the hospital query into one category:

    categories:
    - appointment
    - lab_test
    - insurance
    - general
    - medical

    query: {query}

    return only the category
    """

    result = llm.invoke(prompt)

    return result.content