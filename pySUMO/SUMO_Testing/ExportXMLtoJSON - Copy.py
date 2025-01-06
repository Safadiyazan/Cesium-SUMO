import xml.etree.ElementTree as ET
import json
import sumolib  # Ensure sumolib is installed

print('===========================')
print('Export XML to JSON Process')
# Load the coordinate transformation
print('Loading Network Coordination')
net = sumolib.net.readNet('./ZurichNetwork/osm.net.xml.gz')
projection = net.getLocationOffset()

print('Loading XML')
# Parse the XML file
tree = ET.parse('SUMO_trajectories.xml')
root = tree.getroot()

# Dictionary to store agent data over time
agent_trajectories = {}

for timestep in root.findall('timestep'):
    time = float(timestep.get('time'))
    if time < 600:
        print('Timestep = ' + str(time))
        for agent in timestep.findall('person'):
            agentID = float(agent.get('id')[3:])
            print('Loading Agent Number: #' + str(agentID))
            if agentID < 200:
                x = float(agent.get('x'))
                y = float(agent.get('y'))
                lon, lat = net.convertXY2LonLat(x, y)  # Convert to longitude and latitude

                if agentID not in agent_trajectories:
                    # Initialize new agent entry
                    agent_trajectories[agentID] = {
                        'AMI': 1,  # Use vehicle ID as AMI
                        'stat': [],  # Status over time
                        'tda': time,  # Initial departure time
                        'taa': time + 10,  # Placeholder for arrival time (adjust logic as needed)
                        'rs': 1.0,  # Placeholder safety radius [m]
                        'rd': 5.0,  # Placeholder detection radius [m]
                        'x': [],  # SUMO x positions over time
                        'y': [],  # SUMO y positions over time
                        'z': [],  # Placeholder z positions over time
                        'lon': [],  # Longitudes over time
                        'lat': []   # Latitudes over time
                    }
                
                # Append data for the current timestep
                agent_trajectories[agentID]['stat'].append(1)  # Assuming status '1' for active
                agent_trajectories[agentID]['x'].append(x)
                agent_trajectories[agentID]['y'].append(y)
                agent_trajectories[agentID]['z'].append(0.0)  # Placeholder z position
                agent_trajectories[agentID]['lon'].append(lon)
                agent_trajectories[agentID]['lat'].append(lat)

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
with open('agent_trajectories.json', 'w') as json_file:
    json.dump(Data, json_file, indent=4)

print("Agent trajectory data with longitude and latitude has been exported to agent_trajectories.json")
