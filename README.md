> ⚠️ This repository is under active development. We appreciate your patience as features, documentation, and examples are continuously being developed.

# Cesium-SUMO

This repository provides an open-source tool for integrating SUMO simulation output with CesiumJS.

## Prerequisites

Before using this repository, ensure you have the following installed:

- **Cesium JS Token**  
    A Cesium JS Token is required for accessing Cesium's services. Obtain a token by signing up at [Cesium ion](https://cesium.com/ion/). Once you have the token, create a `token.js` file in the main directory with the following content:  
    ```javascript
    const token = "your_token_here";
    export default token;
    ```
    Replace `"your_token_here"` with your actual Cesium JS Token. Ensure this file is not exposed publicly by adding it to your `.gitignore` file.

- **Node.js (v14 or higher)**  
    Download and install Node.js from [nodejs.org](https://nodejs.org/).

- **npm (Node Package Manager)**  
    npm is included with Node.js. Ensure it is installed and updated:  
    ```bash
    npm install -g npm@latest
    ```

- **Python (v3.7 or higher)**  
    Ensure you have Python version 3.7 or higher installed, as it should be compatible with the MATLAB Engine API for Python.
    Download and install Python from [python.org](https://www.python.org/). Ensure Python is added to your system's PATH.

- **pip (Python Package Installer)**  
    pip is included with Python. Verify it is installed and updated:  
    ```bash
    python -m ensurepip --upgrade
    python -m pip install --upgrade pip
    ```

- **Git**  
    Install Git for version control: [git-scm.com](https://git-scm.com/).

---

## Setup Instructions

1. **Clone the Repository**  
     Clone this repository to your local machine:  
     ```bash
     git clone https://github.com/your-username/Cesium-SUMO.git
     cd Cesium-SUMO
     ```

2. **Python Requirements**  
    Install the required Python packages:
    ```bash
    pip install flask
    pip install flask_cors
    ```

3. **Install Dependencies**  
     Install the required npm packages:  
     ```bash
     npm install
     ```

4. **Run the Application**  
     Start the application using the following command:  
     ```bash
     npm start
     ```

You're now ready to use the tool!

---

For questions, feedback, or support, please contact:  
**Yazan Safadi** — [safadiyazan@gmail.com](mailto:safadiyazan@gmail.com)

---

## License

This repository is open-source and distributed under the [Apache 2.0 License](LICENSE).
