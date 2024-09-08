## Overview

The main idea is to convert user input into robust testing instructions. The project is designed with a **React** frontend and **Flask** backend. It uses a combination of UI screenshot analysis and instruction-based prompting to generate test cases that take into account the widget tree structure of the interface.

### Features
- **User Input (Screenshots + Instructions):** Users can input multiple UI screenshots and testing instructions.
- **Widget Tree Parsing:** The system tries to understand the widget structure from the UI screenshots using a Flutter widget parser. This enhances the robustness of the generated test cases.
- **Task Prompt Generation (Chain-of-Thought Prompting):** The backend uses Chain-of-Thought (CoT) prompting techniques to analyze the screenshots and user instructions for structured test case generation.

### Tech Stack
- Backend: Flask & Gemini API 
- Frontend: React.js

## Proposed Flow
![Input image](/assets/flow.png)

### Specific Challenges
- **Time**: This has been built in less than 10 hours, which meant understanding quickly what works and moving quickly to the next steps
- **Generalizability**: One major constraint with Gemini was its tendancy to take the UI too literally and not generalize, this meant trying out various permutations of prompting strategies to get best results.
- **Frontend**: Front end is not my best skill, and with time contraints I had to prioritize functionality over beauty.  

### Screenshots
![Input image](/assets/input.png)

![Input image](/assets/output.png)

### Planned Enhancements
- **Hierarchy Resolver:** Few shot prompting (ICL) Manual annotation of hierarchies for further refining the widget tree structure.
- **Tree Coverage Report:** Planned feature to provide tree coverage of the widget hierarchy after resolving it.
- **RAG to specify documentation:** A vector store holds widget documentation and helps in refining test case details based on widget properties.

### References
- **Liu, Z., Chen, C., Wang, J., Chen, M., Wu, B., Che, X., Wang, D., & Wang, Q. (2023). Make LLM a Testing Expert: Bringing Human-like Interaction to Mobile GUI Testing via Functionality-aware Decisions. arXiv. https://arxiv.org/abs/2310.15780**
- **Wang, J., Huang, Y., Chen, C., Liu, Z., Wang, S., & Wang, Q. (2024). Software Testing with Large Language Models: Survey, Landscape, and Vision. arXiv preprint arXiv:2307.07221. Retrieved from https://arxiv.org/abs/2307.07221**
