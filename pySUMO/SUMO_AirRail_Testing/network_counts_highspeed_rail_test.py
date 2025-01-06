from sumolib import net

# Load the network
network = net.readNet("dach-railways.net.xml")

# Specify desired edge types
desired_types = ["railway.highspeed", "railway.rail"]

# Filter edges by type
filtered_edges = [edge for edge in network.getEdges() if any(t in edge.getType() for t in desired_types)]

# Save filtered edge IDs
with open("filtered_edges.txt", "w") as f:
    for edge in filtered_edges:
        f.write(edge.getID() + "\n")

print(f"Filtered {len(filtered_edges)} edges of type {', '.join(desired_types)}.")
