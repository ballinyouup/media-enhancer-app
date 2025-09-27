import requests
import base64

from google.adk.agents import Agent

def parse_pdf(link: str) -> dict:
    """Runs the parse pdf api endpoint.

    Args:
        link (str): a URL to a PDF file.

    Returns:
        dict: Response containing extracted text or error message.
    """
    try:
        # Check if input is a URL or base64 string
        if link.startswith(('http://', 'https://')):
            # Handle URL input
            data = {'link': link}
            response = requests.post('http://localhost:3000/api/pdf', data=data)
        else:
            # Handle base64 input (backward compatibility)
            pdf_bytes = base64.b64decode(link)
            files = {'pdf': ('document.pdf', pdf_bytes, 'application/pdf')}
            response = requests.post('http://localhost:3000/api/pdf', files=files)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "status": "success",
                "extracted_text": data.get("extractedText", "")
            }
        else:
            error_data = response.json() if response.content else {}
            return {
                "status": "error",
                "error_message": error_data.get("error", f"HTTP {response.status_code} error")
            }
            
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "error_message": f"Failed to connect to PDF parsing API: {str(e)}"
        }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Unexpected error while parsing PDF: {str(e)}"
        }

def transcribe(link: str) -> dict:
    """Runs the transcribe audio api endpoint.

    Args:
        link (str): The linked audio file to pass to the model.

    Returns:
        dict: Response transcribed text or error message.
    """
    try:
        # Prepare the form data with the audio link
        data = {'link': link}
        
        # Make request to the Next.js API endpoint
        # Assuming the API server is running on localhost:3000
        response = requests.post('http://localhost:3000/api/transcribe', data=data)
        
        if response.status_code == 200:
            response_data = response.json()
            return {
                "status": "success",
                "transcription": response_data.get("transcription", "")
            }
        else:
            error_data = response.json() if response.content else {}
            return {
                "status": "error",
                "error_message": error_data.get("error", f"HTTP {response.status_code} error")
            }
            
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "error_message": f"Failed to connect to transcribe API: {str(e)}"
        }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Unexpected error while transcribing audio: {str(e)}"
        }

root_agent = Agent(
    name="multi_tool_agent",
    model="gemini-2.5-flash",
    description=(
        "Agent that can parse PDFs and transcribe audio files from URLs using specialized tools."
    ),
    instruction=(
        "You are a helpful agent that can parse PDFs and transcribe audio files. "
        "When a user asks you to transcribe an audio file or provides an audio URL, "
        "you MUST use the transcribe() function with the audio URL. "
        "When a user asks you to parse a PDF or provides PDF data, use the parse_pdf() function. "
        "Always use the appropriate tool function for the task - do not try to process files directly."
    ),
    tools=[parse_pdf, transcribe],
)
def my_after_model_callback(callback_context, llm_response):
    """Callback function that runs after the model generates a response."""
    print(f"After model callback - Response: {llm_response}")
    # You can modify the response here if needed
    return llm_response  # Return the response (modified or unmodified)

# Set the callback function
root_agent.after_model_callback = my_after_model_callback