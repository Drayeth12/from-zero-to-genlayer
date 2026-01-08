// app.js
import { GenLayerClient } from "genlayer-js"; // make sure genlayer-js is installed

// Connect to GenLayer network (local simulator or deployed network)
const client = new GenLayerClient({ network: "localhost" }); // change if using another network

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"; 
const disputeResolver = client.contract(CONTRACT_ADDRESS);

// Grab DOM elements
const disputeIdInput = document.getElementById("disputeId");
const claimAInput = document.getElementById("claimA");
const claimBInput = document.getElementById("claimB");
const statusDiv = document.getElementById("status");
const resultDiv = document.getElementById("result");
const verdictSpan = document.getElementById("verdict");
const reasoningP = document.getElementById("reasoning");

// Attach click listener
document.querySelector("button").addEventListener("click", solveDispute);

async function solveDispute() {
    const disputeId = disputeIdInput.value.trim();
    const claimA = claimAInput.value.trim();
    const claimB = claimBInput.value.trim();

    if (!disputeId || !claimA || !claimB) {
        alert("Please fill in all fields.");
        return;
    }

    // Show processing message
    statusDiv.textContent = "AI is evaluating the dispute...";
    resultDiv.style.display = "none";

    try {
        // Call the Python Intelligent Contract
        const resultStr = await disputeResolver.resolve_dispute(disputeId, claimA, claimB);

        // Parse JSON result
        const result = JSON.parse(resultStr);

        verdictSpan.textContent = result.winner;
        reasoningP.textContent = result.reason;

        resultDiv.style.display = "block";
        statusDiv.textContent = "Dispute resolved!";
    } catch (err) {
        console.error(err);
        statusDiv.textContent = "Error resolving dispute. Check console for details.";
    }
}
