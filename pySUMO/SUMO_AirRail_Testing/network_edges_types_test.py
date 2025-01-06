from sumolib import net

# Load the network
network = net.readNet("dach-railways.net.xml")

# Get all edge types
edge_types = set(edge.getType() for edge in network.getEdges())

# Print edge types
print("Available edge types in the network:")
for edge_type in edge_types:
    print(edge_type)
