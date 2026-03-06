from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini")



def generate_response(query, context, spo2=None, bpm=None):

    vitals_context = ""
    if spo2 is not None or bpm is not None:
        vitals_context = f"The patient's current real-time vitals from their device are: SpO2 {spo2}% and Heart Rate {bpm} BPM. Please gently acknowledge these readings in your reply."

    prompt = f"""
    You are a hospital assistant helping staff draft replies to patients.

    Patient query:
    {query}

    {vitals_context}

    Hospital information:
    {context}

    Write a polite draft reply that hospital staff can review.
    Do not give medical diagnosis.
    """

    result = llm.invoke(prompt)

    return result.content