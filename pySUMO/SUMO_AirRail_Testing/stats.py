from sumolib import net

# Load the network
netfile = "dach-railways.net.xml"
network = net.readNet(netfile)

# Print basic statistics
print(f"Number of nodes: {len(network.getNodes())}")
print(f"Number of edges: {len(network.getEdges())}")

# Filter edges by type (e.g., railway)
rail_edges = [edge for edge in network.getEdges() if edge.getType() == "rail"]
print(f"Number of railway edges: {len(rail_edges)}")

# Print details of a specific edge
for edge in rail_edges[:5]:  # First 5 railway edges
    print(f"Edge ID: {edge.getID()}, From: {edge.getFromNode().getID()}, To: {edge.getToNode().getID()}, Speed: {edge.getSpeed()}")
