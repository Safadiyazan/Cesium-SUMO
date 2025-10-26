import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadSimulation } from '../LoaderSimulation';

const FileLoader = ({ viewer }) => {
    const [jsonFiles, setJsonFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState("/Outputs/NYC_20250505_0125.json");
    // Hardcoded files from original Dashboard.js
    const [selectedFile2, setSelectedFile2] = useState("/Outputs/agent_trajectories_SUMO_NYC_South_20250505_050511.json");
    const [selectedFile3, setSelectedFile3] = useState("/Outputs/agent_trajectories_SUMO_WallStreet_20250505_033910.json");
    const [selectedFile4, setSelectedFile4] = useState("/Outputs/agent_trajectories_SUMO_Manhattan_All_20250505_033243.json");

    const [selectedCity, setSelectedCity] = useState("NAU"); // This was in Dashboard.js, preserving it

    useEffect(() => {
        const fetchJsonFiles = async () => {
            try {
                const response = await axios.get('/api/getJsonFiles');
                setJsonFiles(response.data.files);
            } catch (error) {
                console.error('Error fetching JSON files:', error);
            }
        };
        fetchJsonFiles();
    }, []);

    useEffect(() => {
        if (viewer && selectedFile) {
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

                LoadSimulation(viewer, data1, data2, data3, data4, selectedCity);
            })
            .catch(error => {
                console.error('Error fetching simulation data:', error);
            });
        }
    }, [viewer, selectedFile, selectedFile2, selectedFile3, selectedFile4, selectedCity]);

    const handleDropdownChange = (event) => {
        setSelectedFile(event.target.value);
    };

    return (
        <div className="p-3">
            <label htmlFor="jsonDropdown"><b>Choose a scenario:</b></label>
            <select className="form-select" id="jsonDropdown" onChange={handleDropdownChange} value={selectedFile}>
                <option value="">Choose...</option>
                {jsonFiles.map((file, index) => (
                    <option key={index} value={'/Outputs/' + file}>
                        {file}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FileLoader;
