import json
import shutil

import google.generativeai as genai
import os
from dotenv import load_dotenv
import typing_extensions as typing
from utils import clear_files, output_json, send_json
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


MODEL_NAME = "models/gemini-1.5-flash"
def upload_image_gemini(image_root, id = None): 
    if id: 
        return
    clear_files()
    uris = []
    for files in os.listdir(image_root): 
        path = os.path.join(image_root, files)
        # file_name = image_path.split("/")[-1]
        
        uris.append(genai.upload_file(path=path, display_name=files))
    return uris 



class Heirarchy(typing.TypedDict): 
    # """Represents a single element in the view hierarchy."""
    name: str
    type: str
    # attributes: dict[str, any]
    

class ViewHierarchy(typing.TypedDict):
    # """Represents the entire view hierarchy."""
    root: Heirarchy
    children: list[Heirarchy]

class TestCase(typing.TypedDict):
    description: str
    pre_conditions: list[str]
    testing_steps: list[str]
    expected_result: list[str]
    # coverage: list[Widget]


def prompt_model_with_image(uri, model_name, prompt, json_mode = False, schema_object= None): 
    if json_mode and schema_object: 
        model = genai.GenerativeModel(model_name=model_name, 
                                      generation_config={"response_mime_type": "application/json", "response_schema": list[schema_object]}
                                    )
    else:     
        model = genai.GenerativeModel(model_name=model_name)
    response = model.generate_content([prompt, uri])
    return response

def COT_prompts(uri,prompts):
    result = []
    result.append([prompts[0], uri]) 
    result.extend(prompts[1:])
    return result

def chain_of_though(model_name, uri, prompts, system_instruction = None): 
    prompts = COT_prompts(uri, prompts)
    if system_instruction: 
        model = genai.GenerativeModel(model_name=model_name, system_instruction=system_instruction).start_chat(history=[])
    else: 
        model = genai.GenerativeModel(model_name=model_name).start_chat(history=[])
    for prompt in prompts: 
        model.send_message(prompt)
    return model

def prompt_chain(image_folder, prompt, COT_prompt, system_instruction = None, include_tree = None, schema_object = None): 
    uris = upload_image_gemini(image_folder)
    results = []
    heirarchies = []
    for uri in uris: 
        heirarchy = ""
        if include_tree: 
            print("[x] Getting tree....")
            heirarchy= prompt_model_with_image(uri, MODEL_NAME, "Approximate a detailed and extensive Widget heirarchy for this UI screenshot", json_mode=True, schema_object=ViewHierarchy).text
            prompt += f"\nHere's a detailed look at the structure of the App for reference:\n {heirarchy}"
        print("[x] Querying model....")
        model = chain_of_though(MODEL_NAME, uri, COT_prompt, system_instruction)
        print("[x] Parsing final output....")
        response= model.send_message(prompt, generation_config={"response_mime_type":"application/json", "response_schema": list[schema_object]})
        # append response schemas of test cases and approximate heirarchies
        results.append(response.text)
        heirarchies.append(heirarchy)
    return results, heirarchies




def invoke_chain(image_folder, user_instr): 
    
    system_instr = """You are ultimately tasked to give output that should provide a detailed, step-by-step guide on how to test each functionality in a UI screenshot. The guide should be divided into the following sections:
    Description: A concise explanation of what the test case aims to verify or validate.
    Pre-conditions: List the required setup, environmental configurations, or pre-existing conditions that need to be fulfilled before running the test.
    Testing Steps: Clearly outline the sequence of actions that need to be performed to carry out the test. Each step should be easy to follow and should mention any tools or interfaces to be used.
    Expected Result: Specify the exact outcome if the functionality works correctly, including any visual, textual, or numerical indicators. Describe any error messages or UI updates that should appear if applicable."""
    COT = ["What are the main functional requirements satisfied by this page?", "Understand the critical functional componenets, only present in the given UI screenshot", "Consider what can go wrong when interacting with this page", 
       "Identify components that introduce potential errenous behaviour"
       ]
   
    if user_instr: 
        system_instr += f"\nAlso Pay importance to the user instruction: {user_instr}"
    
    results, heirarchies = prompt_chain(image_folder=image_folder, 
                                        prompt="Generate test cases with the explored rationale.", 
                                        COT_prompt=COT, 
                                        system_instruction=system_instr, 
                                        include_tree=True,
                                        schema_object=TestCase) 
        
    # print(heirarchies)
    file_names = os.listdir(image_folder)
    output_json("output", files=file_names, responses=results)
    print("[x] Saving results")
    results = send_json( 
                files=file_names, 
                responses=results)
   
    
    try:
        if heirarchies:
            x = json.loads(heirarchies[0])
            # print(x)
            heirarchies = send_json( 
                files=file_names, 
                responses=heirarchies)
    except ValueError as e:
        return results, None
    return results, heirarchies

