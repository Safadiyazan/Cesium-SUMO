# Start
import xml.etree.ElementTree as ET
import json
import sumolib  # Ensure sumolib is installed
from datetime import datetime

now = datetime.now()  # current date and time
date_time = now.strftime("%Y%m%d_%H%M%S")
print('===========================')
print(date_time)
print('===========================')
print('Export XML to JSON Process')

NetworkName = 'SUMO_NYC_South'

# Load the coordinate transformation
print('Loading Network Coordination')
net = sumolib.net.readNet(f'./pySUMO/SUMO_Testing/{NetworkName}/osm.net.xml.gz')
projection = net.getLocationOffset()

print('Loading XML')
# Parse the XML file
tree = ET.parse(f'./pySUMO/SUMO_Testing/{NetworkName}/SUMO_trajectories.xml')
root = tree.getroot()

# Dictionary to store agent data over time
agent_trajectories = {}
processed_agents = set()  # Keep track of processed agent IDs
max_agents = 200  # Limit to 20 agents

for timestep in root.findall('timestep'):
    time = float(timestep.get('time'))
    if time < 600:  # Only process timesteps within the first 600 seconds
        print('Timestep = ' + str(time))
        for agent in timestep.findall('person') + timestep.findall('vehicle'):
            agent_AMI = 0
            agent_rs = 0
            agent_id = agent.get('id')  # Use unique ID for each agent
            
            # Stop processing if we've reached the limit of agents
            if len(processed_agents) >= max_agents and agent_id not in processed_agents:
                break
            
            # Determine agent type and associated parameters
            if agent_id.startswith('aasdasdasdped'):
                agent_AMI = 1
                agent_rs = 1.5
            elif agent_id.startswith('motorcycle') or agent_id.startswith('bike'):
                agent_AMI = 2
                agent_rs = 1.5
            elif agent_id.startswith('bus'):
                agent_AMI = 3
                agent_rs = 9
            elif agent_id.startswith('pt') or agent_id.startswith('rail'):
                agent_AMI = 5
                agent_rs = 30
            elif agent_id.startswith('veh'):
                agent_AMI = 4
                agent_rs = 3
            
            if agent_AMI != 0:
                if agent_id not in processed_agents:
                    processed_agents.add(agent_id)  # Mark agent as processed
                    print(f"Processing Agent: {agent_id} -- Type {agent_AMI} -- Timestep = {time}")
                
                x = float(agent.get('x'))
                y = float(agent.get('y'))
                lon, lat = net.convertXY2LonLat(x, y)  # Convert to longitude and latitude

                if agent_id not in agent_trajectories:
                    # Initialize new agent entry
                    agent_tda = time
                    agent_trajectories[agent_id] = {
                        'AMI': agent_AMI,  # Agent type
                        'stat': [],  # Status over time
                        'tda': agent_tda,  # Initial departure time
                        'taa': agent_tda,  # Placeholder for arrival time (adjust logic as needed)
                        'rs': agent_rs,  # Safety radius [m]
                        'rd': agent_rs * 3,  # Detection radius [m]
                        'x': [],
                        'y': [],
                        'z': [],
                        'lon': [],
                        'lat': []
                    }
                
                # Append data for the current timestep
                agent_trajectories[agent_id]['stat'].append(1)  # Assuming status '1' for active
                agent_trajectories[agent_id]['x'].append(x)
                agent_trajectories[agent_id]['y'].append(y)
                agent_trajectories[agent_id]['z'].append(0.0)  # Placeholder z position
                agent_trajectories[agent_id]['lon'].append(lon)
                agent_trajectories[agent_id]['lat'].append(lat)
                agent_trajectories[agent_id]['taa'] = time

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
jsonfilename = f'./public/Outputs/agent_trajectories_{NetworkName}_{date_time}.json'

with open(jsonfilename, 'w') as json_file:
    json.dump(Data, json_file, indent=4)

print(f"Agent trajectory data with longitude and latitude has been exported to {jsonfilename}")

print('===========================\nBegin Debugging\n===========================')
print(f"Parsed XML Root: {root.tag}")
print(f"Processing up to {max_agents} agents within timesteps < 600 seconds.")

for timestep in root.findall('timestep'):
    time = float(timestep.get('time'))
    print(f"Processing Timestep: {time}")
    for agent in timestep.findall('person') + timestep.findall('vehicle'):
        agent_id = agent.get('id')
        print(f"  Found Agent ID: {agent_id}")

        # Additional Debug Info
        x, y = agent.get('x'), agent.get('y')
        if x and y:
            print(f"  Position: x={x}, y={y}")

