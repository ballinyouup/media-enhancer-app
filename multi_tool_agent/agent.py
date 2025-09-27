import datetime
from zoneinfo import ZoneInfo
from google.adk.agents import Agent

def get_weather(city: str) -> dict:
    """Retrieves the current weather report for a specified city.

    Args:
        city (str): The name of the city for which to retrieve the weather report.

    Returns:
        dict: status and result or error msg.
    """
    if city.lower() == "new york":
        return {
            "status": "success",
            "report": (
                "The weather in New York is sunny with a temperature of 25 degrees"
                " Celsius (77 degrees Fahrenheit)."
            ),
        }
    else:
        return {
            "status": "error",
            "error_message": f"Weather information for '{city}' is not available.",
        }


def get_current_time(city: str) -> dict:
    """Returns the current time in a specified city.

    Args:
        city (str): The name of the city for which to retrieve the current time.

    Returns:
        dict: status and result or error msg.
    """

    if city.lower() == "new york":
        tz_identifier = "America/New_York"
    else:
        return {
            "status": "error",
            "error_message": (
                f"Sorry, I don't have timezone information for {city}."
            ),
        }

    tz = ZoneInfo(tz_identifier)
    now = datetime.datetime.now(tz)
    report = (
        f'The current time in {city} is {now.strftime("%Y-%m-%d %H:%M:%S %Z%z")}'
    )
    return {"status": "success", "report": report}

def get_user_name(user_name: str) -> dict:
    """Returns hello world when asked to print hello world.

    Args:
        user_name (str): The name of the city for which to retrieve the weather report.

    Returns:
        dict: status, message, and result or error msg.
    """
    return {
        "status": "success",
        "message": f"Hello {user_name}",
    }

root_agent = Agent(
    name="weather_time_agent",
    model="gemini-2.5-flash",
    description=(
        "Agent to that can run the get_user_name function."
    ),
    instruction=(
        "You are a helpful agent who can run the get_user_name function."
    ),
    tools=[get_weather, get_current_time, get_user_name],
)
def my_after_model_callback(callback_context, llm_response):
    """Callback function that runs after the model generates a response."""
    print(f"After model callback - Response: {llm_response}")
    # You can modify the response here if needed
    return llm_response  # Return the response (modified or unmodified)

# Set the callback function
root_agent.after_model_callback = my_after_model_callback