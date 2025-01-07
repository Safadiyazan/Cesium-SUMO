# Start
import xml.etree.ElementTree as ET
import json
import sumolib  # Ensure sumolib is installed
from datetime import datetime

now = datetime.now() # current date and time
date_time = now.strftime("%Y%m%d_%H%M%S")
print('===========================')
print(date_time)
print('===========================')
print('Export XML to JSON Process')
# Load the coordinate transformation
print('Loading Network Coordination')
net = sumolib.net.readNet('./Zurich_Signalized/osm.net.xml.gz')
projection = net.getLocationOffset()

print('Loading XML')
# Parse the XML file
tree = ET.parse('./SUMO_trajectories_Signalized.xml')
root = tree.getroot()

# Dictionary to store agent data over time
agent_trajectories = {}

for timestep in root.findall('timestep'):
    time = float(timestep.get('time'))
    if time < 600:
        print('Timestep = ' + str(time))
        agentIndex = 0
        for agent in timestep.findall('person') + timestep.findall('vehicle'):
            agent_AMI = 0
            # if (agent.get('id')[0:3] == 'ped'):
            #     agent_AMI = 1
            #     agent_rs = 1.5
            if (agent.get('id')[0:10] == 'motorcycle') or (agent.get('id')[0:3] == 'bike'):
                agent_AMI = 2
                agent_rs = 1.5
            if (agent.get('id')[0:3] == 'bus') or (agent.get('id')[0:2] == 'pt'):
                agent_AMI = 3
                agent_rs = 4
            if (agent.get('id')[0:3] == 'veh'):
                agent_AMI = 4
                agent_rs = 3

            if (agentIndex < 200) and (agent_AMI != 0):
                agentIndex = agentIndex + 1
                print('Loading Agent Number: #' + str(agentIndex) + ' -- Type ' + str(agent_AMI) + ' -- Timestep = ' + str(time))
                x = float(agent.get('x'))
                y = float(agent.get('y'))
                lon, lat = net.convertXY2LonLat(x, y)  # Convert to longitude and latitude

                if agentIndex not in agent_trajectories:
                    # Initialize new agent entry
                    agent_tda = time
                    agent_trajectories[agentIndex] = {
                        'AMI': agent_AMI,  # Use vehicle ID as AMI
                        'stat': [],  # Status over time
                        'tda': agent_tda,  # Initial departure time
                        'taa': agent_tda,  # Placeholder for arrival time (adjust logic as needed)
                        'rs': agent_rs,  # Placeholder safety radius [m]
                        'rd': agent_rs*3,  # Placeholder detection radius [m]
                        'x': [],  # SUMO x positions over time
                        'y': [],  # SUMO y positions over time
                        'z': [],  # Placeholder z positions over time
                        'lon': [],  # Longitudes over time
                        'lat': []   # Latitudes over time
                    }
                
                # Append data for the current timestep
                agent_trajectories[agentIndex]['stat'].append(1)  # Assuming status '1' for active
                agent_trajectories[agentIndex]['x'].append(x)
                agent_trajectories[agentIndex]['y'].append(y)
                agent_trajectories[agentIndex]['z'].append(0.0)  # Placeholder z position
                agent_trajectories[agentIndex]['lon'].append(lon)
                agent_trajectories[agentIndex]['lat'].append(lat)
                agent_trajectories[agentIndex]['taa'] = time

# Convert agent trajectories to a list for JSON output
agent_data = list(agent_trajectories.values())

Data = {
    'TFC': 'Sample Traffic Data',  # Placeholder value
    'SimInfo': {
        'tf': max(float(timestep.get('time')) for timestep in root.findall('timestep')),  # Final time [s]
        'dtS': 1.0,  # Time step [s], placeholder
        'dtM': 1.0   # Placeholder value
    },
    'Settings': {
        'dx': 1000,  # Placeholder airspace x-axis size [m]
        'dy': 1000,  # Placeholder airspace y-axis size [m]
        'dz': 500,   # Placeholder airspace z-axis size [m]
        'asStr': 'Default Airspace Configuration',
        'Airspace': {
            'dx': 1000,
            'dy': 1000,
            'dz': 500,
            'config': 'Sample Configuration'
        }
    },
    'ObjSUMO': agent_data
}
# Write to a JSON file
jsonfilename = f'agent_trajectories_{date_time}.json'

with open(jsonfilename, 'w') as json_file:
    json.dump(Data, json_file, indent=4)

print(f"Agent trajectory data with longitude and latitude has been exported to {jsonfilename}")
