from langchain_openai import ChatOpenAI

from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini")

def safety_check(response):

    prompt = f"""
    Review the hospital response below.

    Ensure:
    - No medical diagnosis
    - No medication instructions
    - Add disclaimer if needed

    response:
    {response}

    return safe response
    """

    result = llm.invoke(prompt)

    return result.content