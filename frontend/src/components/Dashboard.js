import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// import Analytics from './Analytics';
import { LoadSimulation } from '.././LoaderSimulation';
import { viewer } from '.././index';
import '.././css/main.css'; // Ensure this import is here

const Dashboard = () => {
    
    // =======================================================================================
    const [jsonFiles, setJsonFiles] = useState([]);

    const fetchJsonFiles = async () => {
        try {
            const response = await axios.get('/api/getJsonFiles');
            setJsonFiles(response.data.files);
        } catch (error) {
            console.error('Error fetching JSON files:', error);
        }
    };

    useEffect(() => {
        fetchJsonFiles();
    }, []);

    // GUI Handles ===========================================================================
    // Handle file dropdown change
    const handleDropdownChange = (event) => {
        const selectedOption = event.target.value;
        setSelectedFile(selectedOption);
    };

    // Define handleCheckboxChange in the global scope
    const [navigationOn, setNavigationOn] = useState(false);

    // =======================================================================================
    // Run and Load Simulation Handles =======================================================
    const [selectedFile, setSelectedFile] = useState("/Outputs/NYC_20250505_0125.json");
    // const [selectedFile1, setSelectedFile1] = useState("/Outputs/Results_Qin2Subset_2by2_10apm.json");
    const [selectedFile2, setSelectedFile2] = useState("/Outputs/agent_trajectories_SUMO_NYC_South_20250505_050511.json");
    const [selectedFile3, setSelectedFile3] = useState("/Outputs/agent_trajectories_SUMO_WallStreet_20250505_033910.json");
    const [selectedFile4, setSelectedFile4] = useState("/Outputs/agent_trajectories_SUMO_Manhattan_All_20250505_033243.json");

    // const [analyticsData, setAnalyticsData] = useState(null);

    const [selectedCity, setSelectedCity] = useState("NAU");

    useEffect(() => {
        // Fetch both files in parallel
        Promise.all([
            fetch(selectedFile).then(res => res.json()),
            fetch(selectedFile2).then(res => res.json()),
            fetch(selectedFile3).then(res => res.json()),
            fetch(selectedFile4).then(res => res.json())
        ])
        .then(([data1, data2, data3, data4]) => {
            console.log("File 1 loaded:", selectedFile);
            console.log("File 2 loaded:", selectedFile2);
            console.log("File 3 loaded:", selectedFile3);
            console.log("File 4 loaded:", selectedFile4);
            console.log("City:", selectedCity);

            // Call your function with both datasets
            LoadSimulation(viewer, data1, data2, data3, data4, selectedCity); // You should modify LoadSimulation to accept both datasets
            // ShowAnalytics(data);
            // setAnalyticsData(data1); // Assuming a state variable for analytics data
            })
            .catch(error => {
                console.error('Error fetching city:', error);
            });
    }, [selectedCity]);  // Dependency array ensures this effect runs when selectedCity changes

    // =======================================================================================
    // Groups ================================================================================
    const [isContentVisible, setIsContentVisible] = useState(false);

    const handleToggleContent = () => {
        setIsContentVisible(!isContentVisible);
    };
    const resultContainerStyle = {
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
    };
    // =======================================================================================
    // GUI ===================================================================================
    return (
        <div className="container mt-5">
            <label htmlFor="jsonDropdown"><b>Choose a new scenario for display:</b></label>
            <select className="form-select" id="jsonDropdown" onChange={handleDropdownChange} value={selectedFile}>
                <option value={selectedFile}>
                    Choose a new scenario for display
                </option>
                {jsonFiles.map((file, index) => (
                    <option key={index} value={'/Outputs/' + file}>
                        {file}
                    </option>
                ))}
            </select>
        </div>
    );
};
// =======================================================================================
export default Dashboard;
// END  ==================================================================================
// =======================================================================================