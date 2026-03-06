from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini")



def generate_response(query, context):

    prompt = f"""
    You are a hospital assistant helping staff draft replies to patients.

    Patient query:
    {query}

    Hospital information:
    {context}

    Write a polite draft reply that hospital staff can review.
    Do not give medical diagnosis.
    """

    result = llm.invoke(prompt)

    return result.content