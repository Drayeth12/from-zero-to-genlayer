# { "Depends": "py-genlayer:test" }
from genlayer import *
import json

class DisputeResolver(gl.Contract):
    # Permanent storage: key = dispute_id, value = JSON string of result
    disputes: TreeMap[str, str]

    def __init__(self) -> None:
        # Initialize TreeMap
        self.disputes = TreeMap()

    @gl.public.write
    def resolve_dispute(self, dispute_id: str, party_a_claim: str, party_b_claim: str) -> str:
        """
        Processes a dispute between two parties using AI consensus
        and saves the result as a JSON string in permanent storage.
        """
        # Construct AI prompt
        prompt: str = f"""
        You are a neutral arbitrator.
        Decide who is correct in this dispute.
        Respond strictly in JSON format:

        {{
            "winner": "A or B",
            "reason": "short explanation"
        }}

        Party A claim: {party_a_claim}
        Party B claim: {party_b_claim}
        """

        # Inner function for AI execution
        def get_verdict() -> str:
            return gl.exec_prompt(prompt)

        # Reach consensus using GenLayer Equivalence Principle
        verdict_str: str = gl.eq_principle.strict_eq(get_verdict)

        # Ensure stored result is valid JSON string
        try:
            json.loads(verdict_str)
        except json.JSONDecodeError:
            # Fallback if AI returns invalid JSON
            verdict_str = json.dumps({
                "winner": "A",
                "reason": "Defaulted due to AI JSON error"
            })

        # Save to blockchain
        self.disputes[dispute_id] = verdict_str

        return verdict_str

    @gl.public.view
    def get_dispute_result(self, dispute_id: str) -> str:
        """
        Retrieve dispute result safely without paying gas.
        """
        return self.disputes.get(dispute_id, "Dispute ID not found in records.")
