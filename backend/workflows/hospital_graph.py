from agents.classifier_agent import classify_query
from agents.retriever_agent import retrieve_context
from agents.response_agent import generate_response
from agents.safety_agent import safety_check


def run_hospital_workflow(query):

    intent = classify_query(query)

    context = retrieve_context(query)

    draft = generate_response(query, context)

    safe_response = safety_check(draft)

    return {
        "intent": intent,
        "draft_response": safe_response
    }