from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini")

def classify_query(query, spo2=None, bpm=None):

    vitals_context = ""
    if spo2 is not None or bpm is not None:
        vitals_context = f"\nPatient Vitals - SpO2: {spo2}%, BPM: {bpm}\nIf SpO2 < 92% or BPM > 120, YOU MUST CLASSIFY AS: emergency"

    prompt = f"""
    Classify the hospital query into one category:

    categories:
    - appointment
    - lab_test
    - insurance
    - general
    - medical
    - emergency
    {vitals_context}

    query: {query}

    return only the category
    """

    result = llm.invoke(prompt)

    return result.content